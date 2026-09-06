import { expect, test, type Page } from "@playwright/test";

// Infra-independent UI smoke baseline: only exercises public routes that render
// without backend/auth, so design-workflow agents can run a browser sanity check
// without the full seed + backend stack. Kept on chromium only (single engine,
// consistent with the design-validation setup).
test.skip(({ browserName }) => browserName !== "chromium");

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