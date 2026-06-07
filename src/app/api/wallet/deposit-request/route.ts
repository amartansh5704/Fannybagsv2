import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { amount, utrNumber, screenshotUrl } = body

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })
    }
    if (!utrNumber?.trim() && !screenshotUrl) {
      return NextResponse.json({ success: false, error: 'UTR number or screenshot required' }, { status: 400 })
    }

    const request = await prisma.depositRequest.create({
      data: {
        userId:        user.id,
        amount:        Number(amount),
        utrNumber:     utrNumber?.trim() || null,
        screenshotUrl: screenshotUrl || null,
        status:        'pending',
      },
    })

    return NextResponse.json({ success: true, data: request })
  } catch (err) {
    console.error('[DEPOSIT REQUEST]', err)
    return NextResponse.json({ success: false, error: 'Failed to submit request' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.depositRequest.findMany({
      where:   { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: requests })
  } catch (err) {
    console.error('[GET DEPOSIT REQUESTS]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}