"use client";

import { useTranslations } from "next-intl";
import { useEffect,useState } from "react";

import { Turnstile } from "@/components/turnstile/Turnstile";
import { useGiftExperience } from "@/features/gift/useGiftExperience";
import { useTier } from "@/motion/perf/useTier";
import { themeRegistry } from "@/motion/themes/definitions";

interface GiftClientProps {
  slug: string;
  locale: string;
}

export function GiftClient({ slug, locale }: GiftClientProps) {
  const t = useTranslations("gift");
  const {
    state,
    data,
    error,
    currentBlockIndex,
    unlock,
    loadContent,
    completeIntro,
    nextBlock,
    completeFinale,
    report,
  } = useGiftExperience(slug);

  const [secret, setSecret] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { tier } = useTier();

  // Charger le contenu au montage
  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Enregistrer l'événement "opened" au début de l'intro
  useEffect(() => {
    if (state === "intro") {
      fetch(`/api/g/${slug}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "opened" }),
      }).catch(console.error);
    }
  }, [state, slug]);

  // Enregistrer l'événement "completed" à la fin
  useEffect(() => {
    if (state === "ended") {
      fetch(`/api/g/${slug}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "completed" }),
      }).catch(console.error);
    }
  }, [state, slug]);

  if (state === "locked") {
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

  if (error === "scheduled") {
    // Étalement aléatoire 0-3s avant de demander le contenu
    const [delayed, setDelayed] = useState(false);

    useEffect(() => {
      const delay = Math.random() * 3000;
      const timer = setTimeout(() => {
        setDelayed(true);
        loadContent();
      }, delay);
      return () => clearTimeout(timer);
    }, [loadContent]);

    if (!delayed) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">{t("countdown", { date: "..." })}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t("notPublished")}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  if (error === "not_published" || error === "not_found") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">{t("notFound")}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t("notPublished")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (state === "ready" && data?.openSettings.type === "secret") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-center">{t("locked")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              {t("enterSecret")}
            </p>
            {data.openSettings.hint && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                {t("hint", { hint: data.openSettings.hint })}
              </p>
            )}
            <div className="space-y-4">
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={t("secret")}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={() => unlock(secret)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t("unlock")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state === "intro" && data) {
    // Récupérer le thème depuis le registre
    const theme = themeRegistry.get(data.themeKey);
    const OpeningScene = theme?.OpeningScene;

    if (OpeningScene) {
      return (
        <div className="min-h-screen">
          <OpeningScene
            onOpen={completeIntro}
            onSkip={completeIntro}
            tier={tier}
          />
        </div>
      );
    }

    // Fallback si pas de scène
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Intro Scene</h1>
            <p>Theme: {data.themeKey}</p>
            <button
              onClick={completeIntro}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "blocks" && data) {
    const currentBlock = data.blocks[currentBlockIndex];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-sm text-gray-500 mb-4">
              Block {currentBlockIndex + 1} / {data.blocks.length}
            </p>
            <div className="mb-6">
              <p className="text-lg">Block type: {currentBlock?.type}</p>
            </div>
            <button
              onClick={nextBlock}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "finale") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Finale</h1>
            <button
              onClick={completeFinale}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "ended") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Merci !</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ce cadeau a été créé avec Moment
            </p>
            <button
              onClick={() => report("...")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              {t("report")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
