"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const t = useTranslations("landing.hero");
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-xl text-gray-300 md:text-2xl">
          {t("subtitle")}
        </p>
        <button
          onClick={() => router.push("/create")}
          className="mt-10 rounded-lg border-2 border-white bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105"
        >
          {t("cta")}
        </button>
      </div>
    </div>
  );
}
