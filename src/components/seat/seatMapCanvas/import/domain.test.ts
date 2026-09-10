import { describe, expect, it } from "vitest";
import type { LayoutDocument } from "../core/document";
import { moveNode } from "../core/document";
import {
  createImportDraft,
  type DraftElement,
  type LayoutImportDraft,
  recognitionSchema,
} from "./contract";
import {
  addDraftElement,
  draftDocument,
  draftIssues,
  importLayoutDraft,
  moveDraft,
  regenerateDraftSeats,
  sourceToWorld,
} from "./domain";
import { tablePerimeter } from "./table-perimeter";

const empty: LayoutDocument = { schemaVersion: 1, eventId: "event-a", nodes: {}, order: [] };
function element(
  id: string,
  kind: DraftElement["kind"],
  overrides: Partial<DraftElement> = {},
): DraftElement {
  return {
    id,
    kind,
    shape: kind === "SECTION" ? "RECTANGLE" : kind === "TABLE" ? "ROUND" : "CIRCLE",
    geometry: {
      x: 0.5,
      y: 0.5,
      width: kind === "SECTION" ? 0.8 : 0.12,
      height: kind === "SECTION" ? 0.8 : 0.24,
      rotation: 0,
    },
    parentId: null,
    label: "",
    number: null,
    numberConfirmed: false,
    excluded: false,
    reviewed: true,
    needsReview: false,
    ...overrides,
  };
}
function draft(elements: DraftElement[] = []): LayoutImportDraft {
  return {
    schemaVersion: 1,
    source: { kind: "IMAGE", name: "plan.png", width: 1200, height: 600 },
    status: "REVIEW",
    elements,
    warnings: [],
    warningsConfirmed: true,
  };
}
function ids() {
  let next = 0;
  return () => `00000000-0000-4000-8000-${String(++next).padStart(12, "0")}`;
}

