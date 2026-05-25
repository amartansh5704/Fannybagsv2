import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params  // ← this is the fix

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'Missing song id' } },
        { status: 400 }
      )
    }

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        artist:       true,
        campaign:     { include: { investments: true } },
        distribution: true,
        metrics:      true,
      },
    })

    if (!song) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Song not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: song })
  } catch (err) {
    console.error('[GET /api/songs/[id]]', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Fetch failed' } },
      { status: 500 }
    )
  }
}