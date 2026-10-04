import { env } from "@/lib/env";

/**
 * Limiteur de débit avec Upstash Redis
 * À implémenter quand Upstash sera configuré
 */

interface LimitOptions {
  route: string;
  device?: string;
  resource: string;
  ip?: string;
}

export async function limit({ route, device, resource, ip }: LimitOptions): Promise<{ allowed: boolean; resetAt?: number }> {
  // Pour l'instant, retourne toujours true
  // À remplacer par l'implémentation Upstash réelle
  console.log(`Rate limit check: ${route}/${resource}`, { device, ip });
  return { allowed: true };
}

/**
 * Limiteur de débit simple basé sur l'IP pour le développement
 */
export async function simpleLimit(key: string, maxRequests: number, windowMs: number): Promise<{ allowed: boolean; resetAt?: number }> {
  // Pour l'instant, retourne toujours true
  // À remplacer par l'implémentation Upstash réelle
  console.log(`Simple rate limit check: ${key}`, { maxRequests, windowMs });
  return { allowed: true };
}
