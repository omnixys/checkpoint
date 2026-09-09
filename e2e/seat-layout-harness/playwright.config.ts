import { defineConfig, devices } from "@playwright/test";
import { resolve } from "node:path";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  workers: 1,
  retries: 0,
  outputDir: "../../test-results/seat-layout-harness",
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:5178",
    viewport: { width: 1200, height: 850 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "./node_modules/.bin/vite --config e2e/seat-layout-harness/vite.config.mts",
    cwd: resolve(__dirname, "../.."),
    url: "http://127.0.0.1:5178",
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
