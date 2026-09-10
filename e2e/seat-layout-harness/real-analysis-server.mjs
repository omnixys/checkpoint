/**
 * Isolated test adapter, never mounted in the product. Binds only 127.0.0.1.
 * Runs the real multipart/preprocessor/worker/recognizer service with no database.
 * Authentication is deliberately outside this component fixture; production REST
 * authorization is covered by the Seat service's controller integration tests.
 */
import { createRequire } from "node:module";
import { LayoutImportService } from "../../../../services/seat/dist/layout-import/layout-import.service.js";
import { recognitionFixturePng } from "./recognition-fixture.mjs";

const requireSeat = createRequire(
  new URL("../../../../services/seat/package.json", import.meta.url),
);
const fastify = requireSeat("fastify");
const multipart = requireSeat("@fastify/multipart");
const app = fastify({ logger: false });
await app.register(multipart);
const imports = new LayoutImportService({ log: () => ({ info() {}, warn() {} }) });
const allowedOrigins = new Set(["http://127.0.0.1:5178", "http://localhost:5178"]);
let analyses = 0;

app.addHook("onRequest", async (request, reply) => {
  const origin = request.headers.origin;
  if (origin && !allowedOrigins.has(origin))
    return reply.code(403).send({ message: "Local fixture origin required." });
  if (origin) {
    reply.header("Access-Control-Allow-Origin", origin);
    reply.header("Access-Control-Allow-Credentials", "true");
    reply.header("Vary", "Origin");
  }
  reply.header("Cache-Control", "no-store");
});
app.options("/layout-import/:eventId/analyze", async (_request, reply) =>
  reply
    .header("Access-Control-Allow-Methods", "POST, OPTIONS")
    .header("Access-Control-Allow-Headers", "content-type")
    .code(204)
    .send(),
);
app.get("/health", async () => ({ fixture: "real-layout-analysis", analyses }));
app.get("/fixture/three-tables.png", async (_request, reply) =>
  reply.type("image/png").send(await recognitionFixturePng()),
);
app.post("/layout-import/:eventId/analyze", async (request, reply) => {
  const cancellation = new AbortController();
  const abort = () => cancellation.abort();
  const close = () => {
    if (!reply.raw.writableEnded) abort();
  };
  request.raw.once("aborted", abort);
  reply.raw.once("close", close);
  analyses++;
  try {
    return await imports.analyze(request, request.params.eventId, cancellation.signal);
  } finally {
    request.raw.removeListener("aborted", abort);
    reply.raw.removeListener("close", close);
  }
});
app.setErrorHandler((error, _request, reply) => {
  if (typeof error.getStatus === "function" && typeof error.getResponse === "function") {
    return reply.code(error.getStatus()).send(error.getResponse());
  }
  return reply.code(500).send({ code: "FIXTURE_ERROR", message: "Analysis fixture failed." });
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    void app.close();
  });
await app.listen({ port: 5191, host: "127.0.0.1" });
