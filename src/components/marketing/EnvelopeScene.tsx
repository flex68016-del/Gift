"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useTier } from "../../motion/perf/tier";
import { Confetti } from "../../motion/primitives/Confetti";

interface EnvelopeSceneProps {
  name: string;
}

export function EnvelopeScene({ name }: EnvelopeSceneProps) {
  const { tier } = useTier();
  const t = useTranslations("landing");
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shouldAnnounce, setShouldAnnounce] = useState(false);

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0]);
  const rotateX = useTransform(y, [0, 100], [0, -45]);

  const displayName = name || t("letter.nameDefault");

  const handleOpen = () => {
    if (isOpen) return;
    setHasInteracted(true);
    setIsOpen(true);
    setShowConfetti(true);
    setShouldAnnounce(true);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleReplay = () => {
    setIsOpen(false);
    setShowConfetti(false);
    setHasInteracted(false);
    setShouldAnnounce(false);
    y.set(0);
    setTimeout(() => {
      setIsOpen(true);
      setShowConfetti(true);
    }, 100);
  };

  useEffect(() => {
    if (isOpen && tier !== "lite") {
      animate(y, 100, { duration: 0.5, ease: "easeOut" });
    }
  }, [isOpen, tier, y]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Envelope */}
      <div
        className="relative w-full aspect-[3/2] bg-[var(--color-surface)] rounded-lg shadow-lg cursor-pointer select-none"
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
        aria-label={t("hero.hint")}
      >
        {/* Back of envelope */}
        <div className="absolute inset-0 bg-white rounded-lg border-4 border-[var(--color-line)]"></div>

        {/* Flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 origin-top"
          style={{
            backgroundColor: "var(--color-surface-strong)",
            rotateX: isOpen ? rotateX : 0,
            opacity: isOpen ? opacity : 1,
            transformOrigin: "top center",
          }}
        >
          {/* Triangle shape for flap */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "50% solid transparent",
              borderRight: "50% solid transparent",
              borderTop: `40px solid var(--color-surface-strong)`,
            }}
          />
        </motion.div>

        {/* Seal */}
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
          style={{
            backgroundColor: "var(--color-red)",
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0 : 1,
          }}
        />

        {/* Hint */}
        {!hasInteracted && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-medium"
            style={{ color: "var(--color-ink-soft)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t("hero.hint")}
          </motion.div>
        )}
      </div>

      {/* Letter */}
      {isOpen && (
        <motion.div
          className="relative mt-8 p-8 bg-white rounded-lg shadow-lg border-2 border-[var(--color-line)]"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>
            {t("letter.title", { name: displayName })}
          </h2>
          <p className="text-lg mb-4" style={{ color: "var(--color-ink-soft)" }}>
            {t("letter.body")}
          </p>
          <p className="text-right italic" style={{ color: "var(--color-ink)" }}>
            {t("letter.signature")}
          </p>
        </motion.div>
      )}

      {/* Screen reader announcement */}
      {shouldAnnounce && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {t("letter.title", { name: displayName })}. {t("letter.body")} {t("letter.signature")}
        </div>
      )}

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Replay button */}
      {isOpen && (
        <motion.button
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: "var(--color-surface)",
            color: "var(--color-ink)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleReplay}
        >
          {t("hero.replay")}
        </motion.button>
      )}
    </div>
  );
}
