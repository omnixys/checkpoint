import type {
  MoveSeatMutationVariables,
  MoveSectionMutationVariables,
  MoveTableMutationVariables,
  SeatShape,
  SectionShape,
  TableShape,
  UpdateSeatMutationVariables,
  UpdateSectionMutationVariables,
  UpdateTableMutationVariables,
} from "@/checkpoint/generated/graphql";
import {
  type LayoutDocument,
  type LayoutNode,
  type LayoutOperation,
  orderedNodes,
} from "./document";
import { type Point, worldToRelative } from "./geometry";

/**
 * A concrete GraphQL write that persists the geometry of one node.
 * Move variants keep the established move mutations for pure position
 * changes; update variants carry shape/resize/rotation (and position)
 * geometry of a single node.
 */
export type GeometryWrite =
  | { type: "moveSection"; variables: MoveSectionMutationVariables }
  | { type: "moveTable"; variables: MoveTableMutationVariables }
  | { type: "moveSeat"; variables: MoveSeatMutationVariables }
  | { type: "updateSection"; variables: UpdateSectionMutationVariables }
  | { type: "updateTable"; variables: UpdateTableMutationVariables }
  | { type: "updateSeat"; variables: UpdateSeatMutationVariables };

const EPSILON = 1e-6;
const differs = (a: number, b: number) => Math.abs(a - b) > EPSILON;

interface StoredGeometry {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly shape: string;
  readonly rotation: number;
}

interface UpdateFields {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: string;
  rotation?: number;
}

const baseSeatInput = (id: string): UpdateSeatMutationVariables["input"] => ({
  id,
  height: null,
  label: null,
  meta: null,
  note: null,
  number: null,
  rotation: null,
  seatType: null,
  shape: null,
  width: null,
  x: null,
  y: null,
});

const baseTableInput = (id: string): UpdateTableMutationVariables["input"] => ({
  id,
  capacity: null,
  height: null,
  meta: null,
  name: null,
  order: null,
  rotation: null,
  shape: null,
  width: null,
  x: null,
  y: null,
});

const baseSectionInput = (id: string): UpdateSectionMutationVariables["input"] => ({
  id,
  capacity: null,
  height: null,
  meta: null,
  name: null,
  order: null,
  rotation: null,
  shape: null,
  width: null,
  x: null,
  y: null,
});

/** The service stores coordinates relative to the parent element, never absolute. */
function relativePosition(document: LayoutDocument, node: LayoutNode): Point {
  if (node.kind === "SECTION") return { x: node.x, y: node.y };
  if (node.kind === "SEAT" && node.tableId) {
    const table = document.nodes[node.tableId];
    if (table) return worldToRelative(node, table);
  }
  const section = document.nodes[node.sectionId];
  return section ? worldToRelative(node, section) : { x: node.x, y: node.y };
}

function stored(document: LayoutDocument, node: LayoutNode): StoredGeometry {
  const { x, y } = relativePosition(document, node);
  return {
    x,
    y,
    width: node.width,
    height: node.height,
    shape: node.shape,
    rotation: node.rotation,
  };
}

function collectChanges(before: StoredGeometry, after: StoredGeometry, id: string): UpdateFields {
  const changes: UpdateFields = { id };
  if (differs(before.x, after.x)) changes.x = after.x;
  if (differs(before.y, after.y)) changes.y = after.y;
  if (differs(before.width, after.width)) changes.width = after.width;
  if (differs(before.height, after.height)) changes.height = after.height;
  if (before.shape !== after.shape) changes.shape = after.shape;
  if (differs(before.rotation, after.rotation)) changes.rotation = after.rotation;
  return changes;
}

function isEmpty(changes: UpdateFields): boolean {
  return (
    changes.x === undefined &&
    changes.y === undefined &&
    changes.width === undefined &&
    changes.height === undefined &&
    changes.shape === undefined &&
    changes.rotation === undefined
  );
}

