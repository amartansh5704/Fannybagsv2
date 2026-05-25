import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET(
  _req: NextRequest,
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

    const deal = await prisma.dealRequest.findUnique({
      where: { id: dealId },
      include: {
        khapeetar: true,
        chatRoom: {
          include: {
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
      },
    })

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal not found' },
        { status: 404 }
      )
    }

    const isArtist = deal.artistId === user.id
    const isKhapeetar =
      user.role === 'khapeetar' &&
      deal.khapeetar.userId === user.id

      if (
  deal.status !== 'active' &&
  deal.status !== 'completed'
) {
  return NextResponse.json(
    {
      success: false,
      error: 'Chat unavailable until escrow is funded',
    },
    { status: 403 }
  )
}   
    
    
      if (!isArtist && !isKhapeetar) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: deal.chatRoom,
    })
  } catch (err) {
    console.error('[GET /api/chat/[dealId]]', err)

    return NextResponse.json(
      { success: false, error: 'Fetch failed' },
      { status: 500 }
    )
  }
}