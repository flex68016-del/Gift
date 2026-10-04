"use client";

import { useState, useRef, useEffect } from "react";
import { SceneDirector } from "@/motion/director/SceneDirector";
import { audioEngine } from "@/motion/audio/AudioEngine";
import { Confetti } from "@/motion/primitives/Confetti";
import { TextCompose } from "@/motion/primitives/TextCompose";
import { useTier } from "@/motion/perf/useTier";

interface BirthdayEnvelopeSceneProps {
  onOpen: () => void;
  onSkip: () => void;
  tier: "lite" | "standard" | "ultra";
}

export function BirthdayEnvelopeScene({ onOpen, onSkip, tier }: BirthdayEnvelopeSceneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showText, setShowText] = useState(false);

  const flapRef = useRef<HTMLDivElement>(null);
  const directorRef = useRef<SceneDirector | null>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  const actualTier = useTier();

  // Breathing animation for closed envelope
  useEffect(() => {
    if (!isOpen && envelopeRef.current) {
      const animation = envelopeRef.current.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.02)" },
          { transform: "scale(1)" },
        ],
        {
          duration: 2000,
          iterations: Infinity,
          easing: "ease-in-out",
        },
      );

      return () => animation.cancel();
    }
  }, [isOpen]);

  const handleDragEnd = async () => {
    if (tier === "lite") {
      // Lite version: simple touch
      await openEnvelopeLite();
    } else {
      // Standard/ultra: simplified touch (GSAP will handle the animation)
      await openEnvelopeFull();
    }
  };

  const openEnvelopeLite = async () => {
    setIsOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setShowLetter(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowText(true);
    onOpen();
  };

  const openEnvelopeFull = async () => {
    // Start audio context
    await audioEngine.resume();

    // Create director and run timeline
    const director = new SceneDirector();
    directorRef.current = director;

    setIsOpen(true);

    // GSAP timeline sequence
    const timeline = director.timeline();

    // 1. Open flap
    timeline.to(flapRef.current, {
      rotationX: -180,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // 2. Letter slides out
    timeline.to(".letter", {
      y: -200,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    // 3. Confetti burst
    timeline.call(() => {
      setShowConfetti(true);
    });

    // 4. Text composition
    timeline.call(() => {
      setShowText(true);
    });

    // 5. Open callback
    timeline.call(() => {
      onOpen();
    });

    await director.play();
  };

  const handleSkip = () => {
    if (directorRef.current) {
      directorRef.current.cancel();
    }
    setIsOpen(true);
    setShowLetter(true);
    setShowText(true);
    onSkip();
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-pink-200">
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 px-4 py-2 bg-white/80 backdrop-blur rounded-lg text-sm font-medium hover:bg-white transition-colors"
      >
        Passer
      </button>

      {!isOpen ? (
        <div
          ref={envelopeRef}
          className="relative cursor-pointer"
          onClick={handleDragEnd}
        >
          <div className="w-64 h-40 bg-amber-100 rounded-lg shadow-2xl relative">
            {/* Envelope body */}
            <div className="absolute inset-0 border-4 border-amber-200 rounded-lg" />

            {/* Flap */}
            <div
              ref={flapRef}
              className="absolute top-0 left-0 right-0 h-20 bg-amber-200 origin-top"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-4xl">🎂</div>
              </div>
            </div>

            {/* Instruction */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-amber-700 font-medium">
              {tier === "lite" ? "Touche l'enveloppe" : "Touche l'enveloppe"}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {showLetter && (
            <div className="letter w-64 h-80 bg-white rounded-lg shadow-2xl p-6 relative">
              <div className="text-6xl mb-4">🎉</div>
              {showText && (
                <TextCompose text="Joyeux Anniversaire !" className="text-2xl font-serif text-gray-800" />
              )}
            </div>
          )}

          {showConfetti && actualTier !== "lite" && (
            <Confetti count={100} colors={["#FF6B6B", "#FFE66D", "#4ECDC4"]} />
          )}
        </div>
      )}
    </div>
  );
}
