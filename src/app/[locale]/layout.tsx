import "../globals.css";
import "../../styles/design-tokens.css";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";
import { fraunces, instrumentSans, inter, playfair } from "@/lib/fonts";
import { MotionProvider } from "@/motion/MotionProvider";

const locales = ["fr", "en"] as const;

export const metadata: Metadata = {
  title: "Moment - Un cadeau qui se vit",
  description: "Créez des cadeaux numériques interactifs pour vos proches",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${fraunces.variable} ${instrumentSans.variable} ${inter.variable} ${playfair.variable}`}>
      <body>
        <MotionProvider>
          <a
            href="#main-content"
            className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 focus:outline-none px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-line)] rounded-br text-sm font-medium transition-transform"
          >
            Aller au contenu
          </a>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
