import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const mime = file.type
    const isVideo = mime.startsWith('video/')

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: isVideo ? 'video' : 'image',
            folder: 'fannybags/khapeetar-portfolio',
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
      url: uploadResult.secure_url,
      type: isVideo ? 'video' : 'image',
    })
  } catch (err) {
    console.error('[UPLOAD]', err)

    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
      },
      { status: 500 }
    )
  }
}