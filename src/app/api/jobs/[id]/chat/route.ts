import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id: jobId } = await params

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        jobChatRoom: {
          include: {
            messages: {
              include: {
                sender: { select: { id: true, name: true, role: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    })

    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })

    const isArtist    = user.id === job.artistId
    const isKhapeetar = user.id === job.khapeetarId

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    if (job.status !== 'assigned' && job.status !== 'completed') {
      return NextResponse.json({ success: false, error: 'Chat only available after proposal is accepted' }, { status: 403 })
    }

    return NextResponse.json({ success: true, data: job.jobChatRoom })
  } catch (err) {
    console.error('[GET /api/jobs/[id]/chat]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}