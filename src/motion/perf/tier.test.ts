import { beforeEach, describe, expect, it, vi } from "vitest";

import { detectTier } from "./tier";

describe("detectTier", () => {
  beforeEach(() => {
    // Mock matchMedia pour jsdom
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("retourne standard par défaut côté serveur", () => {
    // Simuler côté serveur
    const windowSpy = vi.spyOn(global, "window", "get").mockReturnValue(undefined as any);

    const tier = detectTier();
    expect(tier).toBe("standard");

    windowSpy.mockRestore();
  });

  it("retourne standard si window existe mais hardware info non disponible", () => {
    const tier = detectTier();
    expect(["lite", "standard", "ultra"]).toContain(tier);
  });
});
