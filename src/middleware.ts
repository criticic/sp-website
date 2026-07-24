import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const verifiedSession = await verifySession(session).catch(console.error);

  if (request.nextUrl.pathname.startsWith('/login') && verifiedSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/admin') && !verifiedSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};