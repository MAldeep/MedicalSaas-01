import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Check if the route should be protected
  const isProtectedRoute = pathname.startsWith("/patients");

  // If it's a protected route, check for session token
  if (isProtectedRoute) {
    // Check for NextAuth session token in cookies
    const token =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token");

    if (!token) {
      // Redirect to login if no token found
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (auth pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
