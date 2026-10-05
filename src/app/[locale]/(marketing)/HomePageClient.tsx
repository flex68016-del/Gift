"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EnvelopeScene } from "@/components/marketing/EnvelopeScene";
import { Footer } from "@/components/marketing/Footer";
import { Header } from "@/components/marketing/Header";
import { MotionControls } from "@/components/marketing/MotionControls";
import { ScrollStory } from "@/components/marketing/ScrollStory";
import { ThemesStrip } from "@/components/marketing/ThemesStrip";
import { BlocksList } from "@/components/marketing/BlocksList";
import { OccasionsTicker } from "@/components/marketing/OccasionsTicker";
import { DiasporaPath } from "@/components/marketing/DiasporaPath";
import { PriceBlock } from "@/components/marketing/PriceBlock";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";

export default function HomePageClient() {
  const t = useTranslations("landing");
  const router = useRouter();
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .trim()
      .slice(0, 24)
      .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
    setName(value);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
      <Header />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "var(--color-ink)" }}>
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: "var(--color-ink-soft)" }}>
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push("/create")}
                  className="px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "var(--color-red)",
                    color: "white",
                  }}
                >
                  {t("hero.cta")}
                </button>
                <button
                  onClick={() => document.getElementById("how-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-4 rounded-lg text-lg font-medium border-2 hover:opacity-90 transition-opacity"
                  style={{
                    borderColor: "var(--color-line)",
                    color: "var(--color-ink)",
                  }}
                >
                  {t("hero.secondary")}
                </button>
              </div>
              <div className="mt-4 inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink-soft)" }}>
                {t("hero.badge")}
              </div>
            </div>

            {/* Envelope Scene */}
            <div className="py-12">
              <div className="mb-8 text-center">
                <label htmlFor="name-input" className="block text-sm mb-2" style={{ color: "var(--color-ink-soft)" }}>
                  {t("hero.nameLabel")}
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder={t("hero.namePlaceholder")}
                  maxLength={24}
                  className="w-full max-w-xs px-4 py-2 rounded-lg border-2 text-center"
                  style={{
                    borderColor: "var(--color-line)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-ink)",
                  }}
                />
              </div>
              <EnvelopeScene name={name} />
            </div>
          </div>
        </section>

        {/* How it works */}
        <ScrollStory />

        {/* Themes */}
        <ThemesStrip />

        {/* Content blocks */}
        <BlocksList />

        {/* Occasions ticker */}
        <OccasionsTicker />

        {/* Diaspora */}
        <DiasporaPath />

        {/* Price */}
        <PriceBlock />

        {/* FAQ */}
        <Faq />

        {/* Final CTA */}
        <FinalCta />
      </main>

      <Footer />
      <MotionControls />
    </div>
  );
}