function moveWrite(node: LayoutNode, after: StoredGeometry): GeometryWrite {
  if (node.kind === "SEAT") {
    const input: MoveSeatMutationVariables["input"] = {
      id: node.id,
      x: after.x,
      y: after.y,
      rotation: null,
    };
    return { type: "moveSeat", variables: { input } };
  }
  const input = { id: node.id, x: after.x, y: after.y };
  if (node.kind === "SECTION") return { type: "moveSection", variables: { input } };
  return { type: "moveTable", variables: { input } };
}

const updatesToWrite = (changes: UpdateFields) => {
  const write: Record<string, number | string | null> = {
    x: changes.x ?? null,
    y: changes.y ?? null,
    width: changes.width ?? null,
    height: changes.height ?? null,
    rotation: changes.rotation ?? null,
  };
  if (changes.shape !== undefined) write.shape = changes.shape;
  return write;
};

function updateWrite(node: LayoutNode, changes: UpdateFields): GeometryWrite {
  const geometry = updatesToWrite(changes);
  if (node.kind === "SEAT") {
    const input = { ...baseSeatInput(node.id), ...geometry };
    if (changes.shape !== undefined) input.shape = changes.shape as SeatShape;
    return { type: "updateSeat", variables: { input } };
  }
  if (node.kind === "TABLE") {
    const input = { ...baseTableInput(node.id), ...geometry };
    if (changes.shape !== undefined) input.shape = changes.shape as TableShape;
    return { type: "updateTable", variables: { input } };
  }
  const input = { ...baseSectionInput(node.id), ...geometry };
  if (changes.shape !== undefined) input.shape = changes.shape as SectionShape;
  return { type: "updateSection", variables: { input } };
}

function isDescendantOf(parent: LayoutNode, candidate: LayoutNode): boolean {
  if (parent.kind === "SECTION")
    return candidate.kind !== "SECTION" && candidate.sectionId === parent.id;
  if (parent.kind === "TABLE") return candidate.kind === "SEAT" && candidate.tableId === parent.id;
  return false;
}

/**
 * Translates a completed editor operation into the minimal set of GraphQL
 * geometry writes that reproduces the resulting layout in the backend.
 *
 * - Pure positions flow through the move mutations (existing behavior).
 * - Shape, resize and rotation go through the update mutations.
 * - Orbit moves that a section/table rotation applies to its descendants are
 *   persisted per affected descendant so a refetch does not revert them.
 * - Coordinates are converted from world space into the relative coordinates
 *   the seat service persists.
 */
export function planGeometryWrite(operation: LayoutOperation): GeometryWrite[] {
  const beforeNode = operation.before.nodes[operation.nodeId];
  const afterNode = operation.after.nodes[operation.nodeId];
  if (!beforeNode || !afterNode || operation.before === operation.after) return [];

  const plans: GeometryWrite[] = [];
  const parentChanges = collectChanges(
    stored(operation.before, beforeNode),
    stored(operation.after, afterNode),
    afterNode.id,
  );

  const positionOnly =
    (parentChanges.x !== undefined || parentChanges.y !== undefined) &&
    parentChanges.width === undefined &&
    parentChanges.height === undefined &&
    parentChanges.shape === undefined &&
    parentChanges.rotation === undefined;

  if (!isEmpty(parentChanges)) {
    plans.push(
      positionOnly
        ? moveWrite(afterNode, stored(operation.after, afterNode))
        : updateWrite(afterNode, parentChanges),
    );
  }

  for (const child of orderedNodes(operation.after)) {
    if (child.id === afterNode.id || !isDescendantOf(afterNode, child)) continue;
    const beforeChild = operation.before.nodes[child.id];
    if (!beforeChild || beforeChild === child) continue;
    const changes = collectChanges(
      stored(operation.before, beforeChild),
      stored(operation.after, child),
      child.id,
    );
    if (!isEmpty(changes)) plans.push(updateWrite(child, changes));
  }

  return plans;
}
