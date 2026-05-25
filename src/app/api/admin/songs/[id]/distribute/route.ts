import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet, debitWallet, getOrCreateWallet } from '@/lib/wallet'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const revenueAmount = Number(body.revenueAmount)
    const spotifyStreams = Number(body.spotifyStreams ?? 0)
    const youtubeStreams = Number(body.youtubeStreams ?? 0)
    const appleStreams   = Number(body.appleStreams   ?? 0)

    if (!revenueAmount || revenueAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Revenue amount must be positive' },
        { status: 400 }
      )
    }

    // ── Fetch song + campaign + investments ──────────────────────────────────
    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        campaign: {
          include: {
            investments: {
              include: { fan: true },
            },
          },
        },
      },
    })

    if (!song) {
      return NextResponse.json({ success: false, error: 'Song not found' }, { status: 404 })
    }

    if (!song.campaign) {
      return NextResponse.json(
        { success: false, error: 'Song has no campaign — cannot distribute royalties' },
        { status: 400 }
      )
    }

    const campaign = song.campaign

    // ── Check admin wallet has enough to distribute ──────────────────────────
    const adminWallet = await getOrCreateWallet(user.id)
    if (adminWallet.balance < revenueAmount) {
      return NextResponse.json(
        { success: false, error: `Admin wallet balance (₹${adminWallet.balance.toLocaleString('en-IN')}) is insufficient for this distribution` },
        { status: 400 }
      )
    }

    // ── Calculate splits ─────────────────────────────────────────────────────
    // fanRevenueShare is stored as a percentage e.g. 30 means 30%
    const fanSharePct    = campaign.fanRevenueShare / 100
    const artistSharePct = 1 - fanSharePct

    const totalFanPool    = Math.round(revenueAmount * fanSharePct * 100) / 100
    const totalArtistCut  = Math.round((revenueAmount - totalFanPool) * 100) / 100

    // ── Build fan payout map ─────────────────────────────────────────────────
    // Each fan's payout = their ownershipPct / fanSharePct * revenueAmount
    // ownershipPct is already their share of the total revenue
    // e.g. ownershipPct = 6 means they get 6% of all revenue
    const fanPayouts: { userId: string; amount: number; ownershipPct: number }[] = []

    for (const inv of campaign.investments) {
      if (inv.status !== 'active') continue
      // ownershipPct is e.g. 6 (meaning 6% of total revenue)
      const fanCut = Math.round(revenueAmount * (inv.ownershipPct / 100) * 100) / 100
      if (fanCut > 0) {
        fanPayouts.push({
          userId:      inv.fanId,
          amount:      fanCut,
          ownershipPct: inv.ownershipPct,
        })
      }
    }

    // ── Run everything atomically ────────────────────────────────────────────
    const distribution = await prisma.$transaction(async (tx) => {

      // 1. Debit admin wallet (royalty pool → distribution)
      await debitWallet(
        user.id,
        revenueAmount,
        'royalty_distribution',
        `Royalty distribution for "${song.title}"`,
        id,
        'song',
        tx as any
      )

      // 2. Credit artist
      await creditWallet(
        song.artistId,
        totalArtistCut,
        'royalty_artist_credit',
        `Royalty payout (${Math.round(artistSharePct * 100)}%) for "${song.title}"`,
        id,
        'song',
        tx as any
      )

      // 3. Credit each fan proportionally
      for (const fp of fanPayouts) {
        await creditWallet(
          fp.userId,
          fp.amount,
          'royalty_fan_credit',
          `Royalty payout for "${song.title}"`,
          id,
          'song',
          tx as any
        )
      }

      // 4. Create RoyaltyDistribution record
      const dist = await (tx as any).royaltyDistribution.create({
        data: {
          songId:          id,
          revenueAmount,
          spotifyStreams,
          youtubeStreams,
          appleStreams,
          distributedById: user.id,
          payouts: {
            create: [
              // Artist payout
              {
                userId:      song.artistId,
                amount:      totalArtistCut,
                ownershipPct: Math.round(artistSharePct * 100),
              },
              // Fan payouts
              ...fanPayouts.map(fp => ({
                userId:      fp.userId,
                amount:      fp.amount,
                ownershipPct: fp.ownershipPct,
              })),
            ],
          },
        },
      })

      // 5. Update SongMetrics
      if (song.campaign) {
        await (tx as any).songMetrics.upsert({
          where: { songId: id },
          update: {
            totalRevenue:    { increment: revenueAmount },
            monthlyRevenue:  revenueAmount,
            totalStreams:    { increment: spotifyStreams + youtubeStreams + appleStreams },
            monthlyStreams:  spotifyStreams + youtubeStreams + appleStreams,
            artistEarnings:  { increment: totalArtistCut },
            fanPayoutsTotal: { increment: totalFanPool },
          },
          create: {
            songId:          id,
            totalRevenue:    revenueAmount,
            monthlyRevenue:  revenueAmount,
            totalStreams:    spotifyStreams + youtubeStreams + appleStreams,
            monthlyStreams:  spotifyStreams + youtubeStreams + appleStreams,
            artistEarnings:  totalArtistCut,
            fanPayoutsTotal: totalFanPool,
          },
        })
      }

      return dist
    })

    return NextResponse.json({
      success: true,
      data: distribution,
      message: `Distributed ₹${revenueAmount.toLocaleString('en-IN')} — Artist: ₹${totalArtistCut.toLocaleString('en-IN')}, Fans: ₹${totalFanPool.toLocaleString('en-IN')} across ${fanPayouts.length} investor(s)`,
    })
  } catch (err: any) {
    console.error('[POST /api/admin/songs/[id]/distribute]', err)
    const isInsufficient = err?.message?.includes('INSUFFICIENT_FUNDS')
    return NextResponse.json(
      { success: false, error: isInsufficient ? 'Admin wallet has insufficient balance' : 'Distribution failed' },
      { status: isInsufficient ? 400 : 500 }
    )
  }
}