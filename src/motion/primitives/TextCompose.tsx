"use client";

import { useEffect, useRef } from "react";

interface TextComposeProps {
  text: string;
  className?: string;
  speed?: number;
}

/**
 * Primitif d'animation : le texte s'écrit progressivement
 */
export function TextCompose({ text, className = "", speed = 50 }: TextComposeProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    element.textContent = "";
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span ref={textRef} className={className} />;
}
