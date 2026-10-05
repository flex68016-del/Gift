import { test, expect } from "@playwright/test";

test.describe("Security Headers", () => {
  test("/fr/g/test a les headers de route privée", async ({ request }) => {
    const response = await request.get("/fr/g/test");

    expect(response.headers()["cache-control"]).toContain("no-store");
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
    expect(response.headers()["referrer-policy"]).toBe("no-referrer");
  });

  test("/fr n'a pas X-Powered-By et a CSP report-only avec nonce", async ({ request }) => {
    const response = await request.get("/fr");

    expect(response.headers()["x-powered-by"]).toBeUndefined();
    const csp = response.headers()["content-security-policy-report-only"];
    expect(csp).toBeDefined();
    expect(csp).toContain("nonce-");
  });

  test("/api/csp-report en GET répond 405 avec Cache-Control no-store", async ({ request }) => {
    const response = await request.get("/api/csp-report");

    expect(response.status()).toBe(405);
    expect(response.headers()["cache-control"]).toContain("no-store");
  });
});
