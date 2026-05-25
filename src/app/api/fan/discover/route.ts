import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      where: {
        campaign: {
          status: {
            in: ['live', 'pending_approval'],
          },
        },
      },
      include: {
        artist: true,
        campaign: true,
        metrics: true,
        distribution: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: songs,
    })
  } catch (err) {
    console.error('[FAN DISCOVER]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}