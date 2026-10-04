import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Paramètres scrypt (N=16384, r=8, p=1) - compromis entre sécurité et performance
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 32;

/**
 * Hash un secret ou mot de passe avec scrypt
 * Format: {salt}:{hash}
 */
export function hashSecret(secret: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(secret, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Vérifie un secret contre un hash
 * Utilise une comparaison à temps constant
 */
export function verifySecret(secret: string, hashed: string): boolean {
  const [salt, hash] = hashed.split(":");
  if (!salt || !hash) {
    return false;
  }

  const computedHash = scryptSync(secret, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }).toString("hex");

  return timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
}

/**
 * Vérification dummy pour égalisation de temps (anti-timing attack)
 * Toujours effectue un hash même si l'entrée est invalide
 */
export function dummyHash(): string {
  const dummy = "dummy-input-for-timing";
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  return scryptSync(dummy, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }).toString("hex");
}
