import { env } from "@/checkpoint/config/env";
import { type RecognitionResult, recognitionSchema } from "./contract";
import type { PreparedImportSource } from "./sources/ImportSourcePanel";

export async function analyzeLayoutSource(
  eventId: string,
  source: PreparedImportSource,
  signal: AbortSignal,
): Promise<RecognitionResult> {
  const body = new FormData();
  body.append("preparedImage", source.png, "prepared.png");
  body.append("originalSource", source.originalFile);
  const { kind, width, height, pageNumber } = source.metadata;
  body.append(
    "metadata",
    JSON.stringify({ kind, width, height, ...(pageNumber === undefined ? {} : { pageNumber }) }),
  );
  const response = await fetch(
    `${env.SEAT_API.replace(/\/$/, "")}/layout-import/${encodeURIComponent(eventId)}/analyze`,
    { method: "POST", body, credentials: "include", signal },
  );
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      result && typeof result === "object" && "message" in result
        ? String(result.message)
        : "Analyse fehlgeschlagen.";
    throw new Error(message);
  }
  const parsed = recognitionSchema.safeParse(result);
  if (!parsed.success)
    throw new Error("Die Analyse lieferte ein ungültiges Ergebnis. Bitte erneut versuchen.");
  return parsed.data;
}
