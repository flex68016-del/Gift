"use client";

import { useEffect, useMemo,useRef } from "react";

import { useTier } from "../perf/tier";

interface ConfettiProps {
  count?: number;
  colors?: string[];
}

export function Confetti({ count, colors }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = useTier();

  const confettiCount = count || (tier === "ultra" ? 140 : 60);
  const particleColors = useMemo(
    () =>
      colors || [
        "#C8102E",
        "#FF4D8D",
        "#FFB3CB",
        "#1E7A4C",
      ],
    [colors],
  );

  useEffect(() => {
    // Lite mode: no confetti
    if (tier === "lite") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2,
      size: Math.random() * 8 + 4,
      color: particleColors[Math.floor(Math.random() * particleColors.length)] || "#C8102E",
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
    }));

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color || "#C8102E";
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Remove particles that are off screen
        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 2;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [confettiCount, particleColors, tier]);

  if (tier === "lite") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
