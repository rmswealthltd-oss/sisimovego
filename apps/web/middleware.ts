// apps/web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/_next",
  "/static",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/sw.js",
  "/offline.html",
  "/public",
  "/api"
];

/** Helper to check if request path is public */
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public assets and API endpoints
  if (isPublicPath(pathname)) return NextResponse.next();

  // allow next internal routes (/_next, etc)
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for auth cookie (server-side)
  const token = req.cookies.get("sisimove_token") ?? req.cookies.get("sisimove_token_v2");

  if (!token) {
    // Not authenticated -> redirect to login with original path preserved
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname + (req.nextUrl.search ?? ""));
    return NextResponse.redirect(loginUrl);
  }

  // Token exists -> allow through (server will still validate on API calls)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Protect all routes except:
      - root (/) and /auth/*
      - static files and next internals
    */
    "/((?!auth|_next|api|static|favicon.ico|manifest.webmanifest|sw.js|offline.html).*)"
  ]
};
