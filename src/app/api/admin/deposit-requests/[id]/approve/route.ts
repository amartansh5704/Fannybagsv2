import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { creditWallet } from '@/lib/wallet'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const request = await prisma.depositRequest.findUnique({ where: { id } })
    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }
    if (request.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Already processed' }, { status: 400 })
    }

    // Credit the user's wallet
    await creditWallet(
      request.userId,
      request.amount,
      'deposit',
      `Deposit approved — UTR: ${request.utrNumber || 'N/A'}`,
      request.id,
      'deposit_request',
    )

    // Mark as approved
    await prisma.depositRequest.update({
      where: { id },
      data:  { status: 'approved', updatedAt: new Date() },
    })

    return NextResponse.json({ success: true, message: 'Deposit approved and wallet credited' })
  } catch (err) {
    console.error('[APPROVE DEPOSIT]', err)
    return NextResponse.json({ success: false, error: 'Approval failed' }, { status: 500 })
  }
}