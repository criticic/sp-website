import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { linkUserToProfile } from '@/lib/profile-utils';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  
  // Get session using Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // const isStudentPage = nextUrl.pathname.startsWith("/student");
  // const isAdminPage = nextUrl.pathname.startsWith("/admin");
  // const isSecurityPage = nextUrl.pathname.startsWith("/security");
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  // Skip middleware for API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // If user is authenticated, try to link them to existing profile
  if (session?.user?.id && session?.user?.email) {
    await linkUserToProfile(session.user.id, session.user.email);
  }

  // // Redirect to login if not authenticated and trying to access protected routes
  // if (!session && (isStudentPage || isAdminPage || isSecurityPage)) {
  //   return NextResponse.redirect(new URL("/", nextUrl));
  // }

  // // Redirect authenticated users from root to student dashboard
  // if (session && nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/student", nextUrl));
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/", "/student/:path*", "/admin/:path*", "/security/:path*"],
// };