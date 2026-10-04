import { describe, it, expect } from "vitest";
import { generateSlug, generateEditToken, sha256, safeEqual } from "./tokens";

describe("Security tokens", () => {
  describe("generateSlug", () => {
    it("génère un slug de 12 caractères", () => {
      const slug = generateSlug();
      expect(slug).toHaveLength(12);
    });

    it("génère des slugs uniques", () => {
      const slug1 = generateSlug();
      const slug2 = generateSlug();
      expect(slug1).not.toBe(slug2);
    });
  });

  describe("generateEditToken", () => {
    it("génère un jeton non vide", () => {
      const token = generateEditToken();
      expect(token).toBeTruthy();
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("sha256", () => {
    it("calcule le hash SHA-256 d'une chaîne", () => {
      const hash = sha256("test");
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("produit le même hash pour la même entrée", () => {
      const hash1 = sha256("test");
      const hash2 = sha256("test");
      expect(hash1).toBe(hash2);
    });
  });

  describe("safeEqual", () => {
    it("retourne true pour des chaînes identiques", () => {
      expect(safeEqual("test", "test")).toBe(true);
    });

    it("retourne false pour des chaînes différentes", () => {
      expect(safeEqual("test", "other")).toBe(false);
    });

    it("retourne false pour des longueurs différentes", () => {
      expect(safeEqual("test", "testing")).toBe(false);
    });
  });
});
