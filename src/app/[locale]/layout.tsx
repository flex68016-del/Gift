import "../globals.css";
import "../../styles/design-tokens.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { inter, playfair } from "@/lib/fonts";

const locales = ["fr", "en"] as const;

export const metadata: Metadata = {
  title: "Moment - Un cadeau qui se vit",
  description: "Créez des cadeaux numériques interactifs pour vos proches",
};

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

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
