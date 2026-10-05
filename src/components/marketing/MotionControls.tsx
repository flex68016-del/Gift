"use client";

import { useTier } from "../../motion/perf/tier";

export function MotionControls() {
  const { tier, fps } = useTier();

  const togglePause = () => {
    const html = document.documentElement;
    const isPaused = html.getAttribute("data-motion") === "paused";
    html.setAttribute("data-motion", isPaused ? "playing" : "paused");
  };

  const toggleEcoMode = () => {
    const isEco = localStorage.getItem("ecoMode") === "true";
    localStorage.setItem("ecoMode", isEco ? "false" : "true");
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={togglePause}
        className="px-3 py-2 rounded-lg text-xs bg-[var(--color-surface)] border border-[var(--color-line)]"
        style={{ color: "var(--color-ink)" }}
        aria-label="Mettre en pause les animations"
      >
        Pause
      </button>
      <button
        onClick={toggleEcoMode}
        className="px-3 py-2 rounded-lg text-xs bg-[var(--color-surface)] border border-[var(--color-line)]"
        style={{ color: "var(--color-ink)" }}
        aria-label="Mode économie"
      >
        {tier === "lite" ? "Normal" : "Économie"}
      </button>
      <div className="text-xs" style={{ color: "var(--color-ink-soft)" }}>
        {fps} FPS
      </div>
    </div>
  );
}
