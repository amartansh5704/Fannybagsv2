import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const { id } = await params

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        artist: {
          include: {
            artistProfile: true,
          },
        },
        campaign: {
          include: {
            investments: {
              include: {
                fan: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        distribution: true,
        metrics: true,
        royaltyDistributions: {
          include: {
            payouts: true,
          },
          orderBy: {
            distributedAt: 'desc',
          },
        },
      },
    })

    if (!song) {
      return NextResponse.json(
        {
          success: false,
          error: 'Song not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: song,
    })
  } catch (err) {
    console.error('[ADMIN SONG DETAIL]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}