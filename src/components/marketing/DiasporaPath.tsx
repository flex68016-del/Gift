"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function DiasporaPath() {
  const t = useTranslations("landing");

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--color-ink)" }}>
          {t("diaspora.title")}
        </h2>
        <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--color-ink-soft)" }}>
          {t("diaspora.text")}
        </p>

        <div className="relative h-64">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 200"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Abstract path */}
            <motion.path
              d="M 100 100 Q 400 50 700 100"
              stroke="var(--color-line)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            />

            {/* Starting point */}
            <circle cx="100" cy="100" r="8" fill="var(--color-ink)" />
            <text x="100" y="130" textAnchor="middle" style={{ fill: "var(--color-ink)", fontSize: "14px" }}>
              Montréal · Paris
            </text>

            {/* Ending point */}
            <motion.circle
              cx="700"
              cy="100"
              r="8"
              fill="var(--color-red)"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="700" y="130" textAnchor="middle" style={{ fill: "var(--color-ink)", fontSize: "14px" }}>
              Lomé · Cotonou · Abidjan
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
