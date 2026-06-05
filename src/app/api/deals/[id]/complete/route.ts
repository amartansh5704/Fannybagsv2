

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet, getAdminUserId } from '@/lib/wallet'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const { id } = await params

    const deal = await prisma.dealRequest.findUnique({
      where: {
        id,
      },
      include: {
        khapeetar: true,
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
    // SAFETY: ALREADY FINALIZED
    // =========================================
    if (
      deal.status === 'completed' ||
      deal.status === 'admin_released' ||
      deal.status === 'refunded'
    ) {
      return NextResponse.json({
        success: true,
        data: deal,
        message: 'Deal already finalized',
      })
    }

    // =========================================
    // ONLY ACTIVE DEALS
    // =========================================
    if (deal.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Only active deals can be completed',
        },
        { status: 400 }
      )
    }

    // =========================================
    // VERIFY PARTICIPANT
    // =========================================
    const isArtist =
      user.role === 'artist' &&
      deal.artistId === user.id

    let isKhapeetar = false

    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({
        where: {
          userId: user.id,
        },
      })

      isKhapeetar =
        !!profile &&
        deal.khapeetarId === profile.id
    }

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
        },
        { status: 403 }
      )
    }

    // =========================================
    // MARK COMPLETION
    // =========================================
    const updateData: Record<string, boolean> = {}

    if (isArtist) {
      updateData.artistCompleted = true
    }

    if (isKhapeetar) {
      updateData.khapeetarCompleted = true
    }

    const updatedDeal = await prisma.dealRequest.update({
      where: {
        id,
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    })

    // =========================================
    // WAIT FOR BOTH USERS
    // =========================================
    if (
      !updatedDeal.artistCompleted ||
      !updatedDeal.khapeetarCompleted
    ) {
      return NextResponse.json({
        success: true,
        data: updatedDeal,
        message: 'Completion marked. Waiting for other party.',
      })
    }

    // =========================================
    // RELEASE ESCROW
    // =========================================
    const escrow =
      updatedDeal.escrowAmount ??
      updatedDeal.acceptedBudget ??
      updatedDeal.budget

    const adminCut =
      Math.round(escrow * 0.1 * 100) / 100

    const khapeetarCut =
      Math.round((escrow - adminCut) * 100) / 100

    const completed = await prisma.$transaction(async (tx) => {
      const adminId = await getAdminUserId(tx as any)

      // =========================================
      // ADMIN ESCROW DEBIT
      // =========================================
      await (tx as any).wallet.update({
        where: {
          userId: adminId,
        },
        data: {
          balance: {
            decrement: khapeetarCut,
          },
          totalSpent: {
            increment: khapeetarCut,
          },
          updatedAt: new Date(),
        },
      })

      const adminWallet = await (tx as any).wallet.findUnique({
        where: {
          userId: adminId,
        },
      })

      await (tx as any).walletTransaction.create({
        data: {
          walletId: adminWallet.id,
          type: 'deal_escrow_release',
          amount: khapeetarCut,
          description: `Escrow released for "${deal.projectTitle}"`,
          referenceId: deal.id,
          referenceType: 'deal',
        },
      })

      // =========================================
      // KHAPEETAR CREDIT
      // =========================================
      await creditWallet(
        deal.khapeetar.userId,
        khapeetarCut,
        'khapeetar_payout',
        `Deal payout for "${deal.projectTitle}"`,
        deal.id,
        'deal',
        tx as any
      )

      // =========================================
      // ADMIN COMMISSION
      // =========================================
      const adminWalletFinal =
        await (tx as any).wallet.findUnique({
          where: {
            userId: adminId,
          },
        })

      await (tx as any).walletTransaction.create({
        data: {
          walletId: adminWalletFinal.id,
          type: 'deal_commission',
          amount: adminCut,
          description: `10% commission for "${deal.projectTitle}"`,
          referenceId: deal.id,
          referenceType: 'deal',
        },
      })

      // =========================================
      // COMPLETE DEAL
      // =========================================
      return (tx as any).dealRequest.update({
        where: {
          id: deal.id,
        },
        data: {
          status: 'completed',
          updatedAt: new Date(),
        },
      })
    })

    return NextResponse.json({
      success: true,
      data: completed,
      message: `Deal completed. Khapeetar paid ₹${khapeetarCut.toLocaleString(
        'en-IN'
      )}`,
    })
  } catch (err) {
    console.error(
      '[POST /api/deals/[id]/complete]',
      err
    )

    return NextResponse.json(
      {
        success: false,
        error: 'Completion failed',
      },
      { status: 500 }
    )
  }
}

