import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { songDetail, distribution, funding } = body

    // ── Input validation ─────────────────────────────────────────────
    if (!songDetail?.title || !songDetail?.language || !songDetail?.campaignEndDate) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing required song details' }
      }, { status: 400 })
    }

    if (!funding?.totalFundingAsk || funding.totalFundingAsk < 10000) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Minimum funding ask is ₹10,000' }
      }, { status: 400 })
    }

    const fanShare = Number(funding.fanRevenueShare)
    if (isNaN(fanShare) || fanShare < 1 || fanShare > 100) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Fan revenue share must be between 1% and 100%' }
      }, { status: 400 })
    }

    // ── Campaign end date: max 90 days ───────────────────────────────
    const endDate   = new Date(songDetail.campaignEndDate)
    const today     = new Date()
    const diffDays  = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 1 || diffDays > 90) {
      return NextResponse.json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Campaign end date must be within 90 days' }
      }, { status: 400 })
    }

    // ── Create or reuse demo artist user ────────────────────────────
    let artist = await prisma.user.findFirst({ where: { role: 'artist' } })
    if (!artist) {
      artist = await prisma.user.create({
        data: { email: 'artist@demo.com', name: 'Demo Artist', role: 'artist' }
      })
    }

    // ── Song ─────────────────────────────────────────────────────────
    const song = await prisma.song.create({
      data: {
        artistId:    artist.id,
        title:       songDetail.title,
        language:    songDetail.language,
        demoUrl:     songDetail.demoUrl     || null,
        coverArtUrl: songDetail.coverArtUrl || null,
        status:      'draft',
      }
    })

    // ── Distribution ─────────────────────────────────────────────────
    // Sanitise contributors: must be array of { name: string, role: string }
    const rawContributors = Array.isArray(distribution.contributors)
      ? distribution.contributors
      : []
    const contributors = rawContributors
      .filter((c: any) => typeof c?.name === 'string' && typeof c?.role === 'string')
      .map((c: any) => ({ name: c.name.trim(), role: c.role.trim() }))

    await prisma.distribution.create({
      data: {
        songId:            song.id,
        releaseStatus:     distribution.releaseStatus,
        releaseName:       distribution.releaseName       || null,
        primaryGenre:      distribution.primaryGenre      || null,
        releaseDate:       distribution.releaseDate
                             ? new Date(distribution.releaseDate)
                             : null,
        explicitLyrics:    distribution.explicitLyrics    || false,
        primaryArtist:     distribution.primaryArtist     || null,
        additionalArtists: distribution.additionalArtists || [],
        songFileUrl:       distribution.songFileUrl       || null,
        hasFreeBeat:       distribution.hasFreeBeat       || false,
        migrationApproved: distribution.migrationApproved || false,
        // ── new fields ──────────────────────────────────────────────
        spotifyLink:       distribution.spotifyLink       || null,
        appleMusicLink:    distribution.appleMusicLink     || null,
        releaseType:       distribution.releaseType       || 'single',
        contributors:      contributors,
      }
    })

    // ── Campaign ─────────────────────────────────────────────────────
    const campaign = await prisma.campaign.create({
      data: {
        songId:           song.id,
        artistId:         artist.id,
        totalFundingAsk:  funding.totalFundingAsk,
        fanRevenueShare:  fanShare,
        campaignEndDate:  endDate,
        royaltySharingOn: funding.royaltySharingOn,
        campaignStory:    funding.campaignStory     || null,
        budgetProduction: funding.budget?.production || 0,
        budgetMixMaster:  funding.budget?.mixMaster  || 0,
        budgetVideoPromo: funding.budget?.videoPromo || 0,
        budgetMarketing:  funding.budget?.marketing  || 0,
        budgetOther:      funding.budget?.other       || 0,
        status:           'pending_approval',
      }
    })

    return NextResponse.json({
      success: true,
      data:    { songId: song.id, campaignId: campaign.id },
      message: 'Campaign submitted for review'
    }, { status: 201 })

  } catch (error) {
    console.error('[POST /api/campaigns]', error)
    return NextResponse.json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create campaign' }
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { song: true, artist: true }
    })
    return NextResponse.json({ success: true, data: campaigns })
  } catch (error) {
    console.error('[GET /api/campaigns]', error)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}