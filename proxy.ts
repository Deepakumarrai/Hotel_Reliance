import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login and error pages
  if (pathname.startsWith("/admin")) {
    // Allow login page, 403, 404, error
    if (
      pathname === "/admin/login" ||
      pathname === "/admin/403" ||
      pathname === "/admin/404" ||
      pathname === "/admin/error"
    ) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get("hr_admin_session");

    // If no session cookie exists, redirect immediately to login
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
