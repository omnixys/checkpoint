import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
import { env } from "@/checkpoint/config/env";
import { toolingEnv } from "./tooling/env";

const EVENT_ID = env.EVENT_ID;
const BASE_URL = env.APP_URL;
const BACKEND_URL = env.BACKEND_SERVER_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: toolingEnv.CI,
  retries: toolingEnv.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "tablet",
      use: { ...devices["iPad Pro 11"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !toolingEnv.CI,
    timeout: 120_000,
  },
});
