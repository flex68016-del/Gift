import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

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

export default async function GiftPage({ params }: PageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "gift" });

  // TODO: Fetch gift data from database
  // Pour l'instant, renvoie une coque vide
  // Si le cadeau n'existe pas, n'est pas publié, est en brouillon, expiré ou supprimé :
  // renvoyer la même page neutre (anti-énumération)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("loading")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("loadingGift")}</p>
        </div>
      </div>
    </div>
  );
}
