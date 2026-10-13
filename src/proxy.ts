import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_AUTH_COOKIE, verifyAdminToken } from "./lib/token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
    const isLoginPage = pathname === "/admin/login";

    const validPayload = token ? await verifyAdminToken(token) : null;

    // If accessing /admin/login while already authenticated, redirect to /admin
    if (isLoginPage) {
      if (validPayload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // For any protected admin route, redirect to /admin/login if not authenticated
    if (!validPayload) {
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
