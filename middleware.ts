import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  // Only rate limit auth endpoints
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    const ip = request.ip || 'anonymous'
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 5 // Max 5 login attempts per 15 minutes

    const rateLimitData = rateLimitMap.get(ip)

    if (rateLimitData) {
      if (now < rateLimitData.resetTime) {
        if (rateLimitData.count >= maxRequests) {
          return new NextResponse('Too many requests', { status: 429 })
        }
        rateLimitData.count++
      } else {
        // Reset window
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    }

    // Clean up old entries every 100 requests
    if (rateLimitMap.size > 1000) {
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
          rateLimitMap.delete(key)
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*'],
}
