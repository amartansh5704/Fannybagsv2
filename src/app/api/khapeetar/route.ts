import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/khapeetar — public listing, no auth needed
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search       = searchParams.get('search')       ?? ''
    const role         = searchParams.get('role')         ?? ''
    const availability = searchParams.get('availability') ?? ''
    const workMode     = searchParams.get('workMode')     ?? ''

    const profiles = await prisma.khapeetarProfile.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name:        { contains: search, mode: 'insensitive' } },
              { primaryRole: { contains: search, mode: 'insensitive' } },
              { bio:         { contains: search, mode: 'insensitive' } },
              { skills:      { has: search } },
            ],
          } : {},
          role         ? { primaryRole:  { contains: role,         mode: 'insensitive' } } : {},
          availability ? { availability: { equals:   availability } }                      : {},
          workMode     ? { workMode:     { equals:   workMode     } }                      : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: profiles })
  } catch (err) {
    console.error('[GET /api/khapeetar]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}

// POST is now BLOCKED — signup goes through /api/auth/signup instead
export async function POST() {
  return NextResponse.json(
    { success: false, error: { code: 'FORBIDDEN', message: 'Use /api/auth/signup to create accounts' } },
    { status: 403 }
  )
}