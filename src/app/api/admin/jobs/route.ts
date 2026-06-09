import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet, debitWallet } from '@/lib/wallet'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      include: {
        artist:    { select: { id: true, name: true, email: true } },
        khapeetar: { select: { id: true, name: true, email: true } },
        proposals: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (err) {
    console.error('[GET /api/admin/jobs]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}