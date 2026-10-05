import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gift.com";

  return {
    rules: {
      userAgent: "*",
      allow: allowIndexing ? ["/fr", "/en"] : [],
      disallow: allowIndexing ? ["/g/", "/manage/", "/c/", "/checkout/", "/admin/"] : ["/"],
    },
    sitemap: allowIndexing ? `${appUrl}/sitemap.xml` : undefined,
  };
}
