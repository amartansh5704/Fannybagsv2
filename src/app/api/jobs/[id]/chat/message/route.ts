import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id: jobId } = await params
    const { content, fileUrl, fileType, fileName } = await req.json()

    if (!content?.trim() && !fileUrl) {
      return NextResponse.json({ success: false, error: 'Message or file required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { jobChatRoom: true },
    })

    if (!job || !job.jobChatRoom) {
      return NextResponse.json({ success: false, error: 'Chat not found' }, { status: 404 })
    }

    const isArtist    = user.id === job.artistId
    const isKhapeetar = user.id === job.khapeetarId

    if (!isArtist && !isKhapeetar) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    let finalContent = content?.trim() || ''
    if (fileUrl) {
      const fileMeta = JSON.stringify({ fileUrl, fileType: fileType || 'file', fileName: fileName || 'Attachment' })
      finalContent = finalContent ? `${finalContent}\n__FILE__${fileMeta}` : `__FILE__${fileMeta}`
    }

    const message = await prisma.jobChatMessage.create({
      data: {
        roomId:   job.jobChatRoom.id,
        senderId: user.id,
        content:  finalContent,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    })

    return NextResponse.json({ success: true, data: message })
  } catch (err) {
    console.error('[POST /api/jobs/[id]/chat/message]', err)
    return NextResponse.json({ success: false, error: 'Send failed' }, { status: 500 })
  }
}