import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes, menu item detail routes, and payment routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/menu/") ||
    pathname.startsWith("/payment");

  if (isProtectedRoute) {
    // Check for Better Auth session cookie
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    // If completely unauthenticated, redirect to signin with callback URL
    if (!sessionCookie || !sessionCookie.value) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackURL", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/menu/:path*", "/payment/:path*"],
};
