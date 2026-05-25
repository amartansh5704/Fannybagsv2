import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { getOrCreateWallet, creditWallet } from '@/lib/wallet'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
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

    let dealEscrowHolding = 0
    let campaignEscrowHolding = 0
    let dealCommissions = 0
    let investmentCommissions = 0
    let royaltyPool = 0

    for (const tx of transactions) {
      if (tx.type === 'deal_escrow_received') {
        dealEscrowHolding += tx.amount
      }

      if (tx.type === 'deal_escrow_release') {
        dealEscrowHolding -= tx.amount
      }

      if (tx.type === 'campaign_escrow_received') {
        campaignEscrowHolding += tx.amount
      }

      if (tx.type === 'campaign_funds_release') {
        campaignEscrowHolding -= tx.amount
      }

      if (tx.type === 'campaign_platform_fee') {
        investmentCommissions += tx.amount
      }

      if (tx.type === 'deal_commission') {
        dealCommissions += tx.amount
      }

      if (tx.type === 'royalty_deposit') {
        royaltyPool += tx.amount
      }

      if (tx.type === 'royalty_distribution') {
        royaltyPool -= tx.amount
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        wallet,
        transactions,
        breakdown: {
          dealEscrowHolding,
          campaignEscrowHolding,
          dealCommissions,
          investmentCommissions,
          royaltyPool,
          totalPlatformRevenue:
            dealCommissions + investmentCommissions,
        },
      },
    })
  } catch (err) {
    console.error('[ADMIN WALLET]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const amount = Number(body.amount)

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount',
        },
        { status: 400 }
      )
    }

    await creditWallet(
      user.id,
      amount,
      'royalty_deposit',
      'Manual DSP royalty deposit'
    )

    return NextResponse.json({
      success: true,
      message: 'Royalty funds deposited',
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        success: false,
        error: 'Deposit failed',
      },
      { status: 500 }
    )
  }
}