import "dotenv/config";

function required(key: string, value: string | undefined): string {
  if (!value?.trim()) throw new Error(`[ENV] Missing required tooling environment variable: ${key}`);
  return value.trim();
}

function boolean(value: string | undefined): boolean {
  if (!value) return false;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error('[ENV] CI must be "true", "false", "1", or "0"');
}

export const toolingEnv = {
  CI: boolean(process.env.CI),
  BACKEND_SERVER_URL: required(
    "NEXT_PUBLIC_BACKEND_SERVER_URL",
    process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
  ),
} as const;
