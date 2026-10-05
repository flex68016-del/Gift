"use client";

import { useTranslations } from "next-intl";

export function PriceBlock() {
  const t = useTranslations("landing");

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8" style={{ color: "var(--color-ink)" }}>
          {t("price.title")}
        </h2>

        <div className="p-8 rounded-lg" style={{ backgroundColor: "var(--color-surface)" }}>
          <div className="text-5xl font-bold mb-4" style={{ color: "var(--color-red)" }}>
            {t("price.amount")}
          </div>
          <p className="text-xl mb-8" style={{ color: "var(--color-ink-soft)" }}>
            {t("price.unit")}
          </p>

          <ul className="space-y-4 text-left max-w-md mx-auto">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-3" style={{ color: "var(--color-ink)" }}>
                <span className="text-xl" style={{ color: "var(--color-success)" }}>
                  ✓
                </span>
                <span>{t(`price.point${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
