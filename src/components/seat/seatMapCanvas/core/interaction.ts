import {
  type LayoutDocument,
  type LayoutNode,
  type MoveOperation,
  movableNodes,
  moveNodes,
} from "./document";
import { type Camera, type Point, screenToWorld } from "./geometry";

export const DRAG_THRESHOLD = 3;
export interface DragGesture {
  readonly pointerId: number;
  readonly nodeId: string;
  readonly nodeIds: readonly string[];
  readonly document: LayoutDocument;
  readonly camera: Camera;
  readonly start: Point;
  readonly originals: readonly LayoutNode[];
  readonly active: boolean;
  readonly delta: Point;
}
export function beginDrag(
  document: LayoutDocument,
  nodeIds: readonly string[] | string,
  pointerId: number,
  start: Point,
  camera: Camera,
): DragGesture {
  const selection = typeof nodeIds === "string" ? [nodeIds] : nodeIds;
  return {
    document,
    nodeId: selection[0] ?? "",
    nodeIds: selection,
    pointerId,
    start,
    camera,
    originals: selection.flatMap((id) => movableNodes(document, id)),
    active: false,
    delta: { x: 0, y: 0 },
  };
}
export function updateDrag(gesture: DragGesture, point: Point): DragGesture {
  const active =
    gesture.active ||
    Math.hypot(point.x - gesture.start.x, point.y - gesture.start.y) >= DRAG_THRESHOLD;
  if (!active) return gesture;
  const a = screenToWorld(gesture.start, gesture.camera),
    b = screenToWorld(point, gesture.camera);
  return { ...gesture, active, delta: { x: b.x - a.x, y: b.y - a.y } };
}
export function finishDrag(gesture: DragGesture): MoveOperation | null {
  if (!gesture.active || !gesture.originals.length) return null;
  const after = moveNodes(gesture.document, gesture.nodeIds, gesture.delta);
  return after === gesture.document
    ? null
    : { nodeId: gesture.nodeId, before: gesture.document, after };
}
