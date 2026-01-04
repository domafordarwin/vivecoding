import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip static assets and API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Get JWT token to check session info
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/welcome"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Auth routes (login, register) - logged in users should be redirected
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(pathname);

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Password change route
  const isPasswordChangeRoute = pathname === "/change-password";

  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // If logged in
  if (isLoggedIn && token) {
    // Redirect from auth routes to appropriate page
    if (isAuthRoute) {
      const redirectUrl = token.role === "admin" ? "/admin" : "/projects";
      return NextResponse.redirect(new URL(redirectUrl, nextUrl));
    }

    // Force password change if required (except on password change page and API)
    if (
      token.mustChangePassword &&
      !isPasswordChangeRoute &&
      !pathname.startsWith("/api")
    ) {
      return NextResponse.redirect(new URL("/change-password", nextUrl));
    }

    // Admin route protection
    if (isAdminRoute && token.role !== "admin") {
      return NextResponse.redirect(new URL("/projects", nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
