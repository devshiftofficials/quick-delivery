import { NextResponse } from 'next/server';
 
export function middleware(request) {
  // Redirect /admin to /login for the login page
  if (request.nextUrl.pathname === '/admin' && !request.nextUrl.pathname.startsWith('/admin/pages')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/admin'],
};