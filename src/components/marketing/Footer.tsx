import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("nav");

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg)] py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
            © {new Date().getFullYear()} Moment
          </div>

          <div className="flex gap-6 text-sm">
            <Link
              href="/legal/privacy"
              className="hover:opacity-80"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Confidentialité
            </Link>
            <Link
              href="/legal/terms"
              className="hover:opacity-80"
              style={{ color: "var(--color-ink-soft)" }}
            >
              CGV
            </Link>
            <Link
              href="/legal/notice"
              className="hover:opacity-80"
              style={{ color: "var(--color-ink-soft)" }}
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
