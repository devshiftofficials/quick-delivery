import { NextResponse } from 'next/server';
 
export function middleware(request) {
  // Check if the request is for /login
  if (request.nextUrl.pathname === '/login') {
    // Redirect to the unified login page
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/login'],
};