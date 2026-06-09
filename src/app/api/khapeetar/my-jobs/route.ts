import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Jobs where this user is the accepted khapeetar
    const jobs = await prisma.job.findMany({
      where: {
        khapeetarId: user.id,
        status: { in: ['assigned', 'completed', 'paid', 'refunded'] },
      },
      include: {
        artist: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (err) {
    console.error('[GET /api/khapeetar/my-jobs]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}