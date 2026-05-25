/**
 * src/app/api/deals/[id]/complete/route.ts
 *
 * POST /api/deals/[id]/complete
 *
 * Either the artist or khapeetar calls this to mark their side complete.
 *
 * STATE MACHINE:
 *   - Artist calls  → artistCompleted = true
 *   - Khapeetar calls → khapeetarCompleted = true
 *   - When BOTH true → release escrow:
 *       Admin keeps 10%  (already in admin wallet, just reduce balance)
 *       Khapeetar gets 90% (credited to khapeetar wallet)
 *       Deal status → completed
 *
 * SAFETY GUARANTEES:
 *   - Deal must be status = 'active' to complete
 *   - Role check: artist can only mark artistCompleted, khapeetar only theirs
 *   - Escrow release is idempotent: if status already 'completed', returns 200
 *   - Entire release is one Prisma $transaction — no partial payouts
 *   - escrowAmount is recorded on deal at lock time; we use that, not a live calc
 */

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
      where:   { id },
      include: { khapeetar: true },
    })

    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 })
    }

    // ── Already completed — safe to return 200 (idempotent) ─────────────────
    if (deal.status === 'completed') {
      return NextResponse.json({ success: true, data: deal, message: 'Already completed' })
    }

    if (deal.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Only active deals can be completed' },
        { status: 400 }
      )
    }

    // ── Verify caller is a participant ───────────────────────────────────────
    const isArtist = user.role === 'artist' && deal.artistId === user.id

    let isKhapeetar = false
    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({
        where: { userId: user.id },
      })
      isKhapeetar = !!profile && deal.khapeetarId === profile.id
    }

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // ── Mark this party's completion ─────────────────────────────────────────
    const updateData: Record<string, boolean> = {}
    if (isArtist)     updateData.artistCompleted    = true
    if (isKhapeetar)  updateData.khapeetarCompleted = true

    const updatedDeal = await prisma.dealRequest.update({
      where: { id },
      data:  { ...updateData, updatedAt: new Date() },
    })

    // ── Check if BOTH parties have now confirmed ──────────────────────────────
    if (!updatedDeal.artistCompleted || !updatedDeal.khapeetarCompleted) {
      // Only one party done — wait for the other
      return NextResponse.json({
        success: true,
        data:    updatedDeal,
        message: 'Completion marked. Waiting for other party.',
      })
    }

    // ════════════════════════════════════════════════════════════════════════
    // BOTH CONFIRMED — release escrow
    // ════════════════════════════════════════════════════════════════════════
    const escrow = updatedDeal.escrowAmount ?? updatedDeal.acceptedBudget ?? updatedDeal.budget

    const adminCut      = Math.round(escrow * 0.10 * 100) / 100
    const khapeetarCut  = Math.round((escrow - adminCut) * 100) / 100

    const completed = await prisma.$transaction(async (tx) => {
      const adminId = await getAdminUserId(tx as any)

      // 1. Debit admin escrow by the khapeetar's share
      //    (admin already holds full escrow; we reduce it by khapeetarCut,
      //     leaving adminCut as the platform commission)
      await (tx as any).wallet.update({
        where: { userId: adminId },
        data: {
          balance:    { decrement: khapeetarCut },
          totalSpent: { increment: khapeetarCut },
          updatedAt:  new Date(),
        },
      })

      // Record the admin escrow release transaction
      const adminWallet = await (tx as any).wallet.findUnique({
        where: { userId: adminId },
      })
      await (tx as any).walletTransaction.create({
        data: {
          walletId:      adminWallet.id,
          type:          'deal_escrow_release',
          amount:        khapeetarCut,
          description:   `Escrow released to khapeetar for deal: "${deal.projectTitle}"`,
          referenceId:   deal.id,
          referenceType: 'deal',
        },
      })

      // 2. Credit khapeetar their 90%
      await creditWallet(
        deal.khapeetar.userId,
        khapeetarCut,
        'khapeetar_payout',
        `Deal payout (90%) for: "${deal.projectTitle}"`,
        deal.id,
        'deal',
        tx as any
      )

      // 3. Record admin commission as a separate transaction for clarity
      const adminWalletFinal = await (tx as any).wallet.findUnique({
        where: { userId: adminId },
      })
      await (tx as any).walletTransaction.create({
        data: {
          walletId:      adminWalletFinal.id,
          type:          'deal_commission',
          amount:        adminCut,
          description:   `10% platform commission for deal: "${deal.projectTitle}"`,
          referenceId:   deal.id,
          referenceType: 'deal',
        },
      })

      // 4. Mark deal completed
      return (tx as any).dealRequest.update({
        where: { id: deal.id },
        data:  { status: 'completed', updatedAt: new Date() },
      })
    })

    return NextResponse.json({
      success: true,
      data:    completed,
      message: `Deal completed. Khapeetar paid ${formatINR(khapeetarCut)}, platform commission ${formatINR(adminCut)}.`,
    })
  } catch (err) {
    console.error('[POST /api/deals/[id]/complete]', err)
    return NextResponse.json({ success: false, error: 'Completion failed' }, { status: 500 })
  }
}

function formatINR(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}