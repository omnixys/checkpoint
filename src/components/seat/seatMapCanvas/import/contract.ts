import { z } from "zod";

const finite = z.number().finite();
const geometry = z.object({
  x: finite.min(0).max(1),
  y: finite.min(0).max(1),
  width: finite.positive().max(1),
  height: finite.positive().max(1),
  rotation: finite,
});
const quality = finite.min(0).max(1);
export const recognitionSchema = z
  .object({
    recognizer: z.literal("geometry-v1"),
    elements: z
      .array(
        z.object({
          id: z.string().min(1).max(100),
          kind: z.enum(["SECTION", "TABLE", "SEAT", "STAGE", "AISLE", "LABEL", "UNKNOWN"]),
          geometry,
          sourceBounds: geometry,
          shape: z.enum(["ROUND", "RECTANGLE", "OVAL", "CIRCLE"]).optional(),
          parentCandidateId: z.string().optional(),
          seatCount: z.number().int().min(0).max(10000).optional(),
          needsReview: z.boolean(),
          confidence: z
            .object({
              geometry: quality.optional(),
              classification: quality.optional(),
              relationship: quality.optional(),
            })
            .optional(),
        }),
      )
      .max(10000),
    warnings: z.array(
      z.object({
        code: z.enum(["GEOMETRY_ONLY", "UNKNOWN_OBJECT", "AMBIGUOUS_PARENT", "NO_OBJECTS"]),
        message: z.string(),
        elementIds: z.array(z.string()).optional(),
      }),
    ),
    analysis: z.object({
      width: z.number().int().positive().max(1600),
      height: z.number().int().positive().max(1600),
      threshold: finite.min(0).max(255).nullable(),
    }),
  })
  .superRefine((result, ctx) => {
    const ids = new Set<string>();
    for (const item of result.elements) {
      if (ids.has(item.id)) ctx.addIssue({ code: "custom", message: "Doppelte Erkennungs-ID" });
      ids.add(item.id);
    }
    for (const item of result.elements)
      if (
        item.parentCandidateId &&
        (!ids.has(item.parentCandidateId) || item.parentCandidateId === item.id)
      )
        ctx.addIssue({ code: "custom", message: "Ungültige Parent-ID" });
  });
export type RecognitionResult = z.infer<typeof recognitionSchema>;
export type ImportKind = RecognitionResult["elements"][number]["kind"];
export interface DraftElement {
  id: string;
  kind: ImportKind;
  geometry: { x: number; y: number; width: number; height: number; rotation: number };
  shape: string;
  parentId: string | null;
  label: string;
  number: number | null;
  numberConfirmed: boolean;
  excluded: boolean;
  reviewed: boolean;
  needsReview: boolean;
  confidence?:
    | {
        geometry?: number | undefined;
        classification?: number | undefined;
        relationship?: number | undefined;
      }
    | undefined;
}
export interface LayoutImportDraft {
  schemaVersion: 1;
  source: {
    kind: "IMAGE" | "PDF" | "CAMERA";
    name: string;
    width: number;
    height: number;
    pageNumber?: number;
  };
  status: "REVIEW";
  elements: DraftElement[];
  warnings: RecognitionResult["warnings"];
  warningsConfirmed: boolean;
}
export function createImportDraft(
  result: RecognitionResult,
  source: LayoutImportDraft["source"],
): LayoutImportDraft {
  if (![source.width, source.height].every((n) => Number.isFinite(n) && n > 0))
    throw new Error("Ungültige Quellabmessungen.");
  return {
    schemaVersion: 1,
    source,
    status: "REVIEW",
    warnings: result.warnings,
    warningsConfirmed: false,
    elements: result.elements.map((e) => ({
      id: e.id,
      kind: e.kind,
      geometry: e.geometry,
      shape: e.shape ?? "",
      parentId: e.parentCandidateId ?? null,
      label: "",
      number: null,
      numberConfirmed: false,
      excluded: false,
      reviewed: false,
      needsReview: e.needsReview,
      confidence: e.confidence,
    })),
  };
}
