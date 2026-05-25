import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

// GET /api/khapeetar/me — returns the khapeetar profile for the logged-in user
export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user)                    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'khapeetar') return NextResponse.json({ success: false, error: 'Forbidden'    }, { status: 403 })

    const profile = await prisma.khapeetarProfile.findUnique({
      where: { userId: user.id },
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Profile not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: profile })
  } catch (err) {
    console.error('[GET /api/khapeetar/me]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}