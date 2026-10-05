import { routing } from "@/i18n/routing";

/**
 * Analyse l'URL Supabase et retourne l'hôte
 * Ne lève jamais d'exception, repli sur "*.supabase.co" en cas d'erreur
 */
export function getSupabaseHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return "*.supabase.co";
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return "*.supabase.co";
  }
}

/**
 * Détermine si un chemin est une route privée
 * Retire le préfixe de locale (/fr, /en) avant de tester
 */
export function isPrivatePath(pathname: string): boolean {
  // Retirer le préfixe de locale
  let cleanPath = pathname;
  for (const locale of routing.locales) {
    if (cleanPath.startsWith(`/${locale}/`)) {
      cleanPath = cleanPath.slice(`/${locale}`.length);
      break;
    }
  }

  // Tester les routes privées
  return (
    cleanPath.startsWith("/g/") ||
    cleanPath.startsWith("/manage/") ||
    cleanPath.startsWith("/c/") ||
    cleanPath.startsWith("/checkout/")
  );
}

/**
 * Construit la politique CSP stricte
 * Sans upgrade-insecure-requests ni frame-ancestors
 * Avec report-uri pour collecter les violations
 */
export function buildCsp(nonce: string): string {
  const supabaseHost = getSupabaseHost();

  const csp = [
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: blob: https://${supabaseHost}`,
    `media-src 'self' blob: https://${supabaseHost}`,
    "font-src 'self'",
    `connect-src 'self' https://${supabaseHost} wss://${supabaseHost}`,
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
  ].join("; ");

  return csp;
}
