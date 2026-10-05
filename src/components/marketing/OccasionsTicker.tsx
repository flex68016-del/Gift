"use client";

import { useTranslations } from "next-intl";

export function OccasionsTicker() {
  const t = useTranslations("landing");
  const occasions = t.raw("occasions") as string[];

  return (
    <section className="py-12 overflow-hidden">
      <div
        className="whitespace-nowrap animate-marquee hover:pause"
        style={{
          display: "flex",
          gap: "4rem",
          animation: "marquee 30s linear infinite",
        }}
      >
        {occasions.map((occasion, index) => (
          <span
            key={`${occasion}-${index}`}
            className="text-xl font-medium"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {occasion}
          </span>
        ))}
        {occasions.map((occasion, index) => (
          <span
            key={`${occasion}-dup-${index}`}
            className="text-xl font-medium"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {occasion}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
