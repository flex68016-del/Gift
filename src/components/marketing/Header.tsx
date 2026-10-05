import Link from "next/link";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold" style={{ color: "var(--color-red)" }}>
          {t("home")}
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/fr"
            className="text-sm hover:opacity-80"
            style={{ color: "var(--color-ink)" }}
          >
            FR
          </Link>
          <Link
            href="/en"
            className="text-sm hover:opacity-80"
            style={{ color: "var(--color-ink)" }}
          >
            EN
          </Link>
          <Link
            href="/create"
            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            style={{
              backgroundColor: "var(--color-red)",
              color: "white",
            }}
          >
            {t("create")}
          </Link>
        </div>
      </div>
    </header>
  );
}
