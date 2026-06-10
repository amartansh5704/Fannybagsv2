import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { creditWallet } from '@/lib/wallet'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const song = await prisma.song.findUnique({
      where: { id },
      include: { campaign: true },
    })

    if (!song || !song.campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      )
    }

    const campaign = song.campaign

    if (campaign.fundsReleased) {
      return NextResponse.json(
        { success: false, error: 'Funds already released' },
        { status: 400 }
      )
    }

    const totalRaised = campaign.amountRaised

    if (totalRaised <= 0) {
      return NextResponse.json(
        { success: false, error: 'No funds raised' },
        { status: 400 }
      )
    }

    const adminFee     = totalRaised * 0.05
    const artistPayout = totalRaised * 0.95

    // Credit artist directly — admin wallet not touched
    await creditWallet(
      song.artistId,
      artistPayout,
      'campaign_artist_credit',
      `Campaign payout (95%) for "${song.title}"`,
      campaign.id,
      'campaign',
    )

    // Record platform fee and release as info-only on admin wallet
    const adminWallet = await prisma.wallet.findUnique({ where: { userId: user.id } })

    await prisma.$transaction(async (tx) => {
      if (adminWallet) {
        await tx.walletTransaction.createMany({
          data: [
            {
              walletId:      adminWallet.id,
              type:          'campaign_platform_fee',
              amount:        adminFee,
              referenceId:   campaign.id,
              referenceType: 'campaign',
            },
            {
              walletId:      adminWallet.id,
              type:          'campaign_funds_release',
              amount:        artistPayout,
              referenceId:   campaign.id,
              referenceType: 'campaign',
            },
          ],
        })
      }

      await tx.campaign.update({
        where: { id: campaign.id },
        data: {
          fundsReleased:    true,
          releasedAt:       new Date(),
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
      { success: false, error: 'Release failed' },
      { status: 500 }
    )
  }
}