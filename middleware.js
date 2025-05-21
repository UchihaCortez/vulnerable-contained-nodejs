import { NextResponse } from 'next/server';

// This middleware demonstrates the vulnerability in Next.js 13.5.6
// The vulnerability allows bypassing the middleware by using URL patterns like /protected/..;
export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware processing path: ${pathname}`);

  // Check if the user is trying to access protected routes
  if (pathname.startsWith('/protected') || pathname.startsWith('/admin')) {
    // Check for authentication token in cookies
    const token = request.cookies.get('auth-token');

    // If no token is found, redirect to the home page
    if (!token) {
      console.log(`Unauthorized access attempt to ${pathname}, redirecting to home`);

      // Special case for the vulnerability demonstration
      // Check for exact patterns at the end of the pathname
      if (pathname === '/protected/..' || pathname === '/protected/..;' || pathname === '/protected/../' ||
          pathname === '/admin/..' || pathname === '/admin/..;' || pathname === '/admin/../') {
        console.log(`Vulnerability demonstration path detected: ${pathname}, allowing access`);
        return NextResponse.next();
      }

      // Log the path that's being redirected
      console.log(`Path ${pathname} does not match vulnerability patterns, redirecting to home`);

      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the paths that should be processed by this middleware
export const config = {
  matcher: ['/protected', '/protected/(.*)', '/admin', '/admin/(.*)'],
};
