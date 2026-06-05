
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import {
  creditWallet,
  debitWallet,
  getAdminUserId,
} from '@/lib/wallet'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const body = await req.json()

    const deal = await prisma.dealRequest.findUnique({
      where: {
        id,
      },
      include: {
        khapeetar: true,
        artist: true,
      },
    })

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deal not found',
        },
        { status: 404 }
      )
    }

    // =========================================
    // SAFETY: BLOCK FINALIZED DEALS
    // =========================================
    if (
      deal.status === 'completed' ||
      deal.status === 'admin_released' ||
      deal.status === 'refunded'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Deal already finalized',
        },
        { status: 400 }
      )
    }

    // =========================================
    // ONLY ACTIVE DEALS
    // =========================================
    if (deal.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only active deals can be managed',
        },
        { status: 400 }
      )
    }

    const escrowAmount =
      deal.escrowAmount ||
      deal.acceptedBudget ||
      deal.budget

    if (!escrowAmount || escrowAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid escrow amount',
        },
        { status: 400 }
      )
    }

    // =========================================
    // MANUAL RELEASE TO KHAPEETAR
    // =========================================
    if (body.action === 'release_funds') {
      const adminCut =
        Math.round(escrowAmount * 0.1 * 100) / 100

      const khapeetarAmount =
        Math.round((escrowAmount - adminCut) * 100) / 100

      await prisma.$transaction(async (tx) => {
        const adminId = await getAdminUserId(tx as any)

        // =========================================
        // ADMIN ESCROW DEBIT
        // =========================================
        await debitWallet(
          adminId,
          khapeetarAmount,
          'admin_manual_release',
          `Manual release for ${deal.projectTitle}`,
          deal.id,
          'deal',
          tx as any
        )

        // =========================================
        // KHAPEETAR CREDIT
        // =========================================
        await creditWallet(
          deal.khapeetar.userId,
          khapeetarAmount,
          'khapeetar_manual_payout',
          `Manual payout for ${deal.projectTitle}`,
          deal.id,
          'deal',
          tx as any
        )

        // =========================================
        // ADMIN COMMISSION RECORD
        // =========================================
        await creditWallet(
          adminId,
          adminCut,
          'deal_commission',
          `Deal commission for ${deal.projectTitle}`,
          deal.id,
          'deal',
          tx as any
        )

        // =========================================
        // FINAL STATUS
        // =========================================
        await (tx as any).dealRequest.update({
          where: {
            id: deal.id,
          },
          data: {
            status: 'admin_released',
            adminAction: 'released',
            adminActionAt: new Date(),
            artistCompleted: true,
            khapeetarCompleted: true,
            updatedAt: new Date(),
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: 'Funds released to khapeetar',
      })
    }

    // =========================================
    // REFUND TO ARTIST
    // =========================================
    if (body.action === 'refund_artist') {
      await prisma.$transaction(async (tx) => {
        const adminId = await getAdminUserId(tx as any)

        // =========================================
        // ADMIN ESCROW DEBIT
        // =========================================
        await debitWallet(
          adminId,
          escrowAmount,
          'admin_manual_refund',
          `Refund for ${deal.projectTitle}`,
          deal.id,
          'deal',
          tx as any
        )

        // =========================================
        // ARTIST REFUND
        // =========================================
        await creditWallet(
          deal.artistId,
          escrowAmount,
          'artist_refund_credit',
          `Refund for ${deal.projectTitle}`,
          deal.id,
          'deal',
          tx as any
        )

        // =========================================
        // FINAL STATUS
        // =========================================
        await (tx as any).dealRequest.update({
          where: {
            id: deal.id,
          },
          data: {
            status: 'refunded',
            adminAction: 'refunded',
            adminActionAt: new Date(),
            updatedAt: new Date(),
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: 'Funds refunded to artist',
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
      },
      { status: 400 }
    )
  } catch (err) {
    console.error('[ADMIN DEAL ACTION]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Action failed',
      },
      { status: 500 }
    )
  }
}
