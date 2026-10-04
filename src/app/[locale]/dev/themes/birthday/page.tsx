"use client";

import { useState } from "react";
import { BirthdayEnvelopeScene } from "@/motion/themes/birthday-envelope/scene";
import { useTier } from "@/motion/perf/useTier";

export default function BirthdayThemeDevPage() {
  const actualTier = useTier();
  const [selectedTier, setSelectedTier] = useState<"lite" | "standard" | "ultra">(actualTier);
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
  };

  const handleSkip = () => {
    setIsOpened(true);
  };

  const handleReset = () => {
    setIsOpened(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Thème Anniversaire - Développement</h1>

        <div className="mb-6 space-x-4">
          <button
            onClick={() => setSelectedTier("lite")}
            className={`px-4 py-2 rounded ${selectedTier === "lite" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Lite
          </button>
          <button
            onClick={() => setSelectedTier("standard")}
            className={`px-4 py-2 rounded ${selectedTier === "standard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Standard
          </button>
          <button
            onClick={() => setSelectedTier("ultra")}
            className={`px-4 py-2 rounded ${selectedTier === "ultra" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Ultra
          </button>
        </div>

        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Niveau détecté: {actualTier}
          </span>
        </div>

        {!isOpened ? (
          <div className="h-[600px] border rounded-lg overflow-hidden">
            <BirthdayEnvelopeScene
              tier={selectedTier}
              onOpen={handleOpen}
              onSkip={handleSkip}
            />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg">Scène terminée !</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
