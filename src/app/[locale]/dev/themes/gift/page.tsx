"use client";

import { forceTier } from "@/motion/perf/tier";
import { useTier } from "@/motion/perf/useTier";
import { GiftRibbonScene } from "@/motion/themes/gift-ribbon/scene";

export default function GiftThemePage() {
  const { tier } = useTier();

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold mb-2">Thème Cadeau - Test</h1>
        <p className="text-sm mb-2">Niveau détecté: {tier}</p>
        <div className="space-y-2">
          <button
            onClick={() => forceTier("lite")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Force Lite
          </button>
          <button
            onClick={() => forceTier("standard")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Force Standard
          </button>
          <button
            onClick={() => forceTier("ultra")}
            className="block w-full px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Force Ultra
          </button>
          <button
            onClick={() => forceTier(null)}
            className="block w-full px-3 py-1 bg-blue-200 rounded hover:bg-blue-300"
          >
            Auto-detect
          </button>
        </div>
      </div>

      <GiftRibbonScene
        onOpen={() => console.log("Scene complete")}
        onSkip={() => console.log("Scene skipped")}
        tier={tier}
      />
    </div>
  );
}
