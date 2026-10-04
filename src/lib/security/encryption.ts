import { createCipheriv, createDecipheriv,randomBytes } from "crypto";

import { env } from "../env";

// Préfixe de version pour rotation de clés
const KEY_VERSION_PREFIX = "v1:";

/**
 * Chiffre une donnée avec AES-256-GCM
 * Format: {version}:{iv}:{ciphertext}:{authTag}
 */
export function encrypt(data: string, key?: string): string {
  const encryptionKey = key ? Buffer.from(key, "hex") : Buffer.from(env.DATA_ENCRYPTION_KEY, "hex");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return `${KEY_VERSION_PREFIX}${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Déchiffre une donnée chiffrée avec AES-256-GCM
 */
export function decrypt(encrypted: string, key?: string): string {
  const encryptionKey = key ? Buffer.from(key, "hex") : Buffer.from(env.DATA_ENCRYPTION_KEY, "hex");

  // Parser le format: {version}:{iv}:{ciphertext}:{authTag}
  const parts = encrypted.split(":");
  if (parts.length < 4) {
    throw new Error("Invalid encrypted data format");
  }

  const [, ivHex, ciphertext, authTagHex] = parts;
  if (!ivHex || !ciphertext || !authTagHex) {
    throw new Error("Invalid encrypted data format");
  }
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = createDecipheriv("aes-256-gcm", encryptionKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
