import { NextRequest, NextResponse } from "next/server";

const LEGACY_HOST = "shankhya.vercel.app";
const CANONICAL_HOST = "shankhya.com";

/**
 * Canonical-host enforcement.
 *
 * The official production domain is https://shankhya.com. Any request that
 * arrives on the old Vercel deployment hostname (shankhya.vercel.app) is
 * permanently redirected (308) to the equivalent https://shankhya.com URL,
 * preserving the exact path and query string.
 *
 * This prevents old/legacy links, shares and bookmarks from landing on a
 * non-canonical host, and avoids splitting ranking signals across two
 * hostnames.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  const isLegacy =
    host === LEGACY_HOST ||
    host.toLowerCase() === LEGACY_HOST ||
    host === `www.${LEGACY_HOST}`;

  if (isLegacy) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|twitter-image|robots.txt|sitemap.xml).*)"],
};