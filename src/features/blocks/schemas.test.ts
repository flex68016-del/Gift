import { describe, expect,it } from "vitest";

import {
  counterBlockSchema,
  galleryBlockSchema,
  letterBlockSchema,
  musicBlockSchema,
  normalizeOrder,
  quizBlockSchema,
  revealBlockSchema,
  timelineBlockSchema,
  validateGift,
  voiceBlockSchema,
} from "./schemas";

describe("Block schemas", () => {
  describe("letterBlockSchema", () => {
    it("accepte un bloc letter valide", () => {
      const result = letterBlockSchema.parse({
        type: "letter",
        content: "Test content",
        style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
      });
      expect(result).toBeDefined();
    });

    it("rejette un contenu vide", () => {
      expect(() =>
        letterBlockSchema.parse({
          type: "letter",
          content: "",
          style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
        }),
      ).toThrow();
    });

    it("rejette un contenu trop long", () => {
      expect(() =>
        letterBlockSchema.parse({
          type: "letter",
          content: "a".repeat(10001),
          style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
        }),
      ).toThrow();
    });
  });

  describe("galleryBlockSchema", () => {
    it("accepte un bloc gallery valide", () => {
      const result = galleryBlockSchema.parse({
        type: "gallery",
        images: [{ id: "1", caption: "Test", position: 0 }],
        style: { layout: "grid", showCaptions: true },
      });
      expect(result).toBeDefined();
    });

    it("rejette un tableau vide", () => {
      expect(() =>
        galleryBlockSchema.parse({
          type: "gallery",
          images: [],
          style: { layout: "grid", showCaptions: true },
        }),
      ).toThrow();
    });

    it("rejette trop d'images", () => {
      expect(() =>
        galleryBlockSchema.parse({
          type: "gallery",
          images: Array(21).fill({ id: "1", caption: "Test", position: 0 }),
          style: { layout: "grid", showCaptions: true },
        }),
      ).toThrow();
    });
  });

  describe("validateGift", () => {
    it("accepte un cadeau valide", () => {
      const blocks = [
        {
          type: "letter",
          content: "Test",
          style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
        },
        {
          type: "reveal",
          content: "Surprise!",
          style: { revealTrigger: "click" },
        },
      ];
      const result = validateGift(blocks);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejette un cadeau sans blocs", () => {
      const result = validateGift([]);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("rejette un cadeau avec plusieurs reveal", () => {
      const blocks = [
        {
          type: "letter",
          content: "Test",
          style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
        },
        {
          type: "reveal",
          content: "Surprise 1",
          style: { revealTrigger: "click" },
        },
        {
          type: "reveal",
          content: "Surprise 2",
          style: { revealTrigger: "click" },
        },
      ];
      const result = validateGift(blocks);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Un seul bloc 'reveal' est autorisé");
    });

    it("rejette un cadeau où reveal n'est pas le dernier", () => {
      const blocks = [
        {
          type: "reveal",
          content: "Surprise!",
          style: { revealTrigger: "click" },
        },
        {
          type: "letter",
          content: "Test",
          style: { fontSize: "md", textAlign: "left", fontFamily: "serif" },
        },
      ];
      const result = validateGift(blocks);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Le dernier bloc doit être de type 'reveal'");
    });
  });

  describe("normalizeOrder", () => {
    it("retourne les blocs inchangés", () => {
      const blocks = [
        {
          type: "letter" as const,
          content: "Test",
          style: { fontSize: "md" as const, textAlign: "left" as const, fontFamily: "serif" as const },
        },
      ];
      const result = normalizeOrder(blocks);
      expect(result).toEqual(blocks);
    });
  });
});
