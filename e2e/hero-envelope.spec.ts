import { expect,test } from "@playwright/test";

test.describe("Hero Envelope", () => {
  test("l'enveloppe s'ouvre à la touche Entrée", async ({ page }) => {
    await page.goto("/fr");

    // Attendre que l'enveloppe soit visible
    await page.waitForSelector('[role="button"]');

    // Cliquer sur l'enveloppe via le clavier
    await page.keyboard.press("Enter");

    // Attendre que la lettre soit visible
    await page.waitForSelector("h2");

    // Vérifier que le prénom est dans la lettre
    const letterTitle = await page.locator("h2").textContent();
    expect(letterTitle).toContain("toi");
  });

  test("la lettre contient le prénom saisi", async ({ page }) => {
    await page.goto("/fr");

    // Saisir un prénom
    await page.fill("#name-input", "Marie");
    await page.keyboard.press("Enter");

    // Attendre que la lettre soit visible
    await page.waitForSelector("h2");

    // Vérifier que le prénom est dans la lettre
    const letterTitle = await page.locator("h2").textContent();
    expect(letterTitle).toContain("Marie");
  });

  test("avec reducedMotion, aucun canvas de confetti et la lettre est visible", async ({
    page,
  }) => {
    await page.goto("/fr");
    await page.emulateMedia({ reducedMotion: "reduce" });

    // Cliquer sur l'enveloppe
    await page.click('[role="button"]');

    // Attendre que la lettre soit visible
    await page.waitForSelector("h2");

    // Vérifier qu'il n'y a pas de canvas confetti
    const confettiCanvas = page.locator("canvas").count();
    expect(confettiCanvas).toBe(0);

    // Vérifier que la lettre est visible
    const letterTitle = await page.locator("h2").textContent();
    expect(letterTitle).toBeTruthy();
  });
});
