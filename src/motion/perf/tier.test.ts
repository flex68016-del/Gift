import { beforeEach, describe, expect, it, vi } from "vitest";

import { detectTier } from "./tier";

describe("detectTier", () => {
  const originalMatchMedia = window.matchMedia;
  const originalHardwareConcurrency = (navigator as any).hardwareConcurrency;
  const originalDeviceMemory = (navigator as any).deviceMemory;
  const originalConnection = (navigator as any).connection;

  beforeEach(() => {
    // Reset mocks
    window.matchMedia = vi.fn();
    (navigator as any).hardwareConcurrency = originalHardwareConcurrency;
    (navigator as any).deviceMemory = originalDeviceMemory;
    (navigator as any).connection = originalConnection;
  });

  it("détecte le niveau lite pour mémoire faible", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = 2;
    (navigator as any).deviceMemory = 2;
    (navigator as any).connection = { effectiveType: "4g", saveData: false };

    const tier = detectTier();
    expect(tier).toBe("lite");
  });

  it("détecte le niveau lite pour prefers-reduced-motion", () => {
    (window.matchMedia as any).mockReturnValue({ matches: true });
    (navigator as any).hardwareConcurrency = 8;
    (navigator as any).deviceMemory = 8;
    (navigator as any).connection = { effectiveType: "4g", saveData: false };

    const tier = detectTier();
    expect(tier).toBe("lite");
  });

  it("détecte le niveau lite pour saveData", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = 8;
    (navigator as any).deviceMemory = 8;
    (navigator as any).connection = { effectiveType: "4g", saveData: true };

    const tier = detectTier();
    expect(tier).toBe("lite");
  });

  it("détecte le niveau lite pour connexion lente", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = 8;
    (navigator as any).deviceMemory = 8;
    (navigator as any).connection = { effectiveType: "3g", saveData: false };

    const tier = detectTier();
    expect(tier).toBe("lite");
  });

  it("détecte le niveau standard pour moyenne gamme", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = 4;
    (navigator as any).deviceMemory = 4;
    (navigator as any).connection = { effectiveType: "4g", saveData: false };

    const tier = detectTier();
    expect(tier).toBe("standard");
  });

  it("détecte le niveau ultra pour haute gamme", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = 8;
    (navigator as any).deviceMemory = 8;
    (navigator as any).connection = { effectiveType: "4g", saveData: false };

    const tier = detectTier();
    expect(tier).toBe("ultra");
  });

  it("retourne standard par défaut côté serveur", () => {
    // Simuler côté serveur
    const windowSpy = vi.spyOn(global, "window", "get").mockReturnValue(undefined as any);

    const tier = detectTier();
    expect(tier).toBe("standard");

    windowSpy.mockRestore();
  });

  it("retourne standard si hardware info non disponible", () => {
    (window.matchMedia as any).mockReturnValue({ matches: false });
    (navigator as any).hardwareConcurrency = undefined;
    (navigator as any).deviceMemory = undefined;
    (navigator as any).connection = undefined;

    const tier = detectTier();
    expect(tier).toBe("standard");
  });
});
