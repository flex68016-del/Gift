"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SceneDirector } from "../../director/SceneDirector";
import { useTier } from "../../perf/useTier";
import { audioEngine } from "../../audio/AudioEngine";

interface ParchmentSceneProps {
  onOpen: () => void;
  onSkip: () => void;
  tier: "lite" | "standard" | "ultra";
}

/**
 * Scène signature du thème Parchemin
 * Sceau de cire qu'on brise, parchemin qui se déroule au rythme du défilement
 */
export function ParchmentScene({ onOpen, onSkip, tier }: ParchmentSceneProps) {
  const t = useTranslations("themes.parchment");
  const directorRef = useRef<SceneDirector | null>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const parchmentRef = useRef<HTMLDivElement>(null);
  const [isBroken, setIsBroken] = useState(false);
  const [isUnrolled, setIsUnrolled] = useState(false);

  const isLite = tier === "lite";
  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleBreakSeal = async () => {
    if (isBroken) return;

    setIsBroken(true);

    // Reprendre l'AudioContext au premier geste
    await audioEngine.resume();

    // En mode lite : simple fondu
    if (isLite || isReducedMotion) {
      setTimeout(() => {
        setIsUnrolled(true);
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

    // Animation du sceau qui se brise
    timeline.to(sealRef.current, {
      opacity: 0,
      scale: 1.2,
      rotation: 15,
      duration: 0.4,
      ease: "power2.in",
    });

    // Le parchemin se déroule
    timeline.fromTo(
      parchmentRef.current,
      { scaleY: 0.1, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
    );

    timeline.add(() => {
      setIsUnrolled(true);
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
    <div className="relative w-full h-screen overflow-hidden bg-[#EBDCBB]">
      {/* Bouton Passer l'animation */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-4 px-3 py-1 text-sm text-[#2E2118] opacity-60 hover:opacity-100 transition-opacity"
        aria-label={t("skip")}
      >
        {t("skip")}
      </button>

      {/* Conteneur principal */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Sceau de cire */}
        {!isBroken && (
          <div
            ref={sealRef}
            onClick={handleBreakSeal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleBreakSeal();
              }
            }}
            role="button"
            tabIndex={0}
            className="relative w-32 h-32 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8E1B1B] focus:ring-offset-2"
            aria-label={t("breakSeal")}
          >
            {/* Sceau en CSS (simulé) */}
            <div className="absolute inset-0 bg-[#8E1B1B] rounded-full shadow-lg flex items-center justify-center">
              <div className="w-24 h-24 bg-[#6B1414] rounded-full flex items-center justify-center">
                <div className="text-[#B38B3E] text-4xl font-serif">✦</div>
              </div>
            </div>
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-full pointer-events-none" />
            {/* Texte d'invitation */}
            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[#2E2118] text-sm font-serif">
              {t("tapToBreak")}
            </p>
          </div>
        )}

        {/* Parchemin */}
        <div
          ref={parchmentRef}
          className={`relative max-w-2xl w-full bg-[#F5E6D3] shadow-2xl p-8 md:p-12 transform transition-all duration-500 ${
            isUnrolled ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
          style={{
            minHeight: isUnrolled ? "auto" : "0",
            overflow: "hidden",
          }}
        >
          {/* Bordure décorative */}
          <div className="absolute inset-0 border-4 border-[#B38B3E] pointer-events-none" />
          <div className="absolute inset-1 border border-[#2E2118]/20 pointer-events-none" />

          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-[#2E2118] mb-2">
              {t("dear", { name: "..." })}
            </h1>
            <p className="text-[#8E1B1B] font-serif italic">
              {t("from", { name: "..." })}
            </p>
          </div>

          {/* Indicateur de défilement */}
          {isUnrolled && !isLite && !isReducedMotion && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#2E2118]/60 text-sm animate-bounce">
              ↓ {t("scrollToRead")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
