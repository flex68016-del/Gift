import { createHmac } from "crypto";
import { env } from "../env";

/**
 * Calcule HMAC-SHA-256 pour l'indexation d'e-mails
 * Permet de rechercher des cadeaux par email sans stocker l'email en clair
 */
export function hmacEmail(email: string): string {
  const hmac = createHmac("sha256", env.EMAIL_HMAC_KEY);
  hmac.update(email.toLowerCase().trim());
  return hmac.digest("hex");
}
