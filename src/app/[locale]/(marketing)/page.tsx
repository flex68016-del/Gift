import { getTranslations } from "next-intl/server";
import HomePageClient from "./HomePageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  const title = t("hero.title");
  const description = t("hero.subtitle");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
    openGraph: {
      title,
      description,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });

  // JSON-LD pour FAQ
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("faq.q1.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q1.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q2.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q2.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q3.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q3.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q4.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q4.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q5.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q5.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.q6.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.q6.answer"),
        },
      },
    ],
  };

  // JSON-LD pour Organization
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_APP_NAME || "Moment",
    url: process.env.NEXT_PUBLIC_APP_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePageClient />
    </>
  );
}
