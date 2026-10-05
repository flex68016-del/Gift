import { env } from "@/lib/env";

import { hmac } from "./hmac";

/**
 * Clé ID pour la rotation des clés de signature
 * Pour l'instant, utilise une seule clé (kid=0)
 * À l'avenir, supporter plusieurs clés pour la rotation
 */
const CURRENT_KID = "0";

/**
 * Signe un identifiant de cadeau pour le stocker dans un cookie
 * Format: giftId:timestamp:kid:signature
 */
export function signGiftId(giftId: string, timestamp?: number): string {
  const ts = timestamp || Date.now();
  const data = `${giftId}:${ts}:${CURRENT_KID}`;
  const signature = hmac(data, env.SESSION_SECRET);
  return `${data}:${signature}`;
}

/**
 * Alias pour signCookie (compatibilité)
 */
export function signCookie(giftId: string): string {
  return signGiftId(giftId);
}

/**
 * Vérifie et extrait l'identifiant de cadeau depuis un cookie signé
 */
export function verifyGiftId(signedData: string): string | null {
  const parts = signedData.split(":");
  // Supporter l'ancien format (3 parts) et le nouveau format (4 parts)
  if (parts.length === 3) {
    // Ancien format: giftId:timestamp:signature
    const [giftId, timestamp, signature] = parts;

    const data = `${giftId}:${timestamp}`;
    const expectedSignature = hmac(data, env.SESSION_SECRET);

    if (signature !== expectedSignature) return null;

    const cookieTime = parseInt(timestamp || "0", 10);
    const maxAge = 14 * 24 * 60 * 60 * 1000;
    if (Date.now() - cookieTime > maxAge) return null;

    return giftId || null;
  } else if (parts.length === 4) {
    // Nouveau format: giftId:timestamp:kid:signature
    const [giftId, timestamp, kid, signature] = parts;

    if (kid !== CURRENT_KID) return null;

    const data = `${giftId}:${timestamp}:${kid}`;
    const expectedSignature = hmac(data, env.SESSION_SECRET);

    if (signature !== expectedSignature) return null;

    const cookieTime = parseInt(timestamp || "0", 10);
    const maxAge = 14 * 24 * 60 * 60 * 1000;
    if (Date.now() - cookieTime > maxAge) return null;

    return giftId || null;
  }

  return null;
}

/**
 * Alias pour verifyCookie (compatibilité)
 */
export function verifyCookie(signedData: string): string | null {
  return verifyGiftId(signedData);
}
