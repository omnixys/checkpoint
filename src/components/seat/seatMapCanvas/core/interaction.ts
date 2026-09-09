import {
  type LayoutDocument,
  type LayoutNode,
  type MoveOperation,
  movableNodes,
  moveNode,
} from "./document";
import { type Camera, type Point, screenToWorld } from "./geometry";

export const DRAG_THRESHOLD = 3;
export interface DragGesture {
  readonly pointerId: number;
  readonly nodeId: string;
  readonly document: LayoutDocument;
  readonly camera: Camera;
  readonly start: Point;
  readonly originals: readonly LayoutNode[];
  readonly active: boolean;
  readonly delta: Point;
}
export function beginDrag(
  document: LayoutDocument,
  nodeId: string,
  pointerId: number,
  start: Point,
  camera: Camera,
): DragGesture {
  return {
    document,
    nodeId,
    pointerId,
    start,
    camera,
    originals: movableNodes(document, nodeId),
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
  const after = moveNode(gesture.document, gesture.nodeId, gesture.delta);
  return after === gesture.document
    ? null
    : { nodeId: gesture.nodeId, before: gesture.document, after };
}
