import type { LayoutDocument, LayoutNode, MoveOperation } from "../core/document";
import { geometryBounds, rotate } from "../core/geometry";
import type { DraftElement, LayoutImportDraft } from "./contract";
import { tablePerimeter } from "./table-perimeter";

export const IMPORT_WIDTH = 1000;
const shapes: Record<string, readonly string[]> = {
  SECTION: ["RECTANGLE", "CIRCLE", "POLYGON"],
  TABLE: ["ROUND", "RECTANGLE", "OVAL", "ROW"],
  SEAT: ["CIRCLE", "SQUARE", "RECTANGLE"],
};
export function draftIssues(draft: LayoutImportDraft): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  const byId = new Map(draft.elements.map((element) => [element.id, element]));
  if (
    ![draft.source.width, draft.source.height].every(
      (value) => Number.isFinite(value) && value > 0,
    ) ||
    !Number.isFinite((IMPORT_WIDTH * draft.source.height) / draft.source.width)
  )
    issues.push("Ungültige Quellabmessungen.");
  for (const e of draft.elements) {
    if (ids.has(e.id)) issues.push("Doppelte Vorschlags-ID.");
    ids.add(e.id);
    if (e.excluded) continue;
    if (!shapes[e.kind]?.includes(e.shape))
      issues.push(`${e.label || e.id}: Typ und Form bestätigen oder ausschließen.`);
    if (
      !Object.values(e.geometry).every(Number.isFinite) ||
      e.geometry.width <= 0 ||
      e.geometry.height <= 0
    )
      issues.push(`${e.id}: Ungültige Geometrie.`);
    if (e.needsReview && !e.reviewed) issues.push(`${e.label || e.id}: Vorschlag prüfen.`);
    if (e.parentId) {
      const candidate = byId.get(e.parentId);
      const parent = candidate?.excluded ? undefined : candidate;
      if (
        !parent ||
        parent.id === e.id ||
        e.kind === "SECTION" ||
        (e.kind === "TABLE" && parent.kind !== "SECTION") ||
        (e.kind === "SEAT" && !["SECTION", "TABLE"].includes(parent.kind))
      )
        issues.push(`${e.label || e.id}: Zuordnung prüfen.`);
    }
    if (e.numberConfirmed && (!Number.isInteger(e.number) || e.number === null || e.number < 1))
      issues.push(`${e.id}: Sitznummer muss eine positive ganze Zahl sein.`);
  }
  if (!draft.warningsConfirmed && draft.warnings.length)
    issues.push("Hinweise zur Erkennung bestätigen.");
  if (draft.elements.length > 10000) issues.push("Höchstens 10.000 Vorschläge möglich.");
  return [...new Set(issues)];
}
function uniqueName(base: string, used: Set<string>): string {
  let name = base,
    index = 2;
  while (used.has(name)) name = `${base} ${index++}`;
  used.add(name);
  return name;
}
export function sourceToWorld(e: DraftElement, draft: LayoutImportDraft) {
  const height = (IMPORT_WIDTH * draft.source.height) / draft.source.width;
  if (
    ![draft.source.width, draft.source.height, height].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  )
    throw new Error("Ungültige Quellabmessungen.");
  const result = {
    x: e.geometry.x * IMPORT_WIDTH,
    y: e.geometry.y * height,
    width: e.geometry.width * IMPORT_WIDTH,
    height: e.geometry.height * height,
    rotation: e.geometry.rotation,
  };
  if (!Object.values(result).every(Number.isFinite)) throw new Error("Ungültige World-Geometrie.");
  return result;
}
/** Draft projection uses ephemeral IDs and never exports to the Seat API. */
export function draftDocument(draft: LayoutImportDraft): LayoutDocument {
  const nodes: Record<string, LayoutNode> = {};
  const order: string[] = [];
  const byId = new Map(draft.elements.map((element) => [element.id, element]));
  for (const e of draft.elements.filter((e) => !e.excluded)) {
    const base = { id: e.id, ...sourceToWorld(e, draft), shape: e.shape, meta: null };
    let node: LayoutNode;
    if (e.kind === "SECTION") node = { ...base, kind: "SECTION", name: e.label || "Bereich" };
    else if (e.kind === "SEAT") {
      const candidate = e.parentId ? byId.get(e.parentId) : undefined;
      const table = candidate?.kind === "TABLE" ? candidate : undefined;
      node = {
        ...base,
        kind: "SEAT",
        sectionId: table?.parentId ?? e.parentId ?? "draft-section",
        tableId: table?.id ?? null,
        number: e.number,
        locked: false,
        hidden: false,
      };
    } else
      node = {
        ...base,
        kind: "TABLE",
        sectionId: e.parentId ?? "draft-section",
        name: e.label || (e.kind === "TABLE" ? "Tisch" : e.kind),
      };
    nodes[node.id] = node;
    order.push(node.id);
  }
  return { schemaVersion: 1, eventId: "import-review", nodes, order };
}
export function moveDraft(draft: LayoutImportDraft, operation: MoveOperation): LayoutImportDraft {
  const height = (IMPORT_WIDTH * draft.source.height) / draft.source.width;
  return {
    ...draft,
    elements: draft.elements.map((e) => {
      const n = operation.after.nodes[e.id],
        before = operation.before.nodes[e.id];
      return n && before && n !== before
        ? { ...e, geometry: { ...e.geometry, x: n.x / IMPORT_WIDTH, y: n.y / height } }
        : e;
    }),
  };
}
export interface ImportOperation {
  before: LayoutDocument;
  after: LayoutDocument;
  newIds: readonly string[];
}
export function importLayoutDraft(
  before: LayoutDocument,
  draft: LayoutImportDraft,
  newId: () => string = () => crypto.randomUUID(),
): ImportOperation {
  const issues = draftIssues(draft);
  if (issues.length) throw new Error(issues.join("\n"));
  const active = draft.elements.filter((e) => !e.excluded);
  if (!active.length) throw new Error("Mindestens einen Bereich, Tisch oder Sitz hinzufügen.");
  const bounds = geometryBounds(before.order.map((id) => before.nodes[id]!));
  const offset = { x: bounds ? bounds.x + bounds.width + 100 : 0, y: bounds?.y ?? 0 };
  const height = (IMPORT_WIDTH * draft.source.height) / draft.source.width;
  const nodes: Record<string, LayoutNode> = { ...before.nodes },
    order = [...before.order],
    newIds: string[] = [];
  const allocate = () => {
    const id = newId();
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      Object.hasOwn(nodes, id) ||
      newIds.includes(id)
    )
      throw new Error("Ungültige oder doppelte neue ID.");
    newIds.push(id);
    return id;
  };
  const mapping = new Map(active.map((e) => [e.id, allocate()]));
  const sectionNames = new Set(
    Object.values(nodes)
      .filter((n) => n.kind === "SECTION")
      .map((n) => n.name),
  );
  const add = (node: LayoutNode) => {
    if (![node.x, node.y, node.width, node.height].every(Number.isFinite))
      throw new Error("Ungültige World-Geometrie.");
    nodes[node.id] = node;
    order.push(node.id);
  };
  let fallback: string | null = null;
  const fallbackId = () => {
    if (!fallback) {
      fallback = allocate();
      add({
        id: fallback,
        kind: "SECTION",
        name: uniqueName("Importbereich", sectionNames),
        x: offset.x + IMPORT_WIDTH / 2,
        y: offset.y + height / 2,
        width: IMPORT_WIDTH,
        height,
        rotation: 0,
        shape: "RECTANGLE",
        meta: null,
      });
    }
    return fallback;
  };
  const geometry = (e: DraftElement) => {
    const g = sourceToWorld(e, draft);
    return { ...g, x: g.x + offset.x, y: g.y + offset.y };
  };
  for (const e of active.filter((e) => e.kind === "SECTION"))
    add({
      id: mapping.get(e.id)!,
      kind: "SECTION",
      name: uniqueName(e.label.trim() || "Importbereich", sectionNames),
      ...geometry(e),
      shape: e.shape,
      meta: null,
    });
  const tableNames = new Map<string, Set<string>>();
  for (const e of active.filter((e) => e.kind === "TABLE")) {
    const sectionId = e.parentId ? mapping.get(e.parentId)! : fallbackId();
    const names = tableNames.get(sectionId) ?? new Set<string>();
    tableNames.set(sectionId, names);
    add({
      id: mapping.get(e.id)!,
      kind: "TABLE",
      sectionId,
      name: uniqueName(e.label.trim() || "Tisch", names),
      ...geometry(e),
      shape: e.shape,
      meta: null,
    });
  }
  // Preserve explicitly confirmed numbers first, otherwise assign deterministic unused numbers per section.
  const usedNumbers = new Map<string, Set<number>>();
  const seats = active
    .filter((e) => e.kind === "SEAT")
    .map((e) => {
      const parent = e.parentId ? nodes[mapping.get(e.parentId)!] : null;
      return {
        e,
        tableId: parent?.kind === "TABLE" ? parent.id : null,
        sectionId:
          parent?.kind === "TABLE"
            ? parent.sectionId
            : parent?.kind === "SECTION"
              ? parent.id
              : fallbackId(),
      };
    });
  for (const { e, sectionId } of seats)
    if (e.numberConfirmed && e.number !== null) {
      const used = usedNumbers.get(sectionId) ?? new Set<number>();
      if (used.has(e.number)) throw new Error("Bestätigte Sitznummern sind im Bereich doppelt.");
      used.add(e.number);
      usedNumbers.set(sectionId, used);
    }
  for (const { e, sectionId, tableId } of seats) {
    const used = usedNumbers.get(sectionId) ?? new Set<number>();
    usedNumbers.set(sectionId, used);
    let number = e.numberConfirmed ? e.number : null;
    if (number === null) {
      number = 1;
      while (used.has(number)) number++;
      used.add(number);
    }
    add({
      id: mapping.get(e.id)!,
      kind: "SEAT",
      sectionId,
      tableId,
      number,
      ...geometry(e),
      shape: e.shape,
      meta: e.label ? { label: e.label } : null,
      locked: false,
      hidden: false,
    });
  }
  return { before, after: { ...before, nodes, order }, newIds };
}
export function regenerateDraftSeats(
  draft: LayoutImportDraft,
  tableId: string,
  count: number,
): LayoutImportDraft {
  const table = draft.elements.find((e) => e.id === tableId && e.kind === "TABLE");
  if (!table) throw new Error("Tisch fehlt.");
  const body = sourceToWorld(table, draft);
  const height = (IMPORT_WIDTH * draft.source.height) / draft.source.width;
  const rest = draft.elements.filter((e) => e.kind !== "SEAT" || e.parentId !== tableId);
  if (rest.length + count > 10000) throw new Error("Höchstens 10.000 Vorschläge möglich.");
  const generated = tablePerimeter(table.shape, body.width, body.height, count).map(
    (point): DraftElement => {
      const rotated = rotate(point, table.geometry.rotation);
      return {
        id: `draft-${crypto.randomUUID()}`,
        kind: "SEAT",
        geometry: {
          x: table.geometry.x + rotated.x / IMPORT_WIDTH,
          y: table.geometry.y + rotated.y / height,
          width: 28 / IMPORT_WIDTH,
          height: 28 / height,
          rotation: point.rotation + table.geometry.rotation,
        },
        shape: "CIRCLE",
        parentId: tableId,
        label: "",
        number: null,
        numberConfirmed: false,
        excluded: false,
        reviewed: true,
        needsReview: false,
      };
    },
  );
  return { ...draft, elements: [...rest, ...generated] };
}
export function addDraftElement(
  draft: LayoutImportDraft,
  kind: "SECTION" | "TABLE" | "SEAT",
): LayoutImportDraft {
  if (draft.elements.length >= 10000) throw new Error("Höchstens 10.000 Vorschläge möglich.");
  const height = (IMPORT_WIDTH * draft.source.height) / draft.source.width;
  return {
    ...draft,
    elements: [
      ...draft.elements,
      {
        id: `draft-${crypto.randomUUID()}`,
        kind,
        geometry: {
          x: 0.5,
          y: 0.5,
          width: kind === "SECTION" ? 0.8 : kind === "TABLE" ? 0.12 : 0.028,
          height: (kind === "SECTION" ? height * 0.8 : kind === "TABLE" ? 120 : 28) / height,
          rotation: 0,
        },
        shape: kind === "SECTION" ? "RECTANGLE" : kind === "TABLE" ? "ROUND" : "CIRCLE",
        parentId: null,
        label: "",
        number: null,
        numberConfirmed: false,
        excluded: false,
        reviewed: true,
        needsReview: false,
      },
    ],
  };
}
