import type { Geometry, Point } from "./geometry";

export type Json =
  | null
  | boolean
  | number
  | string
  | readonly Json[]
  | { readonly [key: string]: Json };
interface BaseNode extends Geometry {
  readonly id: string;
  readonly shape: string;
  readonly meta: Json;
}
export interface SectionNode extends BaseNode {
  readonly kind: "SECTION";
  readonly name: string;
}
export interface TableNode extends BaseNode {
  readonly kind: "TABLE";
  readonly name: string;
  readonly sectionId: string;
}
export interface SeatNode extends BaseNode {
  readonly kind: "SEAT";
  readonly number: number | null;
  readonly sectionId: string;
  readonly tableId: string | null;
  readonly locked: boolean;
  readonly hidden: boolean;
}
export type LayoutNode = SectionNode | TableNode | SeatNode;
export interface LayoutDocument {
  readonly schemaVersion: 1;
  readonly eventId: string;
  readonly nodes: Readonly<Record<string, LayoutNode>>;
  readonly order: readonly string[];
}
export interface MoveOperation {
  readonly nodeId: string;
  readonly before: LayoutDocument;
  readonly after: LayoutDocument;
}
export function orderedNodes(document: LayoutDocument): LayoutNode[] {
  return document.order.map((id) => document.nodes[id]!);
}
/** A single parent drag includes its descendants, without changing local offsets. */
export function movableNodes(document: LayoutDocument, id: string): LayoutNode[] {
  const node = document.nodes[id];
  if (!node) return [];
  const nodes = orderedNodes(document).filter(
    (n) =>
      n.id === id ||
      (node.kind === "SECTION" && n.kind !== "SECTION" && n.sectionId === id) ||
      (node.kind === "TABLE" && n.kind === "SEAT" && n.tableId === id),
  );
  return nodes.some((n) => n.kind === "SEAT" && n.locked) ? [] : nodes;
}
export function moveNode(document: LayoutDocument, id: string, delta: Point): LayoutDocument {
  if ((!delta.x && !delta.y) || !Number.isFinite(delta.x) || !Number.isFinite(delta.y))
    return document;
  const moving = movableNodes(document, id);
  if (!moving.length) return document;
  const nodes = { ...document.nodes };
  for (const node of moving) nodes[node.id] = { ...node, x: node.x + delta.x, y: node.y + delta.y };
  return { ...document, nodes };
}
