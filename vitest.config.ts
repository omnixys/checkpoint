import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@/checkpoint": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./src/test/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    env: {
      NEXT_PUBLIC_BACKEND_SERVER_URL: "http://localhost:8000/graphql",
      NEXT_PUBLIC_GRAPHQL_WS_URL: "ws://localhost:8000/ws",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_INVITATION_API: "http://localhost:7407/invitation",
      NEXT_PUBLIC_EVENT_API: "http://localhost:7406/media",
      NEXT_PUBLIC_NEXYS_HOME_URL: "http://localhost:3000/nexys",
      ANALYTICS_CONSENT_SECRET: "checkpoint-test-consent-secret-not-production",
    },
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    clearMocks: true,
  },
});
