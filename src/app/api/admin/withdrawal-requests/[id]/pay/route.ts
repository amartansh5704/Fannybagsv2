import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { debitWallet } from '@/lib/wallet'

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

    const request = await prisma.withdrawalRequest.findUnique({ where: { id } })
    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }
    if (request.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Already processed' }, { status: 400 })
    }

    // Debit the user wallet now that admin has paid
    await debitWallet(
      request.userId,
      request.amount,
      'withdrawal',
      `Withdrawal paid via ${request.method} to ${request.detail}`,
      request.id,
      'withdrawal_request',
    )

    // Mark as paid
    await prisma.withdrawalRequest.update({
      where: { id },
      data:  { status: 'paid', updatedAt: new Date() },
    })

    return NextResponse.json({ success: true, message: 'Marked as paid and wallet debited' })
  } catch (err: any) {
    console.error('[MARK PAID]', err)
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return NextResponse.json({ success: false, error: 'User has insufficient balance' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 })
  }
}