import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

export default defineConfig({
  testDir: ".",
  testMatch: "support-layout.spec.ts",
  workers: 1,
  retries: 0,
  outputDir: "../../test-results/support-chat-harness",
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:5179",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "./node_modules/.bin/vite --config e2e/support-chat-harness/vite.config.mts",
      cwd: resolve(__dirname, "../.."),
      url: "http://127.0.0.1:5179",
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
