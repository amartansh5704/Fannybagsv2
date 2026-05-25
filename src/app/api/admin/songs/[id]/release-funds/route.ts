import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(
  _req: Request,
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

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        campaign: true,
      },
    })

    if (!song || !song.campaign) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campaign not found',
        },
        { status: 404 }
      )
    }

    if (song.campaign.fundsReleased) {
      return NextResponse.json(
        {
          success: false,
          error: 'Funds already released',
        },
        { status: 400 }
      )
    }

    const adminWallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    })

    if (!adminWallet) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin wallet missing',
        },
        { status: 400 }
      )
    }

    const totalRaised = song.campaign.amountRaised

    if (totalRaised <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No funds raised',
        },
        { status: 400 }
      )
    }

    if (adminWallet.balance < totalRaised) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin wallet insufficient',
        },
        { status: 400 }
      )
    }

    const adminFee = totalRaised * 0.05
    const artistPayout = totalRaised * 0.95

    const artistWallet = await prisma.wallet.upsert({
      where: {
        userId: song.artistId,
      },
      update: {},
      create: {
        userId: song.artistId,
      },
    })

    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: {
          id: adminWallet.id,
        },
        data: {
          balance: {
            decrement: artistPayout,
          },
        },
      })

      await tx.wallet.update({
        where: {
          id: artistWallet.id,
        },
        data: {
          balance: {
            increment: artistPayout,
          },
          totalReceived: {
            increment: artistPayout,
          },
        },
      })

      await tx.walletTransaction.createMany({
        data: [
          {
            walletId: adminWallet.id,
            type: 'campaign_platform_fee',
            amount: adminFee,
            referenceId: song.campaign.id,
            referenceType: 'campaign',
          },
          {
            walletId: adminWallet.id,
            type: 'campaign_funds_release',
            amount: artistPayout,
            referenceId: song.campaign.id,
            referenceType: 'campaign',
          },
          {
            walletId: artistWallet.id,
            type: 'campaign_artist_credit',
            amount: artistPayout,
            referenceId: song.campaign.id,
            referenceType: 'campaign',
          },
        ],
      })

      await tx.campaign.update({
        where: {
          id: song.campaign.id,
        },
        data: {
          fundsReleased: true,
          releasedAt: new Date(),
          escrowHeldAmount: 0,
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Funds released successfully',
    })
  } catch (err) {
    console.error('[RELEASE FUNDS]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Release failed',
      },
      { status: 500 }
    )
  }
}