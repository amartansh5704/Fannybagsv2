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

    if (!job)              return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })


    await prisma.$transaction(async (tx) => {
      await debitWallet(user.id, job.escrowAmount!, 'job_escrow_refund', `Escrow refunded for job: ${job.title}`, jobId, 'job', tx as any)
      await creditWallet(job.artistId, job.escrowAmount!, 'job_refund', `Refund for job: ${job.title}`, jobId, 'job', tx as any)
      await (tx as any).job.update({ where: { id: jobId }, data: { status: 'refunded' } })

      await (tx as any).notification.create({
        data: { userId: job.artistId, type: 'escrow_refunded', title: 'Escrow refunded', body: `₹${job.escrowAmount?.toLocaleString('en-IN')} has been refunded for "${job.title}"` },
      })
    })

    return NextResponse.json({ success: true, message: `Refunded ₹${job.escrowAmount?.toLocaleString('en-IN')} to artist` })
  } catch (err) {
    console.error('[POST /api/admin/jobs/[id]/refund]', err)
    return NextResponse.json({ success: false, error: 'Refund failed' }, { status: 500 })
  }
}