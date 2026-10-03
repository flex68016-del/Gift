import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("landing.hero");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-xl">{t("subtitle")}</p>
      <button className="mt-8 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
        {t("cta")}
      </button>
    </div>
  );
}
