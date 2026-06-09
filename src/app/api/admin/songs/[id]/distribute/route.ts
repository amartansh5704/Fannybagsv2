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
    const body   = await req.json()

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

    // ── Only active investments count ────────────────────────────────────────
    const activeInvestments = campaign.investments.filter(inv => inv.status === 'active')

    // ── Check admin wallet balance ───────────────────────────────────────────
    const adminWallet = await getOrCreateWallet(user.id)
    if (adminWallet.balance < revenueAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Admin wallet balance (₹${adminWallet.balance.toLocaleString('en-IN')}) is insufficient for this distribution`,
        },
        { status: 400 }
      )
    }

    // ── Calculate fan payouts proportionally ─────────────────────────────────
    //
    // Each fan's ownershipPct = their share of TOTAL revenue (not just fan pool)
    // e.g. fan invested ₹500 into a ₹10,000 campaign with 30% fan share
    //      → ownershipPct = (500/10000) * 30 = 1.5%
    //      → they get 1.5% of every future revenue distribution
    //
    // If no active fan investors → 100% goes to artist
    // Artist gets remainder = 100% - sum(fan ownershipPct)

    const fanPayouts: { userId: string; amount: number; ownershipPct: number }[] = []
    let totalFanPct = 0

    for (const inv of activeInvestments) {
      const fanCut = Math.round(revenueAmount * (inv.ownershipPct / 100) * 100) / 100
      if (fanCut > 0) {
        fanPayouts.push({
          userId:       inv.fanId,
          amount:       fanCut,
          ownershipPct: inv.ownershipPct,
        })
        totalFanPct += inv.ownershipPct
      }
    }

    // Artist gets whatever % is not claimed by fans (100% if no fans)
    const artistPct   = Math.max(0, 100 - totalFanPct)
    const totalFanCut = Math.round(revenueAmount * (totalFanPct / 100) * 100) / 100
    const artistCut   = Math.round(revenueAmount * (artistPct  / 100) * 100) / 100

    // Rounding safety — give remainder to artist
    const diff           = revenueAmount - (totalFanCut + artistCut)
    const finalArtistCut = Math.round((artistCut + diff) * 100) / 100

    // ── Run everything in one atomic transaction ──────────────────────────────
    const distribution = await prisma.$transaction(async (tx) => {

      // 1. Debit admin wallet
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
        finalArtistCut,
        'royalty_artist_credit',
        `Royalty payout (${artistPct.toFixed(2)}% of revenue) for "${song.title}"`,
        id,
        'song',
        tx as any
      )

      // 3. Credit each fan proportionally (skipped if no fans)
      for (const fp of fanPayouts) {
        await creditWallet(
          fp.userId,
          fp.amount,
          'royalty_fan_credit',
          `Royalty payout (${fp.ownershipPct.toFixed(2)}% of revenue) for "${song.title}"`,
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
              {
                userId:       song.artistId,
                amount:       finalArtistCut,
                ownershipPct: Number(artistPct.toFixed(2)),
              },
              ...fanPayouts.map(fp => ({
                userId:       fp.userId,
                amount:       fp.amount,
                ownershipPct: fp.ownershipPct,
              })),
            ],
          },
        },
      })

      // 5. Update SongMetrics
      await (tx as any).songMetrics.upsert({
        where: { songId: id },
        update: {
          totalRevenue:    { increment: revenueAmount },
          monthlyRevenue:  revenueAmount,
          totalStreams:    { increment: spotifyStreams + youtubeStreams + appleStreams },
          monthlyStreams:  spotifyStreams + youtubeStreams + appleStreams,
          artistEarnings:  { increment: finalArtistCut },
          fanPayoutsTotal: { increment: totalFanCut },
        },
        create: {
          songId:          id,
          totalRevenue:    revenueAmount,
          monthlyRevenue:  revenueAmount,
          totalStreams:    spotifyStreams + youtubeStreams + appleStreams,
          monthlyStreams:  spotifyStreams + youtubeStreams + appleStreams,
          artistEarnings:  finalArtistCut,
          fanPayoutsTotal: totalFanCut,
        },
      })

      return dist
    })

    return NextResponse.json({
      success: true,
      data: distribution,
      message: fanPayouts.length > 0
        ? `Distributed ₹${revenueAmount.toLocaleString('en-IN')} — Artist: ₹${finalArtistCut.toLocaleString('en-IN')} (${artistPct.toFixed(2)}%), Fans: ₹${totalFanCut.toLocaleString('en-IN')} across ${fanPayouts.length} investor(s)`
        : `Distributed ₹${revenueAmount.toLocaleString('en-IN')} — 100% to artist (no active fan investors)`,
    })

  } catch (err: any) {
    console.error('[POST /api/admin/songs/[id]/distribute]', err)
    const isInsufficient = err?.message?.includes('INSUFFICIENT_FUNDS')
    return NextResponse.json(
      {
        success: false,
        error: isInsufficient
          ? 'Admin wallet has insufficient balance'
          : 'Distribution failed',
      },
      { status: isInsufficient ? 400 : 500 }
    )
  }
}