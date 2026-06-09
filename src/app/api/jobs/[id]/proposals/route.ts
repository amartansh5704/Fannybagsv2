import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'khapeetar') {
      return NextResponse.json({ success: false, error: 'Only khapeetars can submit proposals' }, { status: 403 })
    }

    const { id: jobId } = await params
    const body = await req.json()
    const { message, bidAmount, deliveryDays } = body

    if (!message?.trim())           return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 })
    if (!bidAmount || Number(bidAmount) <= 0) return NextResponse.json({ success: false, error: 'Valid bid amount required' }, { status: 400 })
    if (!deliveryDays || Number(deliveryDays) <= 0) return NextResponse.json({ success: false, error: 'Valid delivery days required' }, { status: 400 })

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    if (job.status !== 'open') return NextResponse.json({ success: false, error: 'This job is no longer accepting proposals' }, { status: 400 })

    // Check duplicate proposal
    const existing = await prisma.jobProposal.findFirst({
      where: { jobId, khapeetarId: user.id },
    })
    if (existing) return NextResponse.json({ success: false, error: 'You already submitted a proposal for this job' }, { status: 400 })

    const proposal = await prisma.jobProposal.create({
      data: {
        jobId,
        khapeetarId:  user.id,
        message:      message.trim(),
        bidAmount:    Number(bidAmount),
        deliveryDays: Number(deliveryDays),
        status:       'pending',
      },
    })

    return NextResponse.json({ success: true, data: proposal }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/jobs/[id]/proposals]', err)
    return NextResponse.json({ success: false, error: 'Failed to submit proposal' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'artist') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id: jobId } = await params
    const { proposalId, status } = await req.json()

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job || job.artistId !== user.id) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

    const updated = await prisma.jobProposal.update({
      where: { id: proposalId },
      data:  { status },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('[PATCH /api/jobs/[id]/proposals]', err)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}