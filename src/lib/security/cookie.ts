import { env } from "@/lib/env";

import { hmac } from "./hmac";

/**
 * Signe un identifiant de cadeau pour le stocker dans un cookie
 */
export function signGiftId(giftId: string): string {
  const data = `${giftId}:${Date.now()}`;
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
  if (parts.length !== 3) return null;

  const [giftId, timestamp, signature] = parts;

  // Vérifier la signature
  const data = `${giftId}:${timestamp}`;
  const expectedSignature = hmac(data, env.SESSION_SECRET);

  if (signature !== expectedSignature) return null;

  // Vérifier que le cookie n'est pas trop vieux (14 jours)
  const cookieTime = parseInt(timestamp || "0", 10);
  const maxAge = 14 * 24 * 60 * 60 * 1000; // 14 jours en ms
  if (Date.now() - cookieTime > maxAge) return null;

  return giftId || null;
}

/**
 * Alias pour verifyCookie (compatibilité)
 */
export function verifyCookie(signedData: string): string | null {
  return verifyGiftId(signedData);
}
