import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { GiftClient } from "./GiftClient";

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "gift" });

  // TODO: Fetch gift data from database to get recipient name and theme
  // Pour l'instant, renvoie des métadonnées génériques
  return {
    title: t("ogTitle"),
    description: t("ogDescription"),
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/og-gift.png", // Image OG générique du thème
          width: 1200,
          height: 630,
          alt: t("ogTitle"),
        },
      ],
    },
  };
}

export default function GiftPage({ params }: PageProps) {
  return <GiftClient slug={params.slug} locale={params.locale} />;
}
