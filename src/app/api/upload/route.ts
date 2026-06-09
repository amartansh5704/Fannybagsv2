import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

// ── Increase body size limit for large audio files ────────────────────────────
export const dynamic  = 'force-dynamic'
export const maxDuration = 60  // seconds

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

    // ── Check file size — reject if over 100MB ────────────────────────────────
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    const bytes  = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const mime   = file.type

    const isVideo = mime.startsWith('video/')
    const isImage = mime.startsWith('image/')
    const isAudio = mime.startsWith('audio/') ||
                    file.name.endsWith('.wav') ||
                    file.name.endsWith('.flac') ||
                    file.name.endsWith('.mp3') ||
                    file.name.endsWith('.aac') ||
                    file.name.endsWith('.ogg')

    // Cloudinary uses 'video' resource type for ALL audio formats including WAV
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

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder,
            // Allow large audio files
            chunk_size: 6000000,
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