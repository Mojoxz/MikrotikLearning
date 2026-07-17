import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Redirect logged in users away from login page
  if (pathname === '/login' && token) {
    const role = token.role as string
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'guru') return NextResponse.redirect(new URL('/guru/dashboard', request.url))
    if (role === 'murid') return NextResponse.redirect(new URL('/murid/dashboard', request.url))
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  // Protect guru routes
  if (pathname.startsWith('/guru')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token.role !== 'guru') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  // Protect murid routes
  if (pathname.startsWith('/murid')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (token.role !== 'murid') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/guru/:path*', '/murid/:path*', '/login'],
}
