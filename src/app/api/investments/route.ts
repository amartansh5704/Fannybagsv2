import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'fan') {
      return NextResponse.json(
        { success: false, error: 'Only fans can invest' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { campaignId, amount } = body
    const investAmount = Number(amount)

    if (!campaignId || investAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid investment' },
        { status: 400 }
      )
    }

    const fanWallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
    if (!fanWallet || fanWallet.balance < investAmount) {
      return NextResponse.json(
        { success: false, error: 'Insufficient wallet balance' },
        { status: 400 }
      )
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { song: { include: { artist: true } } },
    })

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }
    if (campaign.fundsReleased) {
      return NextResponse.json(
        { success: false, error: 'Campaign already released' },
        { status: 400 }
      )
    }

    const ownershipPct =
      (investAmount / campaign.totalFundingAsk) * campaign.fanRevenueShare

    // ── Breakeven calculation ─────────────────────────────────────────────────
    const revenuePerStream = 0.05
    const fanPayPerStream  = revenuePerStream * (campaign.fanRevenueShare / 100)
    const breakevenStreams  = fanPayPerStream > 0
      ? Math.round(campaign.totalFundingAsk / fanPayPerStream)
      : 0

    const formatStreams = (n: number) => {
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
      if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
      if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
      return n.toLocaleString('en-IN')
    }

    // ── Run transaction ───────────────────────────────────────────────────────
    // Only fan wallet is debited here.
    // Admin wallet is credited only when funds are released to artist.
    const result = await prisma.$transaction(async (tx) => {
      // Debit fan wallet
      await tx.wallet.update({
        where: { id: fanWallet.id },
        data: {
          balance:    { decrement: investAmount },
          totalSpent: { increment: investAmount },
        },
      })

      // Record fan debit transaction only — no admin wallet entry at this stage
      await tx.walletTransaction.create({
        data: {
          walletId:      fanWallet.id,
          type:          'investment_debit',
          amount:        investAmount,
          referenceId:   campaign.id,
          referenceType: 'campaign',
          description:   'Fan investment',
        },
      })

      // Create investment record
      const investment = await tx.investment.create({
        data: {
          fanId:        user.id,
          campaignId,
          amount:       investAmount,
          ownershipPct,
          status:       'active',
        },
      })

      // Update campaign raised amount
      await tx.campaign.update({
        where: { id: campaign.id },
        data: {
          amountRaised:     { increment: investAmount },
          escrowHeldAmount: { increment: investAmount },
        },
      })

      return investment
    })

    // ── Build contract data ───────────────────────────────────────────────────
    const contractData = {
      investmentId: result.id,
      contractDate: new Date().toISOString(),
      fan: {
        id:    user.id,
        name:  user.name,
        email: user.email,
      },
      artist: {
        id:    campaign.song.artist.id,
        name:  campaign.song.artist.name,
        email: campaign.song.artist.email,
      },
      song: {
        id:       campaign.song.id,
        title:    campaign.song.title,
        language: campaign.song.language,
        genre:    campaign.song.genre,
      },
      campaign: {
        id:              campaign.id,
        totalFundingAsk: campaign.totalFundingAsk,
        fanRevenueShare: campaign.fanRevenueShare,
        campaignEndDate: campaign.campaignEndDate,
        minInvestment:   campaign.minInvestment,
      },
      investment: {
        amount:       investAmount,
        ownershipPct: ownershipPct,
      },
      economics: {
        revenuePerStream:         0.05,
        breakevenStreams,
        breakevenStreamsFormatted: formatStreams(breakevenStreams),
      },
    }

    return NextResponse.json({
      success: true,
      data:    result,
      contract: contractData,
    })

  } catch (err) {
    console.error('[INVEST]', err)
    return NextResponse.json(
      { success: false, error: 'Investment failed' },
      { status: 500 }
    )
  }
}