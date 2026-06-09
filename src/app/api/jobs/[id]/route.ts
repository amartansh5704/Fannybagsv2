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

    const { id } = await params

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, name: true, email: true } },
        proposals: {
          include: {
            khapeetar: {
              select: {
                id: true, name: true, email: true,
                khapeetarProfile: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: job })
  } catch (err) {
    console.error('[GET /api/jobs/[id]]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'artist') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body   = await req.json()

    const job = await prisma.job.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    if (job.artistId !== user.id) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const updated = await prisma.job.update({
      where: { id },
      data: {
        status: body.status ?? job.status,
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[PATCH /api/jobs/[id]]', err)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}