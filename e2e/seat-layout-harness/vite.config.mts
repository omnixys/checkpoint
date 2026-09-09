import { fileURLToPath } from "node:url";

export default {
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
