import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet, getAdminUserId } from '@/lib/wallet'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const deal = await prisma.dealRequest.findUnique({
      where: { id },
      include: { khapeetar: true },
    })

    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 })
    }

    if (
      deal.status === 'completed' ||
      deal.status === 'admin_released' ||
      deal.status === 'refunded'
    ) {
      return NextResponse.json({ success: true, data: deal, message: 'Deal already finalized' })
    }

    if (deal.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Only active deals can be completed' },
        { status: 400 }
      )
    }

    // ── Verify participant ────────────────────────────────────────────────────
    const isArtist = user.role === 'artist' && deal.artistId === user.id

    let isKhapeetar = false
    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({ where: { userId: user.id } })
      isKhapeetar   = !!profile && deal.khapeetarId === profile.id
    }

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // ── Mark this party's completion ─────────────────────────────────────────
    const updateData: Record<string, boolean> = {}
    if (isArtist)    updateData.artistCompleted    = true
    if (isKhapeetar) updateData.khapeetarCompleted = true

    const updatedDeal = await prisma.dealRequest.update({
      where: { id },
      data:  { ...updateData, updatedAt: new Date() },
    })

    // ── Wait for both parties ─────────────────────────────────────────────────
    if (!updatedDeal.artistCompleted || !updatedDeal.khapeetarCompleted) {
      return NextResponse.json({
        success: true,
        data:    updatedDeal,
        message: 'Completion marked. Waiting for other party.',
      })
    }

    // ── Both confirmed — release escrow ───────────────────────────────────────
    const escrow       = updatedDeal.escrowAmount ?? updatedDeal.acceptedBudget ?? updatedDeal.budget
    const adminCut     = Math.round(escrow * 0.1 * 100) / 100
    const khapeetarCut = Math.round((escrow - adminCut) * 100) / 100

    const adminId     = await getAdminUserId()
    const adminWallet = await prisma.wallet.findUnique({ where: { userId: adminId } })

    if (!adminWallet) {
      return NextResponse.json({ success: false, error: 'Admin wallet not found' }, { status: 500 })
    }

    // 1. Debit admin wallet (90% out to khapeetar)
    await prisma.wallet.update({
      where: { userId: adminId },
      data: {
        balance:    { decrement: khapeetarCut },
        totalSpent: { increment: khapeetarCut },
        updatedAt:  new Date(),
      },
    })

    await prisma.walletTransaction.create({
      data: {
        walletId:      adminWallet.id,
        type:          'deal_escrow_release',
        amount:        khapeetarCut,
        description:   `Escrow released (90%) for "${deal.projectTitle}"`,
        referenceId:   deal.id,
        referenceType: 'deal',
      },
    })

    // 2. Credit khapeetar (90%)
    await creditWallet(
      deal.khapeetar.userId,
      khapeetarCut,
      'khapeetar_payout',
      `Deal payout (90%) for "${deal.projectTitle}"`,
      deal.id,
      'deal',
    )

    // 3. Record platform fee (10% stays in admin wallet)
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

    // 4. Mark deal completed
    const completed = await prisma.dealRequest.update({
      where: { id: deal.id },
      data:  { status: 'completed', updatedAt: new Date() },
    })

    // 5. Notify admin
    await prisma.notification.create({
      data: {
        userId: adminId,
        type:   'deal_completed',
        title:  'Deal completed — funds released',
        body:   `"${deal.projectTitle}" completed. ₹${khapeetarCut.toLocaleString('en-IN')} paid to khapeetar. Platform fee: ₹${adminCut.toLocaleString('en-IN')}.`,
      },
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      data:    completed,
      message: `Deal completed. Khapeetar paid ₹${khapeetarCut.toLocaleString('en-IN')} (90%). Platform fee: ₹${adminCut.toLocaleString('en-IN')} (10%).`,
    })

  } catch (err) {
    console.error('[POST /api/deals/[id]/complete]', err)
    return NextResponse.json({ success: false, error: 'Completion failed' }, { status: 500 })
  }
}