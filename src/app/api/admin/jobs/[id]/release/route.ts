import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet } from '@/lib/wallet'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id: jobId } = await params
    const job = await prisma.job.findUnique({ where: { id: jobId } })

    if (!job)              return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    if (!job.khapeetarId)  return NextResponse.json({ success: false, error: 'No khapeetar assigned' }, { status: 400 })
    if (!job.escrowAmount) return NextResponse.json({ success: false, error: 'No escrow amount' }, { status: 400 })

    const totalEscrow     = job.escrowAmount
    const khapeetarPayout = Math.round(totalEscrow * 0.90 * 100) / 100
    const platformFee     = Math.round((totalEscrow - khapeetarPayout) * 100) / 100

    // Credit khapeetar 90% directly — admin wallet not touched
    await creditWallet(
      job.khapeetarId,
      khapeetarPayout,
      'job_payment',
      `Payment (90%) for job: ${job.title}`,
      jobId,
      'job',
    )

    // ── Fast DB operations in transaction ─────────────────────────────────────
    await prisma.$transaction(async (tx) => {
      // Update job status
      await (tx as any).job.update({
        where: { id: jobId },
        data:  { status: 'paid' },
      })

      // Record platform fee as info-only transaction (no balance change)
      const adminWallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
      if (adminWallet) {
        await (tx as any).walletTransaction.create({
          data: {
            walletId:      adminWallet.id,
            type:          'job_platform_fee',
            amount:        platformFee,
            description:   `Platform fee (10%) for job: ${job.title}`,
            referenceId:   jobId,
            referenceType: 'job',
          },
        })
      }

      // Notify khapeetar
      await (tx as any).notification.create({
        data: {
          userId: job.khapeetarId!,
          type:   'escrow_released',
          title:  'Payment released! 💰',
          body:   `₹${khapeetarPayout.toLocaleString('en-IN')} (90%) has been released for "${job.title}". Platform fee: ₹${platformFee.toLocaleString('en-IN')} (10%).`,
        },
      })
    }, {
      timeout: 15000,
      maxWait:  5000,
    })

    return NextResponse.json({
      success: true,
      message: `Released ₹${khapeetarPayout.toLocaleString('en-IN')} (90%) to khapeetar. Platform fee: ₹${platformFee.toLocaleString('en-IN')} (10%)`,
    })

  } catch (err) {
    console.error('[POST /api/admin/jobs/[id]/release]', err)
    return NextResponse.json({ success: false, error: 'Release failed' }, { status: 500 })
  }
}