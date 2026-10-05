"use client";

import { useTranslations } from "next-intl";

export function OccasionsTicker() {
  const t = useTranslations("landing");
  const occasions = t.raw("occasions") as string[];

  return (
    <section className="py-12 overflow-hidden">
      <div
        className="whitespace-nowrap"
        style={{
          display: "flex",
          gap: "4rem",
          animation: "marquee 30s linear infinite",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
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

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation: marquee"] {
            animation: none !important;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
