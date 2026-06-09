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
      return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { song: { include: { artist: true } } },
    })

    if (!campaign) return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 })
    if (campaign.fundsReleased) return NextResponse.json({ success: false, error: 'Campaign already released' }, { status: 400 })

    const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
    if (!admin) return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 500 })

    const adminWallet = await prisma.wallet.upsert({
      where: { userId: admin.id },
      update: {},
      create: { userId: admin.id },
    })

    const ownershipPct = (investAmount / campaign.totalFundingAsk) * campaign.fanRevenueShare

    // ── Breakeven calculation ────────────────────────────────────────
    const revenuePerStream  = 0.05
    const fanPayPerStream   = revenuePerStream * (campaign.fanRevenueShare / 100)
    const breakevenStreams   = fanPayPerStream > 0
      ? Math.round(campaign.totalFundingAsk / fanPayPerStream)
      : 0

    const formatStreams = (n: number) => {
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
      if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`
      if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`
      return n.toLocaleString('en-IN')
    }

    // ── Run transaction ──────────────────────────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: fanWallet.id },
        data: { balance: { decrement: investAmount }, totalSpent: { increment: investAmount } },
      })
      await tx.wallet.update({
        where: { id: adminWallet.id },
        data: { balance: { increment: investAmount }, totalReceived: { increment: investAmount } },
      })
      await tx.walletTransaction.createMany({
        data: [
          { walletId: fanWallet.id, type: 'investment_debit', amount: investAmount, referenceId: campaign.id, referenceType: 'campaign', description: 'Fan investment' },
          { walletId: adminWallet.id, type: 'campaign_escrow_received', amount: investAmount, referenceId: campaign.id, referenceType: 'campaign', description: 'Campaign escrow received' },
        ],
      })

      const investment = await tx.investment.create({
        data: { fanId: user.id, campaignId, amount: investAmount, ownershipPct, status: 'active' },
      })

      await tx.campaign.update({
        where: { id: campaign.id },
        data: { amountRaised: { increment: investAmount }, escrowHeldAmount: { increment: investAmount } },
      })

      return investment
    })

    // ── Build contract data (returned to client for PDF generation) ──
    const contractData = {
      investmentId:   result.id,
      contractDate:   new Date().toISOString(),
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
        revenuePerStream: 0.05,
        breakevenStreams,
        breakevenStreamsFormatted: formatStreams(breakevenStreams),
      },
    }

    return NextResponse.json({
      success: true,
      data: result,
      contract: contractData,
    })
  } catch (err) {
    console.error('[INVEST]', err)
    return NextResponse.json({ success: false, error: 'Investment failed' }, { status: 500 })
  }
}