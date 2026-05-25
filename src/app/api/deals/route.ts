import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import crypto from 'crypto'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let deals = []

    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({
        where: {
          userId: user.id,
        },
      })

      if (!profile) {
        return NextResponse.json({
          success: true,
          data: [],
        })
      }

      deals = await prisma.dealRequest.findMany({
        where: {
          khapeetarId: profile.id,
        },
        include: {
          artist: true,
          khapeetar: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    else if (user.role === 'artist') {
      deals = await prisma.dealRequest.findMany({
        where: {
          artistId: user.id,
        },
        include: {
          khapeetar: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    else {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: deals,
    })
  }

  catch (err) {
    console.error('[GET DEALS]', err)

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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const budget = Number(body.budget)

    if (
      !body.projectTitle ||
      !body.workType ||
      !body.description ||
      !budget ||
      budget <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    // ====================================================
    // ARTIST → MULTI KHAPEETAR OFFER
    // ====================================================
    if (user.role === 'artist') {
      const khapeetarIds = Array.isArray(body.khapeetarIds)
        ? body.khapeetarIds
        : body.khapeetarId
          ? [body.khapeetarId]
          : []

      if (khapeetarIds.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No khapeetars selected',
          },
          { status: 400 }
        )
      }

      const offerGroupId = crypto.randomUUID()

      const createdDeals = await prisma.$transaction(
        khapeetarIds.map((khapeetarId: string) =>
          prisma.dealRequest.create({
            data: {
              artistId: user.id,
              khapeetarId,
              projectTitle: body.projectTitle,
              workType: body.workType,
              description: body.description,
              budget,
              acceptedBudget: budget,
              deadline: body.deadline
                ? new Date(body.deadline)
                : null,
              message: body.message || null,
              status: 'pending',
              negotiationStage: 'artist_offer',
              offerGroupId,
            },
          })
        )
      )

      return NextResponse.json({
        success: true,
        data: createdDeals,
        message: 'Offers sent successfully',
      })
    }

    // ====================================================
    // KHAPEETAR → ARTIST OFFER
    // ====================================================
    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({
        where: {
          userId: user.id,
        },
      })

      if (!profile) {
        return NextResponse.json(
          {
            success: false,
            error: 'Khapeetar profile missing',
          },
          { status: 400 }
        )
      }

      const deal = await prisma.dealRequest.create({
        data: {
          artistId: body.artistId,
          khapeetarId: profile.id,
          projectTitle: body.projectTitle,
          workType: body.workType,
          description: body.description,
          budget,
          acceptedBudget: budget,
          deadline: body.deadline
            ? new Date(body.deadline)
            : null,
          message: body.message || null,
          status: 'pending',
          negotiationStage: 'khapeetar_offer',
        },
      })

      return NextResponse.json({
        success: true,
        data: deal,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid role',
      },
      { status: 403 }
    )
  }

  catch (err) {
    console.error('[POST DEAL]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Create failed',
      },
      { status: 500 }
    )
  }
}