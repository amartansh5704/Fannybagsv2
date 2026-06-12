import { NextRequest, NextResponse } from 'next/server'

export const dynamic     = 'force-dynamic'
export const maxDuration = 60

// ── This route is now only a fallback — all uploads go direct to Cloudinary
// ── via /api/upload/sign. This route is kept for compatibility only.
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Use /api/upload/sign for direct Cloudinary upload' },
    { status: 400 }
  )
}