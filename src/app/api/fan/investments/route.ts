import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'fan') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const investments = await prisma.investment.findMany({
      where: {
        fanId: user.id,
      },
      include: {
        campaign: {
          include: {
            song: {
              include: {
                artist: true,
                metrics: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const enriched = investments.map((inv) => {
      const metrics = inv.campaign.song.metrics
      const totalRevenue = metrics?.totalRevenue || 0
      const totalStreams = metrics?.totalStreams || 0
      const totalInvestors = metrics?.totalInvestors || 0

      const fanRevenuePool =
        totalRevenue * (inv.campaign.fanRevenueShare / 100)

      const estimatedPayout =
        fanRevenuePool *
        (inv.ownershipPct / inv.campaign.fanRevenueShare)

      const roi =
        inv.amount > 0
          ? ((estimatedPayout / inv.amount) * 100)
          : 0

      return {
        ...inv,
        analytics: {
          totalRevenue,
          totalStreams,
          totalInvestors,
          estimatedPayout,
          roi,
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: enriched,
    })
  } catch (err) {
    console.error('[FAN INVESTMENTS]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}