import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const search   = searchParams.get('search')   || ''
    const category = searchParams.get('category') || ''
    const sort     = searchParams.get('sort')     || 'newest'

    const jobs = await prisma.job.findMany({
      where: {
        status: 'open',
        ...(search ? {
          OR: [
            { title:       { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { category:    { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
        ...(category ? { category } : {}),
      },
      include: {
        artist:    { select: { id: true, name: true } },
        proposals: { select: { id: true } },
      },
      orderBy: sort === 'oldest'
        ? { createdAt: 'asc' }
        : sort === 'budget_high'
          ? { budget: 'desc' }
          : { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (err) {
    console.error('[GET /api/khapeetar/jobs]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}