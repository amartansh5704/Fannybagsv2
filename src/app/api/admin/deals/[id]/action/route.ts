import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet } from '@/lib/wallet'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id }   = await params
    const body     = await req.json()

    const deal = await prisma.dealRequest.findUnique({
      where: { id },
      include: { khapeetar: true, artist: true },
    })

    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 })
    }

    if (deal.status === 'admin_released' || deal.status === 'refunded') {
      return NextResponse.json({ success: false, error: 'Deal already finalised' }, { status: 400 })
    }

    if (deal.status !== 'active' && deal.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: `Cannot act on a deal with status: ${deal.status}` },
        { status: 400 }
      )
    }

    const escrowAmount = deal.escrowAmount || deal.acceptedBudget || deal.budget
    if (!escrowAmount || escrowAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid escrow amount' }, { status: 400 })
    }

    // ── RELEASE FUNDS (90% to khapeetar, 10% as platform fee) ───────────────
    if (body.action === 'release_funds') {
      const khapeetarAmount = Math.round(escrowAmount * 0.9 * 100) / 100
      const adminCut        = Math.round((escrowAmount - khapeetarAmount) * 100) / 100

      // Credit khapeetar 90% directly — admin wallet not touched
      await creditWallet(
        deal.khapeetar.userId,
        khapeetarAmount,
        'khapeetar_manual_payout',
        `Payout (90%) for "${deal.projectTitle}"`,
        deal.id,
        'deal',
      )

      // Record platform fee as info-only transaction (no balance change)
      const adminWallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
      if (adminWallet) {
        await prisma.walletTransaction.create({
          data: {
            walletId:      adminWallet.id,
            type:          'deal_commission',
            amount:        adminCut,
            description:   `Platform fee (10%) for "${deal.projectTitle}"`,
            referenceId:   deal.id,
            referenceType: 'deal',
          },
        })
      }

      await prisma.dealRequest.update({
        where: { id: deal.id },
        data: {
          status:             'admin_released',
          adminAction:        'released',
          adminActionAt:      new Date(),
          artistCompleted:    true,
          khapeetarCompleted: true,
          updatedAt:          new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: `Released ₹${khapeetarAmount.toLocaleString('en-IN')} (90%) to khapeetar. Platform fee: ₹${adminCut.toLocaleString('en-IN')} (10%)`,
      })
    }

    // ── REFUND TO ARTIST (100%) ───────────────────────────────────────────────
    if (body.action === 'refund_artist') {
      // Credit artist directly — admin wallet not touched
      await creditWallet(
        deal.artistId,
        escrowAmount,
        'artist_refund_credit',
        `Full refund for "${deal.projectTitle}"`,
        deal.id,
        'deal',
      )

      await prisma.dealRequest.update({
        where: { id: deal.id },
        data: {
          status:        'refunded',
          adminAction:   'refunded',
          adminActionAt: new Date(),
          updatedAt:     new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: `Refunded ₹${escrowAmount.toLocaleString('en-IN')} (100%) to artist`,
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })

  } catch (err) {
    console.error('[ADMIN DEAL ACTION]', err)
    return NextResponse.json({ success: false, error: 'Action failed' }, { status: 500 })
  }
}