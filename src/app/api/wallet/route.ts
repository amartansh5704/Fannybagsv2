import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { getOrCreateWallet } from '@/lib/wallet'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wallet = await getOrCreateWallet(user.id)

    const transactions = await prisma.walletTransaction.findMany({
      where: {
        walletId: wallet.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        wallet,
        transactions,
      },
    })
  } catch (err) {
    console.error('[GET WALLET]', err)

    return NextResponse.json(
      { success: false, error: 'Fetch failed' },
      { status: 500 }
    )
  }
}