import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateNonce } from "@/lib/security/nonce";

const intlMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const response = intlMiddleware(request);

  // Security headers
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("Permissions-Policy", "camera=(), geolocation=(), payment=(), usb=()");
  response.headers.set("X-Powered-By", "false");

  // CSP with nonce (report-only mode for now)
  const supabaseDomain = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : "*.supabase.co';

  const csp = [
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: blob: https://${supabaseDomain}`,
    `media-src 'self' blob: https://${supabaseDomain}`,
    "font-src 'self'",
    `connect-src 'self' https://${supabaseDomain} wss://${supabaseDomain}`,
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "require-trusted-types-for 'script'",
  ].join("; ");

  response.headers.set("Content-Security-Policy-Report-Only", csp);
  response.headers.set("x-nonce", nonce);

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
