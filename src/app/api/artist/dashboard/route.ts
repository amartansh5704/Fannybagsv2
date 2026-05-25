/**
 * src/app/api/artist/dashboard/route.ts
 *
 * GET /api/artist/dashboard
 * Returns all dashboard metrics for the logged-in artist in one round-trip.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'artist') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Run all queries in parallel — no reason to waterfall these
    const [
      totalSongs,
      activeDealsCount,
      khapeetarDeals,
      artistCampaigns,
    ] = await Promise.all([

      // 1. Total songs uploaded by this artist
      prisma.song.count({
        where: { artistId: user.id },
      }),

      // 4. Active deals (pending + countered + active)
      prisma.dealRequest.count({
        where: {
          artistId: user.id,
          status:   { in: ['pending', 'countered', 'active'] },
        },
      }),

      // 2. Distinct khapeetars worked with (active or completed deals)
      prisma.dealRequest.findMany({
        where: {
          artistId: user.id,
          status:   { in: ['active', 'completed'] },
        },
        select: { khapeetarId: true },
      }),

      // 3 + 5. Campaigns for artist's songs (to derive funds raised + fans)
      prisma.campaign.findMany({
        where: { artistId: user.id },
        select: {
          investments: {
            select: {
              amount: true,
              fanId:  true,
            },
          },
        },
      }),
    ])

    // Derive: distinct khapeetar count
    const totalKhapeetars = new Set(khapeetarDeals.map(d => d.khapeetarId)).size

    // Derive: total funds raised + distinct fan count
    let totalFundsRaised = 0
    const fanIds = new Set<string>()

    for (const campaign of artistCampaigns) {
      for (const inv of campaign.investments) {
        totalFundsRaised += inv.amount
        fanIds.add(inv.fanId)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSongs,
        totalKhapeetars,
        totalFundsRaised,
        activeDeals:  activeDealsCount,
        totalFans:    fanIds.size,
      },
    })
  } catch (err) {
    console.error('[GET /api/artist/dashboard]', err)
    return NextResponse.json(
      { success: false, error: 'Failed to load dashboard' },
      { status: 500 }
    )
  }
}