describe("import domain", () => {
  it("converts normalized source centers with the original aspect ratio", () => {
    const value = element("table", "TABLE", {
      geometry: { x: 0.6, y: 0.4, width: 0.2, height: 0.1, rotation: 90 },
    });
    expect(sourceToWorld(value, draft([value]))).toEqual({
      x: 600,
      y: 200,
      width: 200,
      height: 50,
      rotation: 90,
    });
  });
  it("maps fresh UUIDs and appends a new area while preserving the previous document", () => {
    const before: LayoutDocument = {
      ...empty,
      nodes: {
        original: {
          id: "original",
          kind: "SECTION",
          name: "Importbereich",
          x: 500,
          y: 400,
          width: 600,
          height: 400,
          rotation: 0,
          shape: "RECTANGLE",
          meta: null,
        },
      },
      order: ["original"],
    };
    const value = draft([
      element("section", "SECTION", { label: "Importbereich" }),
      element("table", "TABLE", { parentId: "section" }),
      element("seat", "SEAT", { parentId: "table" }),
    ]);
    const result = importLayoutDraft(before, value, ids());
    expect(result.before).toBe(before);
    expect(result.after.nodes.original).toBe(before.nodes.original);
    expect(before.order).toEqual(["original"]);
    expect(result.newIds).toHaveLength(3);
    expect(result.newIds.every((id) => !value.elements.some((item) => item.id === id))).toBe(true);
    const section = result.after.nodes[result.newIds[0]!]!;
    const table = result.after.nodes[result.newIds[1]!]!;
    const seat = result.after.nodes[result.newIds[2]!]!;
    expect(section.kind === "SECTION" && section.name).toBe("Importbereich 2");
    expect(section.x - section.width / 2).toBeGreaterThanOrEqual(900);
    expect(table.kind === "TABLE" && table.sectionId).toBe(section.id);
    expect(seat.kind === "SEAT" && seat.tableId).toBe(table.id);
    expect(seat.kind === "SEAT" && seat.sectionId).toBe(section.id);
    expect(seat).not.toHaveProperty("guestId");
    expect(seat).not.toHaveProperty("invitationId");
  });
  it("creates one fallback section for unparented tables and free seats", () => {
    const value = draft([element("table", "TABLE"), element("seat", "SEAT")]);
    const result = importLayoutDraft(empty, value, ids());
    const nodes = Object.values(result.after.nodes);
    expect(nodes.filter((node) => node.kind === "SECTION")).toHaveLength(1);
    const section = nodes.find((node) => node.kind === "SECTION")!;
    for (const node of nodes.filter((node) => node.kind !== "SECTION"))
      expect(node.sectionId).toBe(section.id);
  });
  it("requires uncertainty, unsupported types and recognition warnings to be reviewed", () => {
    const value = draft([
      element("unknown", "UNKNOWN", { shape: "", needsReview: true, reviewed: false }),
    ]);
    value.warnings = [{ code: "UNKNOWN_OBJECT", message: "Review contour" }];
    value.warningsConfirmed = false;
    expect(draftIssues(value).length).toBeGreaterThanOrEqual(3);
    expect(() => importLayoutDraft(empty, value, ids())).toThrow();
    value.elements[0]!.excluded = true;
    value.elements.push(element("table", "TABLE"));
    value.warningsConfirmed = true;
    expect(draftIssues(value)).toEqual([]);
    expect(Object.values(importLayoutDraft(empty, value, ids()).after.nodes)).toHaveLength(2);
  });
  it("rejects duplicate IDs, excluded parents, parent cycles and invalid numbers", () => {
    for (const elements of [
      [element("same", "TABLE"), element("same", "TABLE")],
      [
        element("parent", "SECTION", { excluded: true }),
        element("table", "TABLE", { parentId: "parent" }),
      ],
      [element("a", "TABLE", { parentId: "b" }), element("b", "TABLE", { parentId: "a" })],
      [element("seat", "SEAT", { numberConfirmed: true, number: NaN })],
    ])
      expect(() => importLayoutDraft(empty, draft(elements), ids())).toThrow();
  });
  it("keeps confirmed seat numbers and allocates deterministic unused numbers", () => {
    const value = draft([
      element("section", "SECTION"),
      element("a", "SEAT", { parentId: "section", numberConfirmed: true, number: 2 }),
      element("b", "SEAT", { parentId: "section" }),
      element("c", "SEAT", { parentId: "section" }),
    ]);
    const numbers = Object.values(importLayoutDraft(empty, value, ids()).after.nodes)
      .filter((node) => node.kind === "SEAT")
      .map((seat) => seat.number);
    expect(numbers).toEqual([2, 1, 3]);
    value.elements[2] = element("b", "SEAT", {
      parentId: "section",
      numberConfirmed: true,
      number: 2,
    });
    expect(() => importLayoutDraft(empty, value, ids())).toThrow(/doppelt/);
  });
  it("rejects invalid or repeated new UUIDs without mutating the old document", () => {
    const value = draft([element("table", "TABLE"), element("seat", "SEAT")]);
    expect(() => importLayoutDraft(empty, value, () => "provider-id")).toThrow(/ID/);
    expect(() =>
      importLayoutDraft(empty, value, () => "00000000-0000-4000-8000-000000000001"),
    ).toThrow(/ID/);
    expect(empty.order).toEqual([]);
  });
  it("moves a draft parent and descendants through the ordinary world operation", () => {
    const value = draft([
      element("section", "SECTION"),
      element("table", "TABLE", { parentId: "section" }),
      element("seat", "SEAT", { parentId: "table" }),
    ]);
    const before = draftDocument(value);
    const after = moveNode(before, "table", { x: 100, y: 50 });
    const moved = moveDraft(value, { before, after, nodeId: "table" });
    expect(moved.elements[0]).toBe(value.elements[0]);
    expect(moved.elements[1]!.geometry.x).toBeCloseTo(0.6);
    expect(moved.elements[2]!.geometry.y).toBeCloseTo(0.6);
  });
  it("rejects invalid source/world geometry at the import boundary", () => {
    for (const geometry of [
      { x: NaN, y: 0.5, width: 0.1, height: 0.2, rotation: 0 },
      { x: 0.5, y: 0.5, width: 0, height: 0.2, rotation: 0 },
    ])
      expect(() =>
        importLayoutDraft(empty, draft([element("table", "TABLE", { geometry })]), ids()),
      ).toThrow();
    const invalid = draft([element("table", "TABLE")]);
    invalid.source.width = 0;
    expect(() => importLayoutDraft(empty, invalid, ids())).toThrow();
  });
  it("adds a manual object without changing previous draft elements", () => {
    const value = draft([element("table", "TABLE")]);
    const result = addDraftElement(value, "SEAT");
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0]).toBe(value.elements[0]);
    expect(value.elements).toHaveLength(1);
  });
});

describe("deterministic table generation", () => {
  for (const [shape, count, width, height] of [
    ["ROUND", 8, 120, 120],
    ["RECTANGLE", 10, 180, 80],
    ["OVAL", 12, 180, 80],
    ["ROW", 5, 200, 60],
  ] as const) {
    it(`${shape} produces exactly ${count} finite distinct seats`, () => {
      const positions = tablePerimeter(shape, width, height, count);
      expect(positions).toHaveLength(count);
      expect(new Set(positions.map((point) => `${point.x},${point.y}`)).size).toBe(count);
      expect(positions.every((point) => Object.values(point).every(Number.isFinite))).toBe(true);
    });
  }
  it("handles zero/one/odd counts and rejects unsupported or invalid geometry", () => {
    for (const count of [0, 1, 3])
      expect(tablePerimeter("OVAL", 120, 60, count)).toHaveLength(count);
    expect(() => tablePerimeter("UNKNOWN", 120, 60, 8)).toThrow();
    expect(() => tablePerimeter("ROUND", 120, 60, 8)).toThrow();
    expect(() => tablePerimeter("ROUND", 120, 120, NaN)).toThrow();
    expect(() => tablePerimeter("ROUND", Infinity, Infinity, 8)).toThrow();
  });
  it("regeneration replaces only that table's seats and applies its own rotation once", () => {
    const value = draft([
      element("table", "TABLE", {
        geometry: { x: 0.5, y: 0.5, width: 0.12, height: 0.24, rotation: 90 },
      }),
      element("old", "SEAT", { parentId: "table" }),
      element("free", "SEAT"),
    ]);
    const result = regenerateDraftSeats(value, "table", 8);
    const seats = result.elements.filter((seat) => seat.parentId === "table");
    expect(seats).toHaveLength(8);
    expect(result.elements.find((seat) => seat.id === "free")).toBe(value.elements[2]);
    expect(result.elements.some((seat) => seat.id === "old")).toBe(false);
    expect(seats[0]!.geometry.x).toBeCloseTo(0.588);
    expect(seats[0]!.geometry.y).toBeCloseTo(0.5);
    expect(seats[0]!.geometry.rotation).toBeCloseTo(90);
  });
});

describe("recognition boundary", () => {
  const result = {
    recognizer: "geometry-v1",
    elements: [
      {
        id: "one",
        kind: "TABLE",
        geometry: { x: 0.5, y: 0.5, width: 0.1, height: 0.2, rotation: 0 },
        sourceBounds: { x: 0.5, y: 0.5, width: 0.1, height: 0.2, rotation: 0 },
        shape: "ROUND",
        needsReview: false,
      },
    ],
    warnings: [],
    analysis: { width: 1200, height: 600, threshold: 100 },
  };
  it("accepts genuine result shape and creates a source-independent draft", () => {
    const parsed = recognitionSchema.parse(result);
    const value = createImportDraft(parsed, {
      kind: "PDF",
      name: "plan.pdf",
      width: 1200,
      height: 600,
      pageNumber: 2,
    });
    expect(value.elements[0]!.id).toBe("one");
    expect(value.source.pageNumber).toBe(2);
    expect(value.elements[0]!.numberConfirmed).toBe(false);
    expect(value).not.toHaveProperty("data");
  });
  it("rejects duplicate detections, bad parents and non-finite geometry", () => {
    expect(() =>
      recognitionSchema.parse({ ...result, elements: [...result.elements, ...result.elements] }),
    ).toThrow();
    expect(() =>
      recognitionSchema.parse({
        ...result,
        elements: [{ ...result.elements[0], parentCandidateId: "missing" }],
      }),
    ).toThrow();
    expect(() =>
      recognitionSchema.parse({
        ...result,
        elements: [
          { ...result.elements[0], geometry: { ...result.elements[0]!.geometry, x: Infinity } },
        ],
      }),
    ).toThrow();
  });
});
