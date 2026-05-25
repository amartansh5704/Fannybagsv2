import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { dealId } = await params
    const { content } = await req.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message required' },
        { status: 400 }
      )
    }

    const deal = await prisma.dealRequest.findUnique({
      where: { id: dealId },
      include: {
        khapeetar: true,
        chatRoom: true,
      },
    })

    if (!deal || !deal.chatRoom) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      )
    }

    const isArtist = deal.artistId === user.id
    const isKhapeetar =
      user.role === 'khapeetar' &&
      deal.khapeetar.userId === user.id

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId: deal.chatRoom.id,
        senderId: user.id,
        content: content.trim(),
      },
    })

    return NextResponse.json({
      success: true,
      data: message,
    })
  } catch (err) {
    console.error('[POST /api/chat/message]', err)

    return NextResponse.json(
      { success: false, error: 'Send failed' },
      { status: 500 }
    )
  }
}