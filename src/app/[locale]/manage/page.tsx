import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

import { ManageDashboard } from "./ManageDashboard";
import { verifyCookie } from "@/lib/security/cookie";
import { db } from "@/lib/db/client";

interface PageProps {
  params: {
    locale: string;
  };
  searchParams: {
    error?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "manage" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export const dynamic = "force-dynamic";

export default async function ManagePage({ params, searchParams }: PageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "manage" });

  // Vérifier le cookie de session
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__Host-manage-session");
  if (!sessionCookie) {
    redirect(`/${params.locale}/manage?error=unauthorized`);
  }

  const giftId = await verifyCookie(sessionCookie.value);
  if (!giftId) {
    redirect(`/${params.locale}/manage?error=unauthorized`);
  }

  // Récupérer les données du cadeau
  const gift = await db`
    SELECT id, slug, title, recipient_name, status, first_opened_at, open_count, created_at, expires_at, deleted_at
    FROM gifts
    WHERE id = ${giftId}
  `;

  if (!gift || gift.length === 0) {
    redirect(`/${params.locale}/manage?error=not_found`);
  }

  const giftData = gift[0] as {
    id: string;
    slug: string;
    title: string | null;
    recipient_name: string;
    status: string;
    first_opened_at: Date | null;
    open_count: number;
    created_at: Date;
    expires_at: Date | null;
    deleted_at: Date | null;
  };
  if (!giftData) {
    redirect(`/${params.locale}/manage?error=not_found`);
  }

  // Vérifier que le cadeau n'est pas supprimé
  if (giftData.deleted_at) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">{t("deleted")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("deletedMessage")}</p>
            <a
              href={`/${params.locale}`}
              className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {t("backToHome")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Vérifier que le cadeau est publié
  if (giftData.status !== "published") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">{t("notPublished")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("notPublishedMessage")}</p>
            <a
              href={`/${params.locale}/create/${giftId}`}
              className="inline-block bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {t("continueEditing")}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const giftUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${params.locale}/g/${giftData.slug}`;

  return (
    <ManageDashboard
      locale={params.locale}
      gift={giftData}
      giftUrl={giftUrl}
      translations={{
        title: t("title"),
        description: t("description"),
        status: t("status"),
        firstOpened: t("firstOpened"),
        openCount: t("openCount"),
        createdAt: t("createdAt"),
        expiresAt: t("expiresAt"),
        editButton: t("editButton"),
        copyLink: t("copyLink"),
        downloadQR: t("downloadQR"),
        deleteButton: t("deleteButton"),
        deleteConfirm: t("deleteConfirm"),
        cancel: t("cancel"),
        backToHome: t("backToHome"),
      }}
    />
  );
}
