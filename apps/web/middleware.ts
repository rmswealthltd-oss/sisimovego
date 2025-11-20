// apps/web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",                // homepage
  "/auth/login",
  "/auth/register",
  "/favicon.ico",
  "/manifest.webmanifest",
  "/sw.js",
  "/offline.html",
];

/** Helper: true → path is public */
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internals and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Public routes
  if (isPublicPath(pathname)) return NextResponse.next();

  // Read authentication token
  const token =
    req.cookies.get("sisimove_token")?.value ||
    req.cookies.get("sisimove_token_v2")?.value;

  // No token → redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    loginUrl.searchParams.set(
      "redirectTo",
      pathname + (req.nextUrl.search ?? "")
    );
    return NextResponse.redirect(loginUrl);
  }

  // User authenticated → allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Protect everything except:
     * - /auth/*
     * - /api/*
     * - /_next/*
     * - /favicon.ico, service worker, manifest, images, icons
     */
    "/((?!auth|api|_next|favicon.ico|manifest.webmanifest|sw.js|offline.html|icons|images).*)",
  ],
};
