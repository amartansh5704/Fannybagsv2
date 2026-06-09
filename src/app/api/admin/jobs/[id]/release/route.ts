import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { debitWallet, creditWallet } from '@/lib/wallet'

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

    if (!job)                  return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    if (!job.khapeetarId)      return NextResponse.json({ success: false, error: 'No khapeetar assigned' }, { status: 400 })
    if (!job.escrowAmount)     return NextResponse.json({ success: false, error: 'No escrow amount' }, { status: 400 })

    await prisma.$transaction(async (tx) => {
      // Debit admin wallet (escrow release)
      await debitWallet(user.id, job.escrowAmount!, 'job_escrow_release', `Escrow released for job: ${job.title}`, jobId, 'job', tx as any)
      // Credit khapeetar
      await creditWallet(job.khapeetarId!, job.escrowAmount!, 'job_payment', `Payment for job: ${job.title}`, jobId, 'job', tx as any)
      // Update job
      await (tx as any).job.update({ where: { id: jobId }, data: { status: 'paid' } })

      // Notify khapeetar
      await (tx as any).notification.create({
        data: { userId: job.khapeetarId!, type: 'escrow_released', title: 'Payment released!', body: `₹${job.escrowAmount?.toLocaleString('en-IN')} has been released for "${job.title}"` },
      })
    })

    return NextResponse.json({ success: true, message: `Released ₹${job.escrowAmount?.toLocaleString('en-IN')} to khapeetar` })
  } catch (err) {
    console.error('[POST /api/admin/jobs/[id]/release]', err)
    return NextResponse.json({ success: false, error: 'Release failed' }, { status: 500 })
  }
}