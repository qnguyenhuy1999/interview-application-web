import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/notes', '/quiz', '/review'];
const authPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || request.cookies.get('accessToken')?.value;
  const isLoggedIn = !!token;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/notes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/notes/:path*', '/quiz/:path*', '/review/:path*', '/login', '/register'],
};