import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gift.com";
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  if (!allowIndexing) {
    return [];
  }

  return routing.locales.map((locale) => ({
    url: `${appUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));
}
