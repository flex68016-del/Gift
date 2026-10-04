"use client";

import { useEffect, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

/**
 * Primitif d'animation : révèle au déclenchement (non au scroll)
 * À utiliser pour les réponses utilisateur, pas pour le scroll
 */
export function Reveal({ children, className = "", threshold = 0.5 }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);

  const reveal = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <div
      data-reveal="true"
      className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      {children}
    </div>
  );
}

export function useReveal() {
  const reveal = () => {
    const el = document.querySelector('[data-reveal="true"]');
    if (el) {
      (el as any).reveal?.();
    }
  };

  return { reveal };
}
