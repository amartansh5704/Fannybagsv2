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

    const investments = await prisma.investment.findMany({
      include: {
        fan: true,
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

    return NextResponse.json({
      success: true,
      data: investments,
    })
  } catch (err) {
    console.error('[ADMIN INVESTMENTS]', err)

    return NextResponse.json(
      { success: false, error: 'Fetch failed' },
      { status: 500 }
    )
  }
}