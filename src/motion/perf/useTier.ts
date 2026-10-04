"use client";

import { useEffect,useState } from "react";

import { getTier, type PerformanceTier } from "./tier";

/**
 * Hook pour utiliser le niveau de performance
 * Dégade dynamiquement si la cadence passe sous 30 fps
 */
export function useTier() {
  const [tier, setTier] = useState<PerformanceTier>(() => getTier());
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    // Mesure FPS
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFps = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 2000) {
        const currentFps = (frameCount * 1000) / delta;
        setFps(currentFps);

        // Dégadation si FPS < 30
        if (currentFps < 30 && tier !== "lite") {
          setTier("lite");
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFps);
    };

    const animationId = requestAnimationFrame(measureFps);

    return () => cancelAnimationFrame(animationId);
  }, [tier]);

  return { tier, fps };
}
