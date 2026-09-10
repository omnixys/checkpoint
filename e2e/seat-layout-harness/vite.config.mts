import { fileURLToPath } from "node:url";

export default {
  // Explicit fixture values only; never expose the developer's environment to the browser.
  define: {
    "process.env": JSON.stringify({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "http://127.0.0.1:5178",
      NEXT_PUBLIC_BACKEND_SERVER_URL: "http://127.0.0.1:5191/graphql",
      NEXT_PUBLIC_GRAPHQL_WS_URL: "ws://127.0.0.1:5191/ws",
      NEXT_PUBLIC_INVITATION_API: "http://127.0.0.1:5191/invitation",
      NEXT_PUBLIC_EVENT_API: "http://127.0.0.1:5191/media",
      NEXT_PUBLIC_SEAT_API: "http://127.0.0.1:5191",
      NEXT_PUBLIC_NEXYS_HOME_URL: "http://127.0.0.1:5178/nexys",
      NEXT_PUBLIC_EVENT_ID: "00000000-0000-4000-8000-000000000001",
    }),
  },
  root: fileURLToPath(new URL(".", import.meta.url)),
  resolve: { alias: { "@/checkpoint": fileURLToPath(new URL("../../src", import.meta.url)) } },
  server: {
    host: "127.0.0.1",
    port: 5178,
    strictPort: true,
    fs: { allow: [fileURLToPath(new URL("../..", import.meta.url))] },
  },
  esbuild: { jsx: "automatic" },
};
