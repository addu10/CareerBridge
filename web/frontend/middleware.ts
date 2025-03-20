import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/about'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the authorization header from the request
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1] || request.cookies.get('accessToken')?.value;

  // Check if token exists in either headers or cookies
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow access to protected routes if token exists
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/company/:path*',
    '/login',
    '/register',
  ],
};