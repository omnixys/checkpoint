import type { Json, LayoutDocument, LayoutNode, SeatNode } from "./document";
import { type Point, relativeToWorld, worldToRelative } from "./geometry";

interface SourceGeometry {
  readonly id: string;
  readonly x: number | null;
  readonly y: number | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly rotation: number | null;
  readonly shape?: string | null;
  readonly meta: unknown;
}
export interface SourceSeat extends SourceGeometry {
  readonly sectionId: string;
  readonly tableId: string | null;
  readonly number: number | null;
  readonly locked?: boolean;
  readonly hidden?: boolean;
}
export interface SourceTable extends SourceGeometry {
  readonly name: string;
  readonly sectionId: string;
  readonly seats: readonly SourceSeat[];
}
export interface SourceSection extends SourceGeometry {
  readonly name: string;
  readonly tables: readonly SourceTable[];
  readonly seats: readonly SourceSeat[];
}
export type SourceLayout = readonly SourceSection[];
export class LayoutImportError extends Error {
  constructor(detail: string) {
    super(`Der Sitzplan enthält ungültige Geometrie: ${detail}`);
    this.name = "LayoutImportError";
  }
}
function number(value: number | null | undefined, fallback: number, label: string): number {
  if (value == null) return fallback;
  if (!Number.isFinite(value)) throw new LayoutImportError(label);
  return value;
}
function metadata(value: unknown): Json {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (Array.isArray(value)) return value.map(metadata);
  if (
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  )
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, metadata(item)]));
  throw new LayoutImportError("Metadaten sind nicht serialisierbar");
}
function geometry(
  source: SourceGeometry,
  width: number,
  height: number,
  parent: Point = { x: 0, y: 0 },
) {
  const w = number(source.width, width, `${source.id}: Breite`),
    h = number(source.height, height, `${source.id}: Höhe`);
  if (w <= 0 || h <= 0)
    throw new LayoutImportError(`${source.id}: Abmessungen müssen positiv sein`);
  return {
    id: source.id,
    ...relativeToWorld(
      { x: number(source.x, 0, `${source.id}: X`), y: number(source.y, 0, `${source.id}: Y`) },
      parent,
    ),
    width: w,
    height: h,
    rotation: number(source.rotation, 0, `${source.id}: Rotation`),
    meta: metadata(source.meta),
  };
}
export function importLayout(eventId: string, source: SourceLayout): LayoutDocument {
  const nodes: Record<string, LayoutNode> = Object.create(null),
    order: string[] = [];
  const add = (node: LayoutNode) => {
    if (!node.id || Object.hasOwn(nodes, node.id))
      throw new LayoutImportError(`Doppelte oder leere ID: ${node.id}`);
    if (![node.x, node.y, node.width, node.height, node.rotation].every(Number.isFinite))
      throw new LayoutImportError(`${node.id}: Koordinaten außerhalb des gültigen Zahlenbereichs`);
    nodes[node.id] = node;
    order.push(node.id);
  };
  const addSeat = (seat: SourceSeat, sectionId: string, parent: LayoutNode) => {
    const tableId = parent.kind === "TABLE" ? parent.id : null;
    if (seat.sectionId !== sectionId || seat.tableId !== tableId)
      throw new LayoutImportError(`${seat.id}: widersprüchliche Sitz-Zuordnung`);
    const node: SeatNode = {
      ...geometry(seat, 28, 28, parent),
      kind: "SEAT",
      sectionId,
      tableId,
      number: seat.number == null ? null : number(seat.number, 0, `${seat.id}: Sitznummer`),
      shape: seat.shape ?? "CIRCLE",
      locked: seat.locked ?? false,
      hidden: seat.hidden ?? false,
    };
    add(node);
  };
  for (const section of source) {
    const node: LayoutNode = {
      ...geometry(section, 400, 300),
      kind: "SECTION",
      name: section.name,
      shape: section.shape ?? "RECTANGLE",
    };
    add(node);
    for (const table of section.tables) {
      if (table.sectionId !== section.id)
        throw new LayoutImportError(`${table.id}: widersprüchliche Tisch-Zuordnung`);
      const tableNode: LayoutNode = {
        ...geometry(table, 120, (table.shape ?? "ROUND") === "ROUND" ? 120 : 60, node),
        kind: "TABLE",
        name: table.name,
        sectionId: section.id,
        shape: table.shape ?? "ROUND",
      };
      add(tableNode);
      for (const seat of table.seats) addSeat(seat, section.id, tableNode);
    }
    for (const seat of section.seats) addSeat(seat, section.id, node);
  }
  return { schemaVersion: 1, eventId, nodes, order };
}
/** Export supports the existing topology. Creation/deletion still use the existing API. */
export function exportLayout<T extends SourceLayout>(document: LayoutDocument, baseline: T): T {
  const initial = importLayout(document.eventId, baseline);
  if (
    initial.order.length !== document.order.length ||
    document.order.some((id) => !initial.nodes[id])
  )
    throw new LayoutImportError("Export mit veränderter Struktur wird noch nicht unterstützt");
  function update<S extends SourceGeometry>(source: S): S {
    const node = document.nodes[source.id]!,
      old = initial.nodes[source.id]!;
    if (
      node.kind !== old.kind ||
      (node.kind !== "SECTION" && (old.kind === "SECTION" || node.sectionId !== old.sectionId)) ||
      (node.kind === "SEAT" && (old.kind !== "SEAT" || node.tableId !== old.tableId))
    )
      throw new LayoutImportError("Export mit veränderten Parents wird noch nicht unterstützt");
    const parentId =
      node.kind === "SECTION"
        ? null
        : node.kind === "SEAT"
          ? (node.tableId ?? node.sectionId)
          : node.sectionId;
    const relative = worldToRelative(node, parentId ? document.nodes[parentId]! : { x: 0, y: 0 });
    const result = { ...source };
    const fields = {
      x: relative.x,
      y: relative.y,
      width: node.width,
      height: node.height,
      rotation: node.rotation,
    };
    for (const key of ["x", "y", "width", "height", "rotation"] as const) {
      const fallback = key === "width" || key === "height" ? old[key] : 0;
      // Preserve nulls/missing dimensions unless the normalized value actually changed.
      if (Math.abs(fields[key] - (source[key] ?? fallback)) > 1e-9)
        Object.assign(result, { [key]: fields[key] });
    }
    if (node.shape !== old.shape) Object.assign(result, { shape: node.shape });
    if (JSON.stringify(node.meta) !== JSON.stringify(old.meta))
      Object.assign(result, { meta: node.meta });
    return result;
  }
  return baseline.map((section) => ({
    ...update(section),
    tables: section.tables.map((table) => ({ ...update(table), seats: table.seats.map(update) })),
    seats: section.seats.map(update),
  })) as unknown as T;
}
export function exportMove(
  document: LayoutDocument,
  id: string,
): { id: string; x: number; y: number } {
  const node = document.nodes[id];
  if (!node) throw new LayoutImportError(`Unbekannte ID: ${id}`);
  const parentId =
    node.kind === "SECTION"
      ? null
      : node.kind === "SEAT"
        ? (node.tableId ?? node.sectionId)
        : node.sectionId;
  return { id, ...worldToRelative(node, parentId ? document.nodes[parentId]! : { x: 0, y: 0 }) };
}
