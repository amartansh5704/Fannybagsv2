import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  // PUBLIC ROUTES
  const publicRoutes = [
    '/',
    '/artist/login',
    '/artist/signup',
    '/fan/login',
    '/fan/signup',
    '/khapeetar/login',
    '/khapeetar/signup',
    '/api/auth',
  ]

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // ── FAN DISCOVER — fully public, anyone can view ──────────────────────────
  // Guests, artists, admins, khapeetars can all open shared song links
  if (
    pathname.startsWith('/fan/discover')
  ) {
    return NextResponse.next()
  }

  // ARTIST ROUTES
  if (pathname.startsWith('/artist')) {
    if (!token) {
      return NextResponse.redirect(new URL('/artist/login', req.url))
    }
    if (token.role !== 'artist') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // FAN ROUTES — only non-discover fan pages require fan role
  if (pathname.startsWith('/fan')) {
    if (!token) {
      return NextResponse.redirect(new URL('/fan/login', req.url))
    }
    if (token.role !== 'fan') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // KHAPEETAR ROUTES
  if (pathname.startsWith('/khapeetar')) {
    if (!token) {
      return NextResponse.redirect(new URL('/khapeetar/login', req.url))
    }
    if (token.role !== 'khapeetar') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/artist/:path*', '/fan/:path*', '/khapeetar/:path*'],
}