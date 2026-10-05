import { useEffect,useState } from "react";

export type Tier = "lite" | "standard" | "ultra";

export function detectTier(): Tier {
  if (typeof window === "undefined") return "standard";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; saveData?: boolean };
  };
  const mem = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const net = nav.connection?.effectiveType ?? "4g";
  const save = nav.connection?.saveData ?? false;

  if (reduce || save || mem <= 2 || cores <= 4 || ["slow-2g", "2g", "3g"].includes(net)) {
    return "lite";
  }
  if (mem >= 8 && cores >= 8 && net === "4g") {
    return "ultra";
  }
  return "standard";
}

export function useTier() {
  const [tier, setTier] = useState<Tier>(() => {
    // Bascule manuelle depuis localStorage au démarrage
    const saved = localStorage.getItem("ecoMode");
    if (saved === "true") {
      return "lite";
    }
    return detectTier();
  });
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    let rafId: number;
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 2000) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);

        // Dégradation si FPS < 30 pendant 2s
        if (currentFps < 30 && tier !== "lite") {
          setTier((prev) => (prev === "ultra" ? "standard" : "lite"));
        }

        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(measureFps);
    };

    rafId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [tier]);

  // Mesure de cadence pour dégradation dynamique
  useEffect(() => {
    if (document.hidden) return;

    let rafId: number;
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsHistory: number[] = [];

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 2000) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        fpsHistory.push(currentFps);

        if (fpsHistory.length >= 3) {
          const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
          if (avgFps < 30 && tier !== "lite") {
            setTier((prev) => (prev === "ultra" ? "standard" : "lite"));
          }
          fpsHistory = [];
        }

        frameCount = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(measureFps);
    };

    rafId = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [tier]);

  return { tier, fps };
}

// Compatibilité avec l'ancien code
let forcedTier: Tier | null = null;

export function forceTier(tier: Tier | null) {
  forcedTier = tier;
}

export function getTier(): Tier {
  if (forcedTier) return forcedTier;
  return detectTier();
}

export type PerformanceTier = Tier;
