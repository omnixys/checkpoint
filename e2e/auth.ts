import type { Page } from "@playwright/test";
import { SEAT_MAP_URL, BACKEND_URL, TEST_USER } from "./config";

/**
 * Attempts to login via the GraphQL API (inside the browser).
 * Falls back to UI login if the API approach fails.
 * Returns true if login succeeded.
 */
export async function loginAndGoToSeatMap(page: Page): Promise<boolean> {
  await page.goto("/login", { waitUntil: "networkidle", timeout: 30_000 });

  // Dismiss onboarding if present
  await dismissOverlay(page);

  // Try API login from inside the browser (so cookies land in the jar)
  const apiOk = await page.evaluate(
    async ({ url, username, password }) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationName: "Login",
            query: `mutation Login($input: LogInInput!) {
              credentialsLogin(input: $input) {
                accessToken
                expiresIn
                refreshToken
              }
            }`,
            variables: { input: { username, password } },
          }),
        });
        const json = await res.json();
        return !json.errors && json.data?.credentialsLogin?.accessToken;
      } catch {
        return false;
      }
    },
    { url: BACKEND_URL, username: TEST_USER.username, password: TEST_USER.password },
  );

  if (!apiOk) {
    // Fallback: UI login
    await page.getByLabel("Username").fill(TEST_USER.username);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByRole("button", { name: "Login" }).click({ force: true });
    await page.waitForTimeout(3_000);
  }

  await dismissOverlay(page);
  await page.goto(SEAT_MAP_URL, { waitUntil: "networkidle", timeout: 20_000 }).catch(() => {});

  // Check if we're on the seat map (login succeeded) or still on login
  return !page.url().includes("/login");
}

async function dismissOverlay(page: Page): Promise<void> {
  for (let i = 0; i < 10; i++) {
    const visible = await page.getByText("Willkommen zu Checkpoint").isVisible().catch(() => false);
    if (!visible) return;
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }
}
