import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js 16: renamed from `middleware` to `proxy`
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // ─── Protect /dashboard/* — Must be logged in ─────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/dashboard/bookings", request.url)
      );
    }
  }

  // ─── Protect /booking/* and /payment/* — Must be logged in ────
  if (pathname.startsWith("/booking") || pathname.startsWith("/payment")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ─── Protect /admin/* — Admin only ───────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ─── Redirect already-logged-in users away from login/register ─
  if ((pathname === "/login" || pathname === "/register") && token) {
    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/booking/:path*",
    "/payment/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
