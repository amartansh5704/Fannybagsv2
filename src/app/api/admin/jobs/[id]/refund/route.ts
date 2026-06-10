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
    if (!job.escrowAmount) return NextResponse.json({ success: false, error: 'No escrow amount' }, { status: 400 })

    const refundAmount = job.escrowAmount

    // Credit artist directly — admin wallet not touched
    await creditWallet(
      job.artistId,
      refundAmount,
      'job_refund',
      `Full refund for job: ${job.title}`,
      jobId,
      'job',
    )

    await prisma.$transaction(async (tx) => {
      await (tx as any).job.update({
        where: { id: jobId },
        data:  { status: 'refunded' },
      })

      await (tx as any).notification.create({
        data: {
          userId: job.artistId,
          type:   'escrow_refunded',
          title:  'Escrow Refunded ↩',
          body:   `₹${refundAmount.toLocaleString('en-IN')} has been refunded for "${job.title}"`,
        },
      })
    }, {
      timeout: 15000,
      maxWait:  5000,
    })

    return NextResponse.json({
      success: true,
      message: `Refunded ₹${refundAmount.toLocaleString('en-IN')} (100%) to artist`,
    })

  } catch (err) {
    console.error('[POST /api/admin/jobs/[id]/refund]', err)
    return NextResponse.json({ success: false, error: 'Refund failed' }, { status: 500 })
  }
}