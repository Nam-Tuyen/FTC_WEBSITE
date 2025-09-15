import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add new request headers
  requestHeaders.set('x-url', request.url)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // You can also check for specific conditions
  const isApiRequest = request.nextUrl.pathname.startsWith('/api')
  if (isApiRequest) {
    // Handle API requests
    requestHeaders.set('x-is-api', '1')
  }

  // Return response with new headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which paths should be handled by middleware
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all pages except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
