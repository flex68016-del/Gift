"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { audioEngine } from "../../audio/AudioEngine";
import { SceneDirector } from "../../director/SceneDirector";
import { useTier } from "../../perf/useTier";

interface GiftRibbonSceneProps {
  onOpen: () => void;
  onSkip: () => void;
  tier: "lite" | "standard" | "ultra";
}

/**
 * Scène signature du thème Cadeau
 * Boîte cadeau dont on tire le ruban, couvercle qui s'envole, lumière qui jaillit
 * Version 2,5D (couches SVG/CSS + Motion)
 */
export function GiftRibbonScene({ onOpen, onSkip, tier }: GiftRibbonSceneProps) {
  const t = useTranslations("themes.gift");
  const directorRef = useRef<SceneDirector | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isRibbonPulled, setIsRibbonPulled] = useState(false);

  const isLite = tier === "lite";
  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handlePullRibbon = async () => {
    if (isRibbonPulled) return;

    setIsRibbonPulled(true);

    // Reprendre l'AudioContext au premier geste
    await audioEngine.resume();

    // En mode lite : simple fondu
    if (isLite || isReducedMotion) {
      setTimeout(() => {
        setIsOpened(true);
        setTimeout(onOpen, 500);
      }, 300);
      return;
    }

    // En mode standard/ultra : animation GSAP
    const director = new SceneDirector();
    directorRef.current = director;

    const timeline = await director.createTimeline();
    if (!timeline) {
      onOpen();
      return;
    }

    // Le ruban se dénoue
    timeline.to(ribbonRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.3,
      ease: "power2.in",
    });

    // Le couvercle s'envole
    timeline.to(lidRef.current, {
      y: -300,
      opacity: 0,
      rotation: 15,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    // La lumière jaillit
    timeline.fromTo(
      lightRef.current,
      { scale: 0, opacity: 0 },
      { scale: 2, opacity: 1, duration: 0.5, ease: "power2.out" },
    );

    timeline.add(() => {
      setIsOpened(true);
      onOpen();
    });
  };

  useEffect(() => {
    return () => {
      if (directorRef.current) {
        directorRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0E1B16]">
      {/* Lumière jaillissante */}
      <div
        ref={lightRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: isOpened ? 1 : 0, transition: "opacity 0.5s" }}
      >
        <div className="w-96 h-96 bg-gradient-to-t from-[#D9A93F] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Bouton Passer l'animation */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 px-3 py-1 text-sm text-[#F6F1E4] opacity-60 hover:opacity-100 transition-opacity z-50"
        aria-label={t("skip")}
      >
        {t("skip")}
      </button>

      {/* Conteneur principal */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Boîte cadeau 2,5D */}
        <div ref={boxRef} className="relative w-64 h-64">
          {/* Corps de la boîte */}
          <div className="absolute inset-0 bg-[#14382B] rounded-lg shadow-2xl" />
          <div className="absolute inset-0 border-4 border-[#D9A93F] rounded-lg" />

          {/* Couvercle */}
          <div
            ref={lidRef}
            className="absolute -top-4 left-0 right-0 h-16 bg-[#14382B] rounded-t-lg border-4 border-[#D9A93F] border-b-0 shadow-lg"
          >
            {/* Ruban horizontal sur le couvercle */}
            <div className="absolute top-1/2 left-0 right-0 h-4 bg-[#D9A93F] -translate-y-1/2" />
          </div>

          {/* Ruban vertical */}
          <div
            ref={ribbonRef}
            className="absolute top-0 bottom-0 left-1/2 w-4 bg-[#D9A93F] -translate-x-1/2 cursor-pointer"
            onClick={handlePullRibbon}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePullRibbon();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={t("pullRibbon")}
          >
            {/* Nœud du ruban */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#B8283B] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#D9A93F] rounded-full" />
            </div>
          </div>

          {/* Texte d'invitation */}
          {!isRibbonPulled && !isOpened && (
            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[#F6F1E4] text-sm font-medium">
              {t("pullToOpen")}
            </p>
          )}
        </div>

        {/* Message après ouverture */}
        {isOpened && (
          <div className="text-center mt-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-[#F6F1E4] mb-2">
              {t("surprise")}
            </h1>
            <p className="text-[#D9A93F] font-serif italic">
              {t("from", { name: "..." })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
