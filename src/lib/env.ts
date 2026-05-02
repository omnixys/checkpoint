const warned = new Set<string>();

function warn(key: string, fallback: string) {
  if (warned.has(key)) return;

  if (process.env.NODE_ENV !== "production") {
    console.warn(`[ENV] Missing "${key}" → using fallback: ${fallback}`);
    warned.add(key);
  }
}

function getClientEnv(key: string, fallback: string): string {
  // 🔥 WICHTIG: statischer Zugriff → Next kann bundlen
  const value =
    key === "NEXT_PUBLIC_BACKEND_SERVER_URL"
      ? process.env.NEXT_PUBLIC_BACKEND_SERVER_URL
      : key === "NEXT_PUBLIC_BACKEND_WS_URL"
        ? process.env.NEXT_PUBLIC_GRAPHQL_WS_URL
        : key === "NEXT_PUBLIC_CHECKPOINT_BASE_PATH"
          ? process.env.NEXT_PUBLIC_CHECKPOINT_BASE_PATH
          : key === "NEXT_PUBLIC_EVENT_ID"
            ? process.env.NEXT_PUBLIC_EVENT_ID
            : key === "NEXT_PUBLIC_BASE_URL"
              ? process.env.NEXT_PUBLIC_BASE_URL
              : key === "NEXT_PUBLIC_INVITATION_API"
                ? process.env.NEXT_PUBLIC_INVITATION_API
                : key === "NEXT_PUBLIC_EVENT_API"
                  ? process.env.NEXT_PUBLIC_EVENT_API
                  : key === "NEXT_PUBLIC_APP_URL"
                    ? process.env.NEXT_PUBLIC_APP_URL
                    : key === "NEXYS_HOME_LINK"
                      ? process.env.NEXYS_HOME_LINK
                      : undefined;

  if (!value) {
    warn(key, fallback);
    return fallback;
  }

  return value;
}

export const env = {
  BACKEND_SERVER_URL: getClientEnv(
    "NEXT_PUBLIC_BACKEND_SERVER_URL",
    "http://localhost:8000/graphql",
  ),

  BACKEND_WS_URL: getClientEnv(
    "NEXT_PUBLIC_GRAPHQL_WS_URL",
    "http://localhost:8000/ws",
  ),

  CHECKPOINT_BASE_PATH: getClientEnv("NEXT_PUBLIC_CHECKPOINT_BASE_PATH", "/"),

  EVENT_ID: getClientEnv("NEXT_PUBLIC_EVENT_ID", ""),

  BASE_URL: getClientEnv("NEXT_PUBLIC_BASE_URL", "localhost:3000"),

  INVITATION_API: getClientEnv(
    "NEXT_PUBLIC_INVITATION_API",
    "http://localhost:7407/invitation",
  ),

  EVENT_API: getClientEnv(
    "NEXT_PUBLIC_EVENT_API",
    "http://localhost:7406/media",
  ),

  APP_URL: getClientEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),

  NEXYS_HOME_LINK: getClientEnv("NEXYS_HOME_LINK", "https://nexys.omnixys.com"),
} as const;

/**
 * Debug output (runtime safe)
 */
if (process.env.NODE_ENV !== "production") {
  console.debug("================= ENV (LAZY) =================");
  console.debug({
    NODE: process.env.NODE_ENV,
    BACKEND_SERVER_URL: env.BACKEND_SERVER_URL,
    BACKEND_WS_URL: env.BACKEND_WS_URL,
    CHECKPOINT_BASE_PATH: env.CHECKPOINT_BASE_PATH,
    PUBLIC_EVENT_ID: env.EVENT_ID,
    PUBLIC_BASE_URL: env.BASE_URL,
    PUBLIC_INVITATION_API: env.INVITATION_API,
    PUBLIC_EVENT_API: env.EVENT_API,
    PUBLIC_APP_URL: env.APP_URL,
  });
  console.debug("==============================================");
}
