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
export interface ResizeOperation {
  readonly nodeId: string;
  readonly before: LayoutDocument;
  readonly after: LayoutDocument;
}
export interface RotateOperation {
  readonly nodeId: string;
  readonly before: LayoutDocument;
  readonly after: LayoutDocument;
}
export type LayoutOperation = MoveOperation | ResizeOperation | RotateOperation;
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
const MIN_SIZE: Record<LayoutNode["kind"], { width: number; height: number }> = {
  SECTION: { width: 160, height: 120 },
  TABLE: { width: 60, height: 40 },
  SEAT: { width: 24, height: 16 },
};
/** Resizing keeps the north-west corner fixed and never clips contained layout objects. */
export function resizeNode(
  document: LayoutDocument,
  id: string,
  width: number,
  height: number,
): LayoutDocument {
  const node = document.nodes[id];
  const min = node ? MIN_SIZE[node.kind] : null;
  if (
    !node ||
    !min ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    return document;
  const left = node.x - node.width / 2;
  const top = node.y - node.height / 2;
  let minWidth = min.width,
    minHeight = min.height,
    maxWidth = Infinity,
    maxHeight = Infinity;
  if (node.kind === "SECTION" || node.kind === "TABLE") {
    const children = orderedNodes(document).filter(
      (child) =>
        (node.kind === "SECTION" && child.kind !== "SECTION" && child.sectionId === node.id) ||
        (node.kind === "TABLE" && child.kind === "SEAT" && child.tableId === node.id),
    );
    if (node.kind === "SECTION") {
      const padding = 32;
      for (const child of children) {
        minWidth = Math.max(minWidth, child.x + child.width / 2 - left + padding);
        minHeight = Math.max(minHeight, child.y + child.height / 2 - top + padding);
      }
    } else {
      // Seats stay where they are; growing the table must never cover a guest that
      // currently sits outside the table. Seats already inside the rectangle allow
      // free growth, and the limit never pulls the table smaller (keeps dragging fluid).
      const gap = 8;
      for (const child of children) {
        if (Math.abs(child.x - node.x) > node.width / 2)
          maxWidth = Math.min(maxWidth, (Math.abs(child.x - node.x) - child.width / 2 - gap) * 2);
        if (Math.abs(child.y - node.y) > node.height / 2)
          maxHeight = Math.min(
            maxHeight,
            (Math.abs(child.y - node.y) - child.height / 2 - gap) * 2,
          );
      }
      maxWidth = Math.max(node.width, maxWidth);
      maxHeight = Math.max(node.height, maxHeight);
    }
  }
  const nextWidth = Math.max(minWidth, Math.min(maxWidth, width));
  const nextHeight = Math.max(minHeight, Math.min(maxHeight, height));
  if (nextWidth === node.width && nextHeight === node.height) return document;
  return {
    ...document,
    nodes: {
      ...document.nodes,
      [id]: {
        ...node,
        width: nextWidth,
        height: nextHeight,
        x: left + nextWidth / 2,
        y: top + nextHeight / 2,
      },
    },
  };
}
/** @deprecated Use {@link resizeNode}; kept for callers that only resize sections. */
export function resizeSection(
  document: LayoutDocument,
  id: string,
  width: number,
  height: number,
): LayoutDocument {
  return resizeNode(document, id, width, height);
}
/** Switches appearance and applies kind-specific default extents when none are given. */
export function setNodeShape(
  document: LayoutDocument,
  id: string,
  shape: string,
  width?: number,
  height?: number,
): LayoutDocument {
  const node = document.nodes[id];
  if (!node || node.shape === shape) return document;
  let nextWidth = width,
    nextHeight = height;
  if (nextWidth == null || nextHeight == null) {
    if (node.kind === "SECTION") {
      nextWidth = node.width;
      nextHeight = shape === "CIRCLE" ? Math.max(node.width, node.height) : node.height;
      if (shape === "CIRCLE") nextWidth = nextHeight;
    } else if (node.kind === "TABLE") {
      nextWidth = node.width;
      nextHeight = node.height;
      if (shape === "ROUND") {
        const size = Math.max(node.width, node.height);
        nextWidth = size;
        nextHeight = size;
      } else if (shape === "OVAL") {
        nextWidth = Math.max(node.width, Math.round(node.height * 1.4));
      } else if (shape === "ROW") {
        nextWidth = Math.max(node.width, Math.round(node.height * 3));
      }
    } else if (shape === "SQUARE") {
      nextWidth = 36;
      nextHeight = 36;
    } else if (shape === "RECTANGLE") {
      nextWidth = Math.max(node.width, 56);
      nextHeight = 28;
    } else {
      nextWidth = 28;
      nextHeight = 28;
    }
  }
  if (
    !Number.isFinite(nextWidth) ||
    !Number.isFinite(nextHeight) ||
    nextWidth <= 0 ||
    nextHeight <= 0
  )
    return document;
  return {
    ...document,
    nodes: {
      ...document.nodes,
      [id]: { ...node, shape, width: nextWidth, height: nextHeight },
    },
  };
}
const toPositiveAngle = (rotation: number): number => ((rotation % 360) + 360) % 360;
function rotatedPosition(
  point: Pick<LayoutNode, "x" | "y">,
  center: Pick<LayoutNode, "x" | "y">,
  deltaDegrees: number,
): Pick<LayoutNode, "x" | "y"> {
  const radians = (deltaDegrees * Math.PI) / 180;
  const dx = point.x - center.x,
    dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: center.y + dx * Math.sin(radians) + dy * Math.cos(radians),
  };
}
/** Rotates a node around its center and spins its contained layout objects with it. */
export function rotateNode(document: LayoutDocument, id: string, rotation: number): LayoutDocument {
  const node = document.nodes[id];
  if (!node || !Number.isFinite(rotation)) return document;
  const next = toPositiveAngle(rotation);
  if (toPositiveAngle(node.rotation) === next) return document;
  const delta = next - toPositiveAngle(node.rotation);
  const center = { x: node.x, y: node.y };
  const nodes: Record<string, LayoutNode> = { ...document.nodes, [id]: { ...node, rotation: next } };
  if (node.kind === "SECTION") {
    for (const child of orderedNodes(document))
      if (child.kind !== "SECTION" && child.sectionId === node.id) {
        const moved = rotatedPosition(child, center, delta);
        nodes[child.id] = { ...child, ...moved, rotation: child.rotation + delta };
      }
  } else if (node.kind === "TABLE") {
    for (const child of orderedNodes(document))
      if (child.kind === "SEAT" && child.tableId === node.id) {
        const moved = rotatedPosition(child, center, delta);
        nodes[child.id] = { ...child, ...moved, rotation: child.rotation + delta };
      }
  }
  return { ...document, nodes };
}
