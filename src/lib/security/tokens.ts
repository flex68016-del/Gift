import { randomBytes, createHash, timingSafeEqual } from "crypto";

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 12;
const EDIT_TOKEN_LENGTH = 32;

/**
 * Génère un slug aléatoire pour les cadeaux (ex: "aB3xY9zP")
 */
export function generateSlug(): string {
  const bytes = randomBytes(SLUG_LENGTH);
  let slug = "";
  for (let i = 0; i < SLUG_LENGTH; i++) {
    slug += ALPHANUMERIC[bytes[i] % ALPHANUMERIC.length];
  }
  return slug;
}

/**
 * Génère un jeton d'édition sécurisé pour les émetteurs
 */
export function generateEditToken(): string {
  return randomBytes(EDIT_TOKEN_LENGTH).toString("base64url");
}

/**
 * Calcule le hash SHA-256 d'une chaîne
 */
export function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

/**
 * Comparaison à temps constant pour éviter les attaques par timing
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
