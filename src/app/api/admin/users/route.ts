import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = req.nextUrl.searchParams.get('role')

    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (err) {
    console.error('[ADMIN USERS]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}