"use client";

import { useTranslations } from "next-intl";

export function Faq() {
  const t = useTranslations("landing");

  const questions = [1, 2, 3, 4, 5, 6] as const;

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--color-ink)" }}>
          {t("faq.title")}
        </h2>

        <div className="space-y-4">
          {questions.map((i) => (
            <details
              key={i}
              className="group rounded-lg"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <summary
                className="cursor-pointer p-6 font-medium flex justify-between items-center"
                style={{ color: "var(--color-ink)" }}
              >
                {t(`faq.q${i}.question`)}
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 pb-6" style={{ color: "var(--color-ink-soft)" }}>
                {t(`faq.q${i}.answer`)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
