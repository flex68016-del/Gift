import { headers } from "next/headers";
import { env } from "@/lib/env";

/**
 * Vérifie que la requête provient de la même origine
 * Protège contre les attaques CSRF
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const secFetchSite = request.headers.get("sec-fetch-site");

  const appUrl = new URL(env.NEXT_PUBLIC_APP_URL);
  const appOrigin = appUrl.origin;

  // Vérifier Origin
  if (origin && origin !== appOrigin) {
    throw new Error("Invalid origin");
  }

  // Vérifier Referer
  if (referer && !referer.startsWith(appOrigin)) {
    throw new Error("Invalid referer");
  }

  // Vérifier Sec-Fetch-Site
  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "none") {
    throw new Error("Invalid sec-fetch-site");
  }
}

/**
 * Vérifie que le corps de la requête n'est pas trop grand
 */
export function assertBodySize(request: Request, maxSize: number = 256 * 1024): void {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > maxSize) {
    throw new Error("Request body too large");
  }
}
