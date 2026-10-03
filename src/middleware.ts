import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Security headers
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), payment=(), usb=()");
  response.headers.set("X-Powered-By", "false");

  // Cache-Control and noindex for private routes
  const path = request.nextUrl.pathname;
  if (path.startsWith("/g/") || path.startsWith("/manage/") || path.startsWith("/c/") || path.startsWith("/checkout/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
