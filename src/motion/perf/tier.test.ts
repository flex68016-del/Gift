import { describe, it, expect, beforeEach } from "vitest";
import { detectTier, getTier, forceTier } from "./tier";

describe("detectTier", () => {
  beforeEach(() => {
    // Reset forced tier before each test
    forceTier(null);
  });

  it("détecte le niveau lite pour mémoire faible", () => {
    // Mock navigator.hardwareConcurrency et deviceMemory
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 2,
      writable: true,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      value: 2,
      writable: true,
    });

    const tier = detectTier();
    expect(tier).toBe("lite");
  });

  it("détecte le niveau standard pour moyenne gamme", () => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 4,
      writable: true,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      value: 4,
      writable: true,
    });

    const tier = detectTier();
    expect(tier).toBe("standard");
  });

  it("détecte le niveau ultra pour haute gamme", () => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: 8,
      writable: true,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      value: 8,
      writable: true,
    });

    const tier = detectTier();
    expect(tier).toBe("ultra");
  });

  it("retourne standard par défaut si hardware info non disponible", () => {
    Object.defineProperty(window.navigator, "hardwareConcurrency", {
      value: undefined,
      writable: true,
    });
    Object.defineProperty(window.navigator, "deviceMemory", {
      value: undefined,
      writable: true,
    });

    const tier = detectTier();
    expect(tier).toBe("standard"); // Comportement actuel de la fonction
  });

  it("forceTier fonctionne correctement", () => {
    forceTier("ultra");
    expect(getTier()).toBe("ultra");

    forceTier("lite");
    expect(getTier()).toBe("lite");

    forceTier(null);
    // Retourne à la détection automatique
    expect(getTier()).toBe("standard"); // Default sur la plupart des machines
  });
});
