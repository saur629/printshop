import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Admin routes require authentication
        if (path.startsWith('/admin')) return !!token
        // Protect order routes
        if (path.startsWith('/orders')) return !!token
        // Allow everything else
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout'],
}
