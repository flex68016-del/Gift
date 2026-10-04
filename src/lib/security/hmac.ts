import { createHmac } from "crypto";

import { env } from "../env";

/**
 * Calcule HMAC-SHA-256 générique
 */
export function hmac(data: string, key: string): string {
  const hmac = createHmac("sha256", key);
  hmac.update(data);
  return hmac.digest("hex");
}

/**
 * Calcule HMAC-SHA-256 pour l'indexation d'e-mails
 * Permet de rechercher des cadeaux par email sans stocker l'email en clair
 */
export function hmacEmail(email: string, key?: string): string {
  const hmacKey = key || env.EMAIL_HMAC_KEY;
  const hmac = createHmac("sha256", hmacKey);
  hmac.update(email.toLowerCase().trim());
  return hmac.digest("hex");
}
