import { chromium } from "@playwright/test";
import { AUTH_STORAGE_FILE, TEST_USER } from "./config";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("/login", { waitUntil: "networkidle", timeout: 30_000 });
    await page.getByLabel("Username").fill(TEST_USER.username);
    await page.getByLabel("Password").fill(TEST_USER.password);
    await page.getByLabel("Password").press("Enter");

    await page.waitForURL(/dashboard|\/event|\/|base/, { timeout: 15_000 });

    // Dismiss onboarding
    const onboarding = page.getByText("Willkommen zu Checkpoint");
    if (await onboarding.isVisible().catch(() => false)) {
      const weiterBtn = page.getByRole("button", { name: "Weiter" });
      for (let i = 0; i < 5; i++) {
        if (!(await weiterBtn.isVisible().catch(() => false))) break;
        await weiterBtn.click();
        await page.waitForTimeout(300);
      }
    }

    await page.context().storageState({ path: AUTH_STORAGE_FILE });
    console.log("[global-setup] Auth state saved");
  } catch (err) {
    console.warn("[global-setup] Login failed, continuing without auth:", err);
  }

  await browser.close();
}

export default globalSetup;
