import { describe, it, expect } from "vitest";
import { buildCsp, getSupabaseHost, isPrivatePath } from "./headers";

describe("getSupabaseHost", () => {
  it("retourne l'hôte depuis l'URL Supabase", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xyz.supabase.co";
    expect(getSupabaseHost()).toBe("xyz.supabase.co");
  });

  it("retourne *.supabase.co si l'URL est absente", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(getSupabaseHost()).toBe("*.supabase.co");
  });

  it("ne lève jamais d'exception avec une URL invalide", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-valid-url";
    expect(() => getSupabaseHost()).not.toThrow();
    expect(getSupabaseHost()).toBe("*.supabase.co");
  });
});

describe("isPrivatePath", () => {
  it("détecte /g/ comme privé", () => {
    expect(isPrivatePath("/fr/g/abc")).toBe(true);
    expect(isPrivatePath("/en/g/xyz")).toBe(true);
  });

  it("détecte /manage/ comme privé", () => {
    expect(isPrivatePath("/fr/manage/x")).toBe(true);
    expect(isPrivatePath("/en/manage/test")).toBe(true);
  });

  it("détecte /c/ comme privé", () => {
    expect(isPrivatePath("/fr/c/123")).toBe(true);
  });

  it("détecte /checkout/ comme privé", () => {
    expect(isPrivatePath("/fr/checkout/session")).toBe(true);
  });

  it("retourne false pour /fr sans préfixe", () => {
    expect(isPrivatePath("/fr")).toBe(false);
    expect(isPrivatePath("/en")).toBe(false);
  });

  it("ne confond pas /gallery avec /g/", () => {
    expect(isPrivatePath("/fr/gallery")).toBe(false);
    expect(isPrivatePath("/en/gallery/test")).toBe(false);
  });

  it("fonctionne sans préfixe de locale", () => {
    expect(isPrivatePath("/g/abc")).toBe(true);
    expect(isPrivatePath("/manage/x")).toBe(true);
  });
});

describe("buildCsp", () => {
  it("génère une CSP avec nonce", () => {
    const nonce = "test-nonce";
    const csp = buildCsp(nonce);
    expect(csp).toContain(`nonce-${nonce}`);
    expect(csp).toContain("report-uri /api/csp-report");
    expect(csp).not.toContain("upgrade-insecure-requests");
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
