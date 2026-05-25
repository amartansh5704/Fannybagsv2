import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { depositWallet } from '@/lib/wallet'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const amount = Number(body.amount)

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const wallet = await depositWallet(user.id, amount)

    return NextResponse.json({
      success: true,
      data: wallet,
    })
  } catch (err) {
    console.error('[DEPOSIT]', err)

    return NextResponse.json(
      { success: false, error: 'Deposit failed' },
      { status: 500 }
    )
  }
}