"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function ThemesStrip() {
  const t = useTranslations("landing");

  const themes = [
    {
      key: "birthday",
      title: t("themes.birthday.title"),
      text: t("themes.birthday.text"),
      size: "large",
    },
    {
      key: "parchment",
      title: t("themes.parchment.title"),
      text: t("themes.parchment.text"),
      size: "medium",
    },
    {
      key: "gift",
      title: t("themes.gift.title"),
      text: t("themes.gift.text"),
      size: "small",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--color-ink)" }}>
          {t("themes.title")}
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.key}
              className="rounded-lg p-6 cursor-pointer"
              style={{
                backgroundColor: "var(--color-surface)",
                width: theme.size === "large" ? "100%" : theme.size === "medium" ? "48%" : "30%",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-ink)" }}>
                {theme.title}
              </h3>
              <p style={{ color: "var(--color-ink-soft)" }}>{theme.text}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-8" style={{ color: "var(--color-ink-soft)" }}>
          {t("themes.more")}
        </p>
      </div>
    </section>
  );
}
