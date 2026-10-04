import { describe, it, expect, beforeEach } from "vitest";
import { hmacEmail } from "./hmac";

describe("hmacEmail", () => {
  const testKey = "a".repeat(64);

  beforeEach(() => {
    // Mock EMAIL_HMAC_KEY for tests by importing after setting env
    // Note: This requires the env module to be reloaded or we test directly
  });

  it("calcule HMAC d'un email", () => {
    const hmac = hmacEmail("test@example.com", testKey);
    expect(hmac).toHaveLength(64);
    expect(hmac).toMatch(/^[a-f0-9]{64}$/);
  });

  it("produit le même HMAC pour le même email (normalisé)", () => {
    const hmac1 = hmacEmail("Test@Example.com", testKey);
    const hmac2 = hmacEmail("test@example.com", testKey);
    expect(hmac1).toBe(hmac2);
  });

  it("produit des HMAC différents pour des emails différents", () => {
    const hmac1 = hmacEmail("test1@example.com", testKey);
    const hmac2 = hmacEmail("test2@example.com", testKey);
    expect(hmac1).not.toBe(hmac2);
  });
});
