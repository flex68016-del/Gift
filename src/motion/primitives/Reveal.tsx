"use client";

import { useEffect, useRef, useState } from "react";

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
  const elementRef = useRef<HTMLDivElement>(null);

  const reveal = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  // Exposer les méthodes de contrôle via ref
  useEffect(() => {
    if (elementRef.current) {
      (elementRef.current as any).reveal = reveal;
      (elementRef.current as any).hide = hide;
    }
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}
    >
      {children}
    </div>
  );
}
