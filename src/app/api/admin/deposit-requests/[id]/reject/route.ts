import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id }  = await params
    const body    = await req.json()
    const note    = body.note?.trim() || 'Rejected by admin'

    const request = await prisma.depositRequest.findUnique({ where: { id } })
    if (!request) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 })
    }
    if (request.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Already processed' }, { status: 400 })
    }

    await prisma.depositRequest.update({
      where: { id },
      data:  { status: 'rejected', note, updatedAt: new Date() },
    })

    return NextResponse.json({ success: true, message: 'Deposit rejected' })
  } catch (err) {
    console.error('[REJECT DEPOSIT]', err)
    return NextResponse.json({ success: false, error: 'Rejection failed' }, { status: 500 })
  }
}