"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const createGiftSchema = z.object({
  themeKey: z.string().min(1),
  locale: z.enum(["fr", "en"]),
  senderName: z.string().min(1).max(100),
});

type CreateGiftForm = z.infer<typeof createGiftSchema>;

export default function CreateGiftPage() {
  const t = useTranslations("create");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGiftForm>({
    resolver: zodResolver(createGiftSchema),
    defaultValues: {
      locale: "fr",
    },
  });

  const onSubmit = async (data: CreateGiftForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create gift");
      }

      const result = await response.json();
      // Stocker le token d'édition temporairement (localStorage ou sessionStorage)
      sessionStorage.setItem("editToken", result.editToken);
      router.push(`/${data.locale}/create/${result.giftId}`);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("senderName")}
            </label>
            <input
              id="senderName"
              type="text"
              {...register("senderName")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder={t("senderNamePlaceholder")}
            />
            {errors.senderName && <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>}
          </div>

          <div>
            <label htmlFor="locale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("language")}
            </label>
            <select
              id="locale"
              {...register("locale")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
            {errors.locale && <p className="mt-1 text-sm text-red-600">{errors.locale.message}</p>}
          </div>

          <div>
            <label htmlFor="themeKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("theme")}
            </label>
            <select
              id="themeKey"
              {...register("themeKey")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="birthday">Anniversaire</option>
              <option value="love">Amour</option>
              <option value="thank-you">Remerciements</option>
              <option value="celebration">Célébration</option>
            </select>
            {errors.themeKey && <p className="mt-1 text-sm text-red-600">{errors.themeKey.message}</p>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t("creating") : t("create")}
          </button>
        </form>
      </div>
    </div>
  );
}
