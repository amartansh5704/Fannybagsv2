import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id: jobId } = await params

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    if (job.status !== 'assigned') return NextResponse.json({ success: false, error: 'Job is not in progress' }, { status: 400 })

    const isArtist     = user.id === job.artistId
    const isKhapeetar  = user.id === job.khapeetarId

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Mark the appropriate side as complete
    const updateData: any = {}
    if (isArtist)    updateData.artistCompleted     = true
    if (isKhapeetar) updateData.khapeetarCompleted  = true

    const updated = await prisma.job.update({
      where: { id: jobId },
      data:  updateData,
    })

    // If BOTH sides marked complete → mark job as completed and ping admin
    if (updated.artistCompleted && updated.khapeetarCompleted) {
      await prisma.job.update({
        where: { id: jobId },
        data:  { status: 'completed' },
      })

      // Notify admin
      const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
      if (admin) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type:   'job_completed',
            title:  'Job completed — escrow action needed',
            body:   `Job "${job.title}" has been marked complete by both parties. ₹${job.escrowAmount?.toLocaleString('en-IN')} is awaiting release.`,
          },
        })
      }

      return NextResponse.json({ success: true, message: 'Job completed. Admin notified to release funds.' })
    }

    return NextResponse.json({
      success: true,
      message: isArtist
        ? 'Marked complete on your side. Waiting for khapeetar.'
        : 'Marked complete on your side. Waiting for artist.',
    })

  } catch (err) {
    console.error('[POST /api/jobs/[id]/complete]', err)
    return NextResponse.json({ success: false, error: 'Complete failed' }, { status: 500 })
  }
}