import Link from "next/link";
import { useTranslations } from "next-intl";

export function ComingSoon() {
  const t = useTranslations("landing.soon");
  const env = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--color-ink)" }}>
          {t("title")}
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--color-ink-soft)" }}>
          {t("text")}
        </p>
        {env && (
          <a
            href={`https://wa.me/${env}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg font-medium hover:opacity-90"
            style={{
              backgroundColor: "#25D366",
              color: "white",
            }}
          >
            {t("whatsapp")}
          </a>
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm hover:opacity-80"
            style={{ color: "var(--color-ink-soft)" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
