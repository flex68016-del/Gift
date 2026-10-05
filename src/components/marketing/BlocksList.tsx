"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function BlocksList() {
  const t = useTranslations("landing");

  const items = [
    { key: "letter", featured: false },
    { key: "photos", featured: false },
    { key: "voice", featured: true },
    { key: "timeline", featured: false },
    { key: "counter", featured: false },
    { key: "quiz", featured: false },
    { key: "reveal", featured: false },
    { key: "music", featured: false },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--color-ink)" }}>
          {t("content.title")}
        </h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.key}
              className={`p-6 rounded-lg ${item.featured ? "bg-[var(--color-surface-strong)]" : "bg-[var(--color-surface)]"}`}
              initial={{ opacity: 0, x: item.featured ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              {item.featured ? (
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold" style={{ color: "var(--color-red)" }}>
                    🎤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-ink)" }}>
                      {t(`content.${item.key}.title`)}
                    </h3>
                    <p style={{ color: "var(--color-ink-soft)" }}>{t(`content.${item.key}.text`)}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium" style={{ color: "var(--color-ink)" }}>
                    {t(`content.${item.key}.title`)}
                  </h3>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

