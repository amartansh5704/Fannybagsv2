import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { getOrCreateWallet } from '@/lib/wallet'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body   = await req.json()
    const amount = Number(body.amount)
    const method = body.method || 'upi'
    const detail = body.detail || ''

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 })
    }
    if (amount < 100) {
      return NextResponse.json({ success: false, error: 'Minimum withdrawal is ₹100' }, { status: 400 })
    }
    if (!detail.trim()) {
      return NextResponse.json({ success: false, error: 'Payout destination required' }, { status: 400 })
    }

    const wallet = await getOrCreateWallet(user.id)
    if (wallet.balance < amount) {
      return NextResponse.json({ success: false, error: 'Insufficient balance' }, { status: 400 })
    }

    // Just create the request — do NOT debit yet
    // Wallet will be debited only when admin marks as paid
    const request = await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        amount,
        method,
        detail: detail.trim(),
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, data: request })
  } catch (err: any) {
    console.error('[WITHDRAW REQUEST]', err)
    return NextResponse.json({ success: false, error: 'Failed to submit withdrawal' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const requests = await prisma.withdrawalRequest.findMany({
      where:   { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: requests })
  } catch (err) {
    console.error('[GET WITHDRAWAL REQUESTS]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}