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

    const request = await prisma.depositRequest.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }
    if (request.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Already processed' }, { status: 400 })
    }

    // ── Find admin user ───────────────────────────────────────────────────────
    const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } })
    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Admin user not found' }, { status: 500 })
    }

    await prisma.$transaction(async (tx) => {

      // 1. Credit the USER's wallet (their balance goes up)
      await creditWallet(
        request.userId,
        request.amount,
        'deposit',
        `Deposit approved — UTR: ${request.utrNumber || 'N/A'}`,
        request.id,
        'deposit_request',
        tx as any,
      )

      // 2. Credit the ADMIN's wallet (platform records incoming payment)
      await creditWallet(
        adminUser.id,
        request.amount,
        'deposit_received',
        `User deposit received — UTR: ${request.utrNumber || 'N/A'} from ${request.user?.name || request.userId}`,
        request.id,
        'deposit_request',
        tx as any,
      )

      // 3. Mark request as approved
      await (tx as any).depositRequest.update({
        where: { id },
        data:  { status: 'approved', updatedAt: new Date() },
      })

      // 4. Notify the user
      await (tx as any).notification.create({
        data: {
          userId: request.userId,
          type:   'deposit_approved',
          title:  'Deposit Approved ✅',
          body:   `Your deposit of ₹${request.amount.toLocaleString('en-IN')} has been approved and added to your wallet.`,
        },
      }).catch(() => {}) // non-critical
    })

    return NextResponse.json({
      success: true,
      message: `✅ ₹${request.amount.toLocaleString('en-IN')} credited to user and recorded in admin wallet`,
    })

  } catch (err) {
    console.error('[APPROVE DEPOSIT]', err)
    return NextResponse.json({ success: false, error: 'Approval failed' }, { status: 500 })
  }
}