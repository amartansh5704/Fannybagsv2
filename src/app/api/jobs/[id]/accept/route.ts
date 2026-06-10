import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { debitWallet, getOrCreateWallet } from '@/lib/wallet'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'artist') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id: jobId } = await params
    const { proposalId } = await req.json()

    // ── Fetch job + proposal ──────────────────────────────────────────────────
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { proposals: true },
    })
    if (!job)                     return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 })
    if (job.artistId !== user.id) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    if (job.status !== 'open')    return NextResponse.json({ success: false, error: 'Job is no longer open' }, { status: 400 })

    const proposal = job.proposals.find(p => p.id === proposalId)
    if (!proposal)                     return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 })
    if (proposal.status !== 'pending') return NextResponse.json({ success: false, error: 'Proposal already processed' }, { status: 400 })

    const escrowAmount = proposal.bidAmount

    // ── Check artist wallet balance ───────────────────────────────────────────
    const artistWallet = await getOrCreateWallet(user.id)
    if (artistWallet.balance < escrowAmount) {
      return NextResponse.json({
        success: false,
        error: `Insufficient wallet balance. You need ₹${escrowAmount.toLocaleString('en-IN')} but have ₹${artistWallet.balance.toLocaleString('en-IN')}`,
      }, { status: 400 })
    }

    // ── Wallet operations OUTSIDE transaction to avoid P2028 timeout ──────────
    // Only debit artist — admin wallet is credited only on release, not on escrow lock
    await debitWallet(
      user.id,
      escrowAmount,
      'job_escrow_hold',
      `Escrow held for job: ${job.title}`,
      jobId,
      'job',
    )

    // ── Run DB operations in transaction (fast — no external calls) ───────────
    const result = await prisma.$transaction(async (tx) => {

      // 1. Accept the proposal
      await (tx as any).jobProposal.update({
        where: { id: proposalId },
        data:  { status: 'accepted' },
      })

      // 2. Reject all other proposals
      await (tx as any).jobProposal.updateMany({
        where: { jobId, id: { not: proposalId }, status: 'pending' },
        data:  { status: 'rejected' },
      })

      // 3. Update job status to assigned
      const updatedJob = await (tx as any).job.update({
        where: { id: jobId },
        data: {
          status:             'assigned',
          acceptedProposalId: proposalId,
          escrowAmount,
          khapeetarId:        proposal.khapeetarId,
        },
      })

      // 4. Create a chat room for this job
      const chatRoom = await (tx as any).jobChatRoom.create({
        data: { jobId },
      })

      // 5. Notify khapeetar
      await (tx as any).notification.create({
        data: {
          userId: proposal.khapeetarId,
          type:   'job_accepted',
          title:  'Your proposal was accepted!',
          body:   `"${job.title}" — the artist accepted your proposal. Chat is now open.`,
        },
      })

      return { updatedJob, chatRoom }

    }, {
      timeout: 15000,
      maxWait:  5000,
    })

    return NextResponse.json({
      success: true,
      data:    result,
      message: `Proposal accepted. ₹${escrowAmount.toLocaleString('en-IN')} held in escrow.`,
    })

  } catch (err: any) {
    console.error('[POST /api/jobs/[id]/accept]', err)
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Accept failed' }, { status: 500 })
  }
}