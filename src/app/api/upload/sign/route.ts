import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

console.log('[SIGN] cloudName:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
console.log('[SIGN] apiKey:', process.env.CLOUDINARY_API_KEY)
console.log('[SIGN] apiSecret:', process.env.CLOUDINARY_API_SECRET)


export async function POST(req: NextRequest) {
  try {
    const body      = await req.json()
    const { mime, filename } = body as { mime: string; filename: string }

    const isVideo = mime.startsWith('video/')
    const isImage = mime.startsWith('image/')
    const isAudio = mime.startsWith('audio/')
      || filename.endsWith('.wav')
      || filename.endsWith('.flac')
      || filename.endsWith('.mp3')
      || filename.endsWith('.aac')
      || filename.endsWith('.ogg')

    let resourceType: 'image' | 'video' | 'raw' = 'raw'
    if (isImage) resourceType = 'image'
    if (isVideo || isAudio) resourceType = 'video'

    const folder = isImage
      ? 'fannybags/covers'
      : isAudio
        ? 'fannybags/demos'
        : isVideo
          ? 'fannybags/khapeetar-portfolio'
          : 'fannybags/misc'

    const timestamp = Math.round(Date.now() / 1000)

    // Sign the upload params
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!,
    )

    return NextResponse.json({
      success:      true,
      timestamp,
      signature,
      folder,
      resourceType,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey:       process.env.CLOUDINARY_API_KEY,
    })

  } catch (err) {
    console.error('[UPLOAD SIGN]', err)
    return NextResponse.json(
      { success: false, error: 'Sign failed' },
      { status: 500 }
    )
  }
}