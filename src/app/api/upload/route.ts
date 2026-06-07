import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mime   = file.type

    const isVideo = mime.startsWith('video/')
    const isImage = mime.startsWith('image/')
    const isAudio = mime.startsWith('audio/')

    // Cloudinary resource_type:
    // 'image' → images
    // 'video' → video AND audio files
    // 'raw'   → everything else
    let resourceType: 'image' | 'video' | 'raw' = 'raw'
    if (isImage) resourceType = 'image'
    if (isVideo || isAudio) resourceType = 'video'  // ← Cloudinary uses 'video' for audio too

    const folder = isImage
      ? 'fannybags/covers'
      : isAudio
        ? 'fannybags/demos'
        : isVideo
          ? 'fannybags/khapeetar-portfolio'
          : 'fannybags/misc'

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder,
          },
          (err, result) => {
            if (err) reject(err)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    return NextResponse.json({
      success: true,
      url:  uploadResult.secure_url,
      type: isImage ? 'image' : isAudio ? 'audio' : 'video',
    })
  } catch (err) {
    console.error('[UPLOAD]', err)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}