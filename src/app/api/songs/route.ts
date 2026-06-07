import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'artist') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const songs = await prisma.song.findMany({
      where: { artistId: user.id },
      include: { campaign: true, distribution: true, metrics: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: songs })
  } catch (err) {
    console.error('[GET /api/songs]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'artist') return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { songDetail, distribution, funding } = body

    if (!songDetail?.title?.trim()) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Song title is required' } },
        { status: 400 }
      )
    }
    if (!funding?.totalFundingAsk || funding.totalFundingAsk < 10000) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Minimum funding ask is ₹10,000' } },
        { status: 400 }
      )
    }
    const fanShare = Number(funding.fanRevenueShare)
    if (isNaN(fanShare) || fanShare < 1 || fanShare > 100) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Fan revenue share must be 1–100%' } },
        { status: 400 }
      )
    }
    const endDate = new Date(songDetail.campaignEndDate)
    const diffDays = Math.ceil((endDate.getTime() - Date.now()) / 86_400_000)
    if (diffDays < 1 || diffDays > 90) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Campaign end date must be 1–90 days from today' } },
        { status: 400 }
      )
    }

    // Use distribution cover art as fallback if song cover art is empty
    const coverArtUrl = songDetail.coverArtUrl || distribution.coverArtDist || null

    const song = await prisma.song.create({
      data: {
        artistId:    user.id,
        title:       songDetail.title.trim(),
        language:    songDetail.language ?? '',
        genre:       distribution.primaryGenre ?? null,
        description: funding.campaignStory ?? null,
        demoUrl:     songDetail.demoUrl ?? null,
        coverArtUrl: coverArtUrl,
        status:      'pending_approval',
      },
    })

    await prisma.distribution.create({
      data: {
        songId:            song.id,
        releaseStatus:     distribution.releaseStatus ?? 'unreleased',
        releaseName:       distribution.releaseName ?? null,
        primaryGenre:      distribution.primaryGenre ?? null,
        releaseDate:       distribution.releaseDate ? new Date(distribution.releaseDate) : null,
        explicitLyrics:    distribution.explicitLyrics ?? false,
        primaryArtist:     distribution.primaryArtist ?? null,
        additionalArtists: distribution.additionalArtists ?? [],
        songFileUrl:       distribution.songFileUrl ?? null,
        hasFreeBeat:       distribution.hasFreeBeat ?? false,
        migrationApproved: distribution.migrationApproved ?? false,
        spotifyLink:       distribution.spotifyLink ?? null,
        appleMusicLink:    distribution.appleMusicLink ?? null,
        releaseType:       distribution.releaseType ?? 'single',
        contributors:      (distribution.contributors ?? [])
          .filter((c: any) => typeof c?.name === 'string' && typeof c?.role === 'string')
          .map((c: any) => ({ name: c.name.trim(), role: c.role.trim() })),
      },
    })

    await prisma.campaign.create({
      data: {
        songId:           song.id,
        artistId:         user.id,
        totalFundingAsk:  funding.totalFundingAsk,
        fanRevenueShare:  fanShare,
        campaignEndDate:  endDate,
        royaltySharingOn: funding.royaltySharingOn ?? true,
        campaignStory:    funding.campaignStory ?? null,
        minInvestment:    100,
        budgetProduction: funding.budget?.production ?? 0,
        budgetMixMaster:  funding.budget?.mixMaster ?? 0,
        budgetVideoPromo: funding.budget?.videoPromo ?? 0,
        budgetMarketing:  funding.budget?.marketing ?? 0,
        budgetOther:      funding.budget?.other ?? 0,
        status:           'pending_approval',
      },
    })

    await prisma.songMetrics.create({ data: { songId: song.id } })

    return NextResponse.json(
      { success: true, data: { songId: song.id }, message: 'Song published successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/songs]', err)
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to publish song' } },
      { status: 500 }
    )
  }
}