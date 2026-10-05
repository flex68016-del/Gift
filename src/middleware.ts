import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { buildCsp, isPrivatePath } from "@/lib/security/headers";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Copier les en-têtes de requête et ajouter le nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Passer la requête modifiée à next-intl
  const response = intlMiddleware(
    new NextRequest(request.url, {
      headers: requestHeaders,
      method: request.method,
      body: request.body,
    })
  );

  // Headers dynamiques selon la route
  const pathname = request.nextUrl.pathname;
  const isPrivate = isPrivatePath(pathname);

  // CSP Report-Only
  response.headers.set("Content-Security-Policy-Report-Only", buildCsp(nonce));

  // Referrer-Policy
  response.headers.set("Referrer-Policy", isPrivate ? "no-referrer" : "strict-origin-when-cross-origin");

  // Permissions-Policy
  const microphonePermission = pathname.startsWith("/create") || pathname.startsWith("/g/") ? "(self)" : "()";
  response.headers.set(
    "Permissions-Policy",
    `microphone=${microphonePermission}, camera=(), geolocation=(), payment=(), usb=()`
  );

  // Headers pour routes privées
  if (isPrivate) {
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, _vercel, api)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
