import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [
      songs,
      artists,
      fans,
      khapeetars,
      investments,
      deals,
      metrics,
    ] = await Promise.all([
      prisma.song.count(),
      prisma.user.count({ where: { role: 'artist' } }),
      prisma.user.count({ where: { role: 'fan' } }),
      prisma.khapeetarProfile.count(),
      prisma.investment.count(),
      prisma.dealRequest.count(),
      prisma.songMetrics.aggregate({
        _sum: {
          totalRevenue: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        songs,
        artists,
        fans,
        khapeetars,
        investments,
        deals,
        totalRevenue: metrics._sum.totalRevenue || 0,
      },
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}