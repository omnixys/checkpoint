import { expect, test, type Page } from "@playwright/test";

// Infra-independent UI smoke baseline: only exercises public routes that render
// without backend/auth, so design-workflow agents can run a browser sanity check
// without the full seed + backend stack. Kept on chromium only (single engine,
// consistent with the design-validation setup).
test.skip(({ browserName }) => browserName !== "chromium");

// Public routes compile on demand in the dev server; give interactive public
// routes a comfortable budget so a cold on-demand compile cannot time out.
test.setTimeout(90_000);

const ONBOARDING_STORAGE_KEY = "checkpoint.onboardingDone";

function collectRuntimeErrors(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: Error[] = [];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Expected environment noise: 404 navigation resource errors and
    // navigator.vibrate is blocked by Chromium without a user gesture.
    if (msg.text().includes("Failed to load resource")) return;
    if (msg.text().includes("navigator.vibrate")) return;
    consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err));

  return { consoleErrors, pageErrors };
}

/**
 * Loads a public route the way a returning guest would see it: onboarding is
 * already completed and the analytics consent banner is dismissed. Both are
 * client-side-only overlays that otherwise cover interactive content on fresh
 * contexts and make the smoke assertions flaky without any backend.
 */
async function prepareInteractiveRoute(page: Page, path: string) {
  await page.addInitScript((storageKey) => {
    try {
      window.localStorage.setItem(storageKey, "done");
    } catch {
      // Ignore storage failures in sandboxed contexts.
    }
  }, ONBOARDING_STORAGE_KEY);

  await page.goto(path, { waitUntil: "domcontentloaded" });

  const consentBanner = page.locator("aside[aria-label]");
  if ((await consentBanner.count()) > 0) {
    await consentBanner.locator("button").first().click();
    await expect(consentBanner).toHaveCount(0);
  }
}

test("public home renders without runtime errors", async ({ page }) => {
  const { consoleErrors, pageErrors } = collectRuntimeErrors(page);

  await page.goto("/");
  await expect(page.getByRole("heading")).toBeVisible();

  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);
});

test("unknown route renders the 404 boundary without runtime errors", async ({ page }) => {
  const { consoleErrors, pageErrors } = collectRuntimeErrors(page);

  await page.goto("/definitely-not-a-route");
  await expect(page.locator("body")).toContainText(/not be found|not found|404/i);

  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);
});

test("login exposes the guest magic-link mode without runtime errors", async ({ page }) => {
  const { consoleErrors, pageErrors } = collectRuntimeErrors(page);

  await prepareInteractiveRoute(page, "/login");
  await page.getByRole("button", { name: /Gast.*Magic Link|guest.*magic link/i }).click();

  await expect(page.locator('input[name="guestIdentifier"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toHaveCount(0);
  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);
});

test("magic-link route shows one generic verification error", async ({ page }) => {
  const { consoleErrors, pageErrors } = collectRuntimeErrors(page);

  await prepareInteractiveRoute(page, "/magic");

  // The magic route without a valid token renders a single error alert. The
  // MUI alert is asserted via its class because the app shell's transition
  // wrapper can keep the element out of the accessibility tree.
  await expect(page.locator('[class*="MuiAlert"]').first()).toBeVisible();
  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);
});
