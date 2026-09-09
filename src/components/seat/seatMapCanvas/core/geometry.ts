export interface Point {
  readonly x: number;
  readonly y: number;
}
export interface Camera extends Point {
  readonly scale: number;
}
export interface Geometry extends Point {
  readonly width: number;
  readonly height: number;
  readonly rotation: number;
}
export interface Bounds extends Point {
  readonly width: number;
  readonly height: number;
}
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 5;

/** Clockwise degrees in screen coordinates (positive Y points down), about center. */
export function rotate(point: Point, degrees: number, center: Point = { x: 0, y: 0 }): Point {
  const radians = (degrees * Math.PI) / 180;
  const x = point.x - center.x,
    y = point.y - center.y;
  return {
    x: center.x + x * Math.cos(radians) - y * Math.sin(radians),
    y: center.y + x * Math.sin(radians) + y * Math.cos(radians),
  };
}
/** Legacy parents contribute translation only. Their rotations are not inherited. */
export const relativeToWorld = (point: Point, parent: Point): Point => ({
  x: parent.x + point.x,
  y: parent.y + point.y,
});
export const worldToRelative = (point: Point, parent: Point): Point => ({
  x: point.x - parent.x,
  y: point.y - parent.y,
});
export const clientToScreen = (point: Point, origin: { left: number; top: number }): Point => ({
  x: point.x - origin.left,
  y: point.y - origin.top,
});
export const screenToWorld = (point: Point, camera: Camera): Point => ({
  x: (point.x - camera.x) / camera.scale,
  y: (point.y - camera.y) / camera.scale,
});
export const worldToScreen = (point: Point, camera: Camera): Point => ({
  x: point.x * camera.scale + camera.x,
  y: point.y * camera.scale + camera.y,
});
export function geometryBounds(nodes: readonly Geometry[]): Bounds | null {
  if (!nodes.length) return null;
  let left = Infinity,
    top = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  for (const n of nodes) {
    for (const dx of [-1, 1])
      for (const dy of [-1, 1]) {
        const p = rotate(
          { x: n.x + (dx * n.width) / 2, y: n.y + (dy * n.height) / 2 },
          n.rotation,
          n,
        );
        left = Math.min(left, p.x);
        top = Math.min(top, p.y);
        right = Math.max(right, p.x);
        bottom = Math.max(bottom, p.y);
      }
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
}
export function fitCamera(
  nodes: readonly Geometry[],
  viewport: { width: number; height: number },
  padding = 30,
): Camera {
  const bounds = geometryBounds(nodes);
  if (!bounds) return { x: viewport.width / 2, y: viewport.height / 2, scale: 1 };
  const scale = Math.max(
    MIN_SCALE,
    Math.min(
      MAX_SCALE,
      (viewport.width - padding * 2) / Math.max(1, bounds.width),
      (viewport.height - padding * 2) / Math.max(1, bounds.height),
    ),
  );
  return {
    scale,
    x: viewport.width / 2 - (bounds.x + bounds.width / 2) * scale,
    y: viewport.height / 2 - (bounds.y + bounds.height / 2) * scale,
  };
}
export function zoomCamera(camera: Camera, scale: number, anchor: Point): Camera {
  const world = screenToWorld(anchor, camera);
  const finalScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
  return {
    scale: finalScale,
    x: anchor.x - world.x * finalScale,
    y: anchor.y - world.y * finalScale,
  };
}
