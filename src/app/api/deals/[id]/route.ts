import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { debitWallet } from '@/lib/wallet'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id }   = await params
    const body     = await req.json()

    const deal = await prisma.dealRequest.findUnique({
      where: { id },
      include: { khapeetar: true, chatRoom: true },
    })

    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 })
    }

    // ── KHAPEETAR ACTIONS ─────────────────────────────────────────────────────
    if (user.role === 'khapeetar') {
      const profile = await prisma.khapeetarProfile.findUnique({ where: { userId: user.id } })

      if (!profile || profile.id !== deal.khapeetarId) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }

      if (body.action === 'accept') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: { status: 'accepted', acceptedBudget: deal.counterBudget || deal.budget, acceptedAt: new Date() },
        })
        return NextResponse.json({ success: true, data: updated })
      }

      if (body.action === 'reject') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: { status: 'rejected' },
        })
        return NextResponse.json({ success: true, data: updated })
      }

      if (body.action === 'counter') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: {
            counterBudget:    Number(body.counterBudget),
            counterMessage:   body.counterMessage || null,
            status:           'countered',
            negotiationStage: 'khapeetar_counter',
          },
        })
        return NextResponse.json({ success: true, data: updated })
      }
    }

    // ── ARTIST ACTIONS ────────────────────────────────────────────────────────
    if (user.role === 'artist') {
      if (deal.artistId !== user.id) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }

      if (body.action === 'accept' && deal.negotiationStage === 'khapeetar_offer') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: { status: 'accepted', acceptedBudget: deal.counterBudget || deal.budget, acceptedAt: new Date() },
        })
        return NextResponse.json({ success: true, data: updated })
      }

      if (body.action === 'accept_counter') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: { status: 'accepted', acceptedBudget: deal.counterBudget || deal.budget, acceptedAt: new Date() },
        })
        return NextResponse.json({ success: true, data: updated })
      }

      if (body.action === 'select_candidate') {
        if (deal.status !== 'accepted' && deal.status !== 'countered') {
          return NextResponse.json({ success: false, error: 'Deal not eligible for selection' }, { status: 400 })
        }
        const amount = deal.acceptedBudget || deal.counterBudget || deal.budget
        return await executeFinalSelection(deal, amount)
      }

      if (body.action === 'reject' || body.action === 'reject_counter') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: { status: 'cancelled' },
        })
        return NextResponse.json({ success: true, data: updated })
      }

      if (body.action === 'counter') {
        const updated = await prisma.dealRequest.update({
          where: { id },
          data: {
            counterBudget:    Number(body.counterBudget),
            counterMessage:   body.counterMessage || null,
            status:           'countered',
            negotiationStage: 'artist_counter',
          },
        })
        return NextResponse.json({ success: true, data: updated })
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })

  } catch (err) {
    console.error('[PATCH DEAL]', err)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}

// ── Final selection: debit artist only — admin wallet not touched until release ──
async function executeFinalSelection(deal: any, amount: number) {
  try {
    // ── Only debit artist wallet ──────────────────────────────────────────────
    // Admin wallet is credited only on release, not on escrow lock
    await debitWallet(
      deal.artistId,
      amount,
      'deal_escrow_lock',
      `Escrow for "${deal.projectTitle}"`,
      deal.id,
      'deal',
    )

    // ── Fast DB operations in transaction (no wallet calls here) ─────────────
    await prisma.$transaction(async (tx) => {

      await (tx as any).dealRequest.update({
        where: { id: deal.id },
        data: {
          status:           'active',
          negotiationStage: 'finalized',
          acceptedBudget:   amount,
          escrowAmount:     amount,
          selectedForWork:  true,
          selectedAt:       new Date(),
        },
      })

      // Cancel all sibling offers in the same group
      if (deal.offerGroupId) {
        await (tx as any).dealRequest.updateMany({
          where: {
            offerGroupId: deal.offerGroupId,
            id:           { not: deal.id },
          },
          data: { status: 'cancelled' },
        })
      }

      // Create chat room if not exists
      if (!deal.chatRoom) {
        await (tx as any).dealChatRoom.create({
          data: { dealId: deal.id },
        })
      }

    }, {
      timeout: 15000,
      maxWait:  5000,
    })

    const updated = await prisma.dealRequest.findUnique({ where: { id: deal.id } })

    return NextResponse.json({ success: true, data: updated })

  } catch (err: any) {
    console.error('[executeFinalSelection]', err)

    if (err.message === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json(
        { success: false, error: 'Artist wallet has insufficient balance' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to finalise deal' },
      { status: 500 }
    )
  }
}