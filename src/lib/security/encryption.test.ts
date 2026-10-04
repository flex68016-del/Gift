import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./encryption";

describe("encryption", () => {
  const testKey = "a".repeat(64);

  it("chiffre et déchiffre correctement une chaîne", () => {
    const plaintext = "sensitive-data";
    const encrypted = encrypt(plaintext, testKey);
    const decrypted = decrypt(encrypted, testKey);
    expect(decrypted).toBe(plaintext);
  });

  it("produit des résultats différents pour le même texte", () => {
    const plaintext = "sensitive-data";
    const encrypted1 = encrypt(plaintext, testKey);
    const encrypted2 = encrypt(plaintext, testKey);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it("inclut le préfixe de version", () => {
    const encrypted = encrypt("test", testKey);
    expect(encrypted).toContain("v1:");
  });

  it("lance une erreur pour un format invalide", () => {
    expect(() => decrypt("invalid", testKey)).toThrow("Invalid encrypted data format");
  });
});
