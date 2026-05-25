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

    const deals = await prisma.dealRequest.findMany({
      include: {
        artist: true,
        khapeetar: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: deals,
    })
  } catch (err) {
    console.error('[ADMIN DEALS]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}