import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const profile = await prisma.khapeetarProfile.findUnique({
      where: {
        id,
      },
    })

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Khapeetar not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('[GET KHAPEETAR]', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Fetch failed',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const safeData = {
      name: body.name || '',
      phone: body.phone || null,
      skills: Array.isArray(body.skills) ? body.skills : [],
      primaryRole: body.primaryRole || '',
      city: body.city || null,
      state: body.state || null,
      country: body.country || 'India',
      workMode: body.workMode || 'Remote',
      availability: body.availability || 'Available Now',
      startingBudget: Number(body.startingBudget || 0),
      experienceYears: Number(body.experienceYears || 0),
      projectsCompleted: Number(body.projectsCompleted || 0),
      bio: body.bio || null,
      profileImage: body.profileImage || null,
      instagram: body.instagram || null,
      youtube: body.youtube || null,
      spotifyCredits: body.spotifyCredits || null,
      portfolioLinks: Array.isArray(body.portfolioLinks)
        ? body.portfolioLinks
        : [],
    }

    const profile = await prisma.khapeetarProfile.update({
      where: {
        id,
      },
      data: safeData,
    })

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error('[UPDATE KHAPEETAR]', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Update failed',
      },
      { status: 500 }
    )
  }
}