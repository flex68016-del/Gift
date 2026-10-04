"use client";

import { useEffect, useRef } from "react";
import { getTier } from "../perf/tier";

interface ConfettiProps {
  count?: number;
  colors?: string[];
}

/**
 * Primitif d'animation : confetti (canvas)
 * La quantité varie selon le niveau de performance
 */
export function Confetti({ count, colors }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Adapter la quantité selon le niveau
    const tier = getTier();
    const actualCount = count || (tier === "lite" ? 30 : tier === "ultra" ? 150 : 80);
    const confettiColors = colors || ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    // Initialiser les particules
    for (let i = 0; i < actualCount; i++) {
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      if (color) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10 - 5,
          color,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // gravité
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-4, -4, 8, 8);
        ctx.restore();
      });

      // Retirer les particules hors écran
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p && p.y > canvas.height + 20) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [count, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
