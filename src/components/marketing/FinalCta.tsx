"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function FinalCta() {
  const t = useTranslations("landing");
  const router = useRouter();

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8" style={{ color: "var(--color-ink)" }}>
          {t("final.title")}
        </h2>
        <button
          onClick={() => router.push("/create")}
          className="px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "var(--color-red)",
            color: "white",
          }}
        >
          {t("final.cta")}
        </button>
      </div>
    </section>
  );
}
