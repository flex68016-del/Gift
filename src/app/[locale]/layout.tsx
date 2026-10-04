import "../globals.css";
import "../../../styles/design-tokens.css";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { inter, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Moment - Un cadeau qui se vit",
  description: "Créez des cadeaux numériques interactifs pour vos proches",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
