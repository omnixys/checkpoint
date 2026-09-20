import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { e2eEnv } from "../tooling/e2e-env";

const appUrl = "http://localhost:3000";
const eventId = process.env.NEXT_PUBLIC_EVENT_ID?.trim();
const staffUsername = process.env.WHATSAPP_SUPPORT_USERNAME?.trim() || "caleb";

const conversationRowSelector = "[data-testid='communication-conversation-row']";
const composerSelector = "[name='communication-draft']";

async function authenticate(context: BrowserContext, page: Page) {
  if (!eventId) throw new Error("Missing NEXT_PUBLIC_EVENT_ID for communication workspace E2E");

  await context.addInitScript((selectedEventId) => {
    window.localStorage.setItem("checkpoint.activeEventId", selectedEventId);
    window.localStorage.setItem("checkpoint.onboardingDone", "done");
  }, eventId);

  await page.goto(`${appUrl}/login`);
  await page.locator('input[name="username"]').fill(staffUsername);
  await page.locator('input[name="password"]').fill(e2eEnv.USER_PASSWORD);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText("Profile", { exact: true })).toBeVisible();
}

async function dismissOverlays(page: Page) {
  const closeOnboarding = page.getByRole("button", { name: /close|schließen/i });
  if (await closeOnboarding.isVisible()) await closeOnboarding.click();
  const declineAnalytics = page.getByRole("button", { name: /decline|ablehnen/i });
  if (await declineAnalytics.isVisible()) await declineAnalytics.click();
}

test("support inbox opens a deep-linked conversation and returns to the inbox", async ({
  context,
  page,
}) => {
  await authenticate(context, page);
  await page.goto(`${appUrl}/event/${eventId}/support`);
  await dismissOverlays(page);

  await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();

  const rows = page.locator(conversationRowSelector);
  await expect(rows.first()).toBeVisible();

  await rows.first().click();

  await expect(page).toHaveURL(new RegExp(`/event/${eventId}/support/[^/]+$`));
  await expect(page.locator(composerSelector)).toBeVisible();

  await page.getByRole("button", { name: /back|zurück/i }).click();
  await expect(page).toHaveURL(`${appUrl}/event/${eventId}/support`);
  await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();
});

test("support workspace stays free of horizontal overflow across viewports", async ({
  context,
  page,
}, testInfo) => {
  await authenticate(context, page);
  await page.goto(`${appUrl}/event/${eventId}/support`);
  await dismissOverlays(page);
  await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();

  for (const width of [360, 390, 430, 768, 820, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath("support-workspace.png"), fullPage: true });
});

test("messages workspace exposes audience filters and the details drawer on tablet", async ({
  context,
  page,
}) => {
  await authenticate(context, page);
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto(`${appUrl}/event/${eventId}/notification`);
  await dismissOverlays(page);

  await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Role", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Broadcast", exact: true })).toBeVisible();

  const rows = page.locator(conversationRowSelector);
  await expect(rows.first()).toBeVisible();
  await rows.first().click();

  await expect(page).toHaveURL(new RegExp(`/event/${eventId}/notification/[^/]+$`));
  await page.getByRole("button", { name: "Details" }).click();
  await expect(page.getByRole("button", { name: "Close details" })).toBeVisible();
});