import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/ba-management", request.url));
  }

  if (!accessToken && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/" && accessToken) {
    return NextResponse.redirect(new URL("/ba-management", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
