"use client";

import { useState, useRef } from "react";
import { TextCompose } from "@/motion/primitives/TextCompose";
import { Confetti } from "@/motion/primitives/Confetti";
import { Haptics } from "@/motion/primitives/Haptics";
import { Reveal } from "@/motion/primitives/Reveal";
import { getTier, forceTier, type PerformanceTier } from "@/motion/perf/tier";
import { useTier } from "@/motion/perf/useTier";

export default function MotionDevPage() {
  const [selectedTier, setSelectedTier] = useState<PerformanceTier | null>(null);
  const { tier: currentTier, fps } = useTier();
  const [showConfetti, setShowConfetti] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  const handleTierChange = (tier: PerformanceTier) => {
    forceTier(tier);
    setSelectedTier(tier);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const triggerHaptics = () => {
    Haptics.success();
  };

  const triggerReveal = () => {
    if (revealRef.current) {
      (revealRef.current as any).reveal();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8">Moteur de mouvement - Développement</h1>

      {/* Contrôle du niveau de performance */}
      <section className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Niveau de performance</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleTierChange("lite")}
            className={`px-4 py-2 rounded ${selectedTier === "lite" ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Lite
          </button>
          <button
            onClick={() => handleTierChange("standard")}
            className={`px-4 py-2 rounded ${selectedTier === "standard" ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Standard
          </button>
          <button
            onClick={() => handleTierChange("ultra")}
            className={`px-4 py-2 rounded ${selectedTier === "ultra" ? "bg-red-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Ultra
          </button>
          <button
            onClick={() => {
              forceTier(null);
              setSelectedTier(null);
            }}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
          >
            Auto
          </button>
        </div>
        <p className="text-sm">
          Niveau actuel: <strong>{currentTier}</strong> | FPS: <strong>{fps.toFixed(1)}</strong>
        </p>
      </section>

      {/* Primitives */}
      <section className="space-y-8">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">TextCompose</h2>
          <TextCompose text="Ce texte s'écrit progressivement..." className="text-lg" />
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Confetti</h2>
          <button onClick={triggerConfetti} className="px-4 py-2 bg-red-600 text-white rounded">
            Lancer confetti
          </button>
          {showConfetti && <Confetti />}
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Haptics</h2>
          <div className="flex gap-4">
            <button onClick={() => Haptics.light()} className="px-4 py-2 bg-blue-600 text-white rounded">
              Light
            </button>
            <button onClick={() => Haptics.medium()} className="px-4 py-2 bg-blue-600 text-white rounded">
              Medium
            </button>
            <button onClick={() => Haptics.heavy()} className="px-4 py-2 bg-blue-600 text-white rounded">
              Heavy
            </button>
            <button onClick={triggerHaptics} className="px-4 py-2 bg-green-600 text-white rounded">
              Success
            </button>
            <button onClick={() => Haptics.error()} className="px-4 py-2 bg-red-600 text-white rounded">
              Error
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Reveal</h2>
          <button onClick={triggerReveal} className="px-4 py-2 bg-red-600 text-white rounded mb-4">
            Révéler
          </button>
          <Reveal ref={revealRef}>
            <div className="p-4 bg-white dark:bg-gray-700 rounded">
              Ce contenu est révélé au clic, pas au scroll.
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
