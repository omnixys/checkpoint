import { config } from "dotenv";

config({ path: "../../services/gateway/.env", override: false, quiet: true });

function required(key: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`[ENV] Missing required E2E environment variable: ${key}`);
  return value.trim();
}

export const e2eEnv = {
  KC_URL: required("KC_URL", process.env.KC_URL),
  KC_REALM: required("KC_REALM", process.env.KC_REALM),
  KC_CLIENT_ID: required("KC_CLIENT_ID", process.env.KC_CLIENT_ID),
  KC_CLIENT_SECRET: required("KC_CLIENT_SECRET", process.env.KC_CLIENT_SECRET),
  USER_PASSWORD: required("OMNIXYS_USER_PASSWORD", process.env.OMNIXYS_USER_PASSWORD),
  USER_USERNAME: required("PLAYWRIGHT_USER_USERNAME", process.env.PLAYWRIGHT_USER_USERNAME),
} as const;
