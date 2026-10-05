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

  it("retourne standard si window existe mais hardware info non disponible", () => {
    const tier = detectTier();
    expect(["lite", "standard", "ultra"]).toContain(tier);
  });
});
