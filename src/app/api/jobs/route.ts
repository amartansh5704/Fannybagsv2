import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'artist') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const jobs = await prisma.job.findMany({
      where: { artistId: user.id },
      include: { proposals: true },
      orderBy: { createdAt: 'desc' },
    })

    // ── Fetch khapeetar profiles for assigned jobs ────────────────────────────
    // khapeetarId on Job is a userId — we look up KhapeetarProfile by userId
    const khapeetarUserIds = jobs
      .filter(j => j.khapeetarId)
      .map(j => j.khapeetarId as string)

    const khapeetarProfiles = khapeetarUserIds.length > 0
      ? await prisma.khapeetarProfile.findMany({
          where: { userId: { in: khapeetarUserIds } },
          select: { id: true, name: true, userId: true },
        })
      : []

    // Build a map of userId → profile for O(1) lookup
    const profileByUserId = Object.fromEntries(
      khapeetarProfiles.map(p => [p.userId, p])
    )

    // Attach khapeetarProfile to each job
    const jobsWithProfile = jobs.map(job => ({
      ...job,
      khapeetarProfile: job.khapeetarId
        ? (profileByUserId[job.khapeetarId] ?? null)
        : null,
    }))

    return NextResponse.json({ success: true, data: jobsWithProfile })

  } catch (err) {
    console.error('[GET /api/jobs]', err)
    return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'artist') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, category, description, budget, budgetMax, deadline, requirements } = body

    if (!title?.trim())       return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 })
    if (!category?.trim())    return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 })
    if (!description?.trim()) return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 })
    if (!budget || Number(budget) <= 0) return NextResponse.json({ success: false, error: 'Valid budget is required' }, { status: 400 })

    const job = await prisma.job.create({
      data: {
        artistId:     user.id,
        title:        title.trim(),
        category:     category.trim(),
        description:  description.trim(),
        budget:       Number(budget),
        budgetMax:    budgetMax ? Number(budgetMax) : null,
        deadline:     deadline ? new Date(deadline) : null,
        requirements: requirements?.trim() || null,
        status:       'open',
      },
    })

    return NextResponse.json({ success: true, data: job }, { status: 201 })

  } catch (err) {
    console.error('[POST /api/jobs]', err)
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 })
  }
}