"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import type { LayoutDocument, LayoutNode, MoveOperation } from "./core/document";
import { type Camera, clientToScreen, type Point } from "./core/geometry";
import { beginDrag, type DragGesture, finishDrag, updateDrag } from "./core/interaction";

export const nodeTransform = (node: Pick<LayoutNode, "x" | "y" | "rotation">): string =>
  `translate(${node.x}px, ${node.y}px) rotate(${node.rotation}deg)`;
export const cameraTransform = (camera: Camera): string =>
  `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
type Gesture =
  | { type: "drag"; drag: DragGesture }
  | {
      type: "pan";
      pointerId: number;
      start: Point;
      current: Point;
      camera: Camera;
      moved: boolean;
    };
interface Options {
  document: LayoutDocument;
  camera: Camera;
  editing: boolean;
  pending: boolean;
  onSelect: (ids: string[]) => void;
  onMove: (operation: MoveOperation) => void;
  onCamera: (camera: Camera) => void;
}
export function useSeatMapInteraction({
  document,
  camera,
  editing,
  pending,
  onSelect,
  onMove,
  onCamera,
}: Options) {
  const containerRef = useRef<HTMLDivElement>(null),
    worldRef = useRef<HTMLDivElement>(null);
  const registry = useRef(new Map<string, HTMLDivElement>());
  const gesture = useRef<Gesture | null>(null),
    frame = useRef<number | null>(null),
    space = useRef(false);
  const draw = useCallback(() => {
    frame.current = null;
    const current = gesture.current;
    if (current?.type === "drag") {
      const { active, delta, originals } = current.drag;
      if (active)
        for (const n of originals) {
          const element = registry.current.get(n.id);
          if (element)
            element.style.transform = nodeTransform({ ...n, x: n.x + delta.x, y: n.y + delta.y });
        }
    } else if (current?.type === "pan" && worldRef.current) {
      worldRef.current.style.transform = cameraTransform({
        ...current.camera,
        x: current.camera.x + current.current.x - current.start.x,
        y: current.camera.y + current.current.y - current.start.y,
      });
    }
  }, []);
  const cancel = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    const current = gesture.current;
    gesture.current = null;
    if (current?.type === "drag")
      for (const n of current.drag.originals) {
        const el = registry.current.get(n.id);
        if (el) el.style.removeProperty("transform");
      }
    if (current?.type === "pan" && worldRef.current)
      worldRef.current.style.removeProperty("transform");
    const pointerId = current?.type === "drag" ? current.drag.pointerId : current?.pointerId;
    if (pointerId !== undefined && containerRef.current?.hasPointerCapture(pointerId))
      containerRef.current.releasePointerCapture(pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "";
  }, []);
  // A new source document, camera, event, mode or pending write invalidates the gesture snapshot.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Snapshot changes must cancel the gesture, even though cancellation only reads refs.
  useEffect(() => {
    cancel();
    return cancel;
  }, [cancel, document, camera, editing, pending]);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gesture.current) {
        e.preventDefault();
        cancel();
      }
    };
    const blur = () => {
      space.current = false;
      cancel();
    };
    window.addEventListener("keydown", handleEscape);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("blur", blur);
    };
  }, [cancel]);
  function point(e: React.PointerEvent): Point {
    return clientToScreen(
      { x: e.clientX, y: e.clientY },
      containerRef.current!.getBoundingClientRect(),
    );
  }
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (
      gesture.current ||
      (e.button !== 0 && e.button !== 1) ||
      (e.target as HTMLElement).closest("[data-camera-control]")
    )
      return;
    const id = (e.target as HTMLElement).closest<HTMLElement>("[data-node-id]")?.dataset.nodeId;
    if (id && editing && e.button === 0 && !space.current) {
      if (pending) return;
      onSelect([id]);
      gesture.current = {
        type: "drag",
        drag: beginDrag(document, id, e.pointerId, point(e), camera),
      };
    } else {
      if (id && !editing && document.nodes[id]?.kind === "SEAT" && e.button === 0 && !space.current)
        return;
      const start = point(e);
      gesture.current = {
        type: "pan",
        pointerId: e.pointerId,
        start,
        current: start,
        camera,
        moved: false,
      };
    }
    e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (
      !current ||
      e.pointerId !== (current.type === "drag" ? current.drag.pointerId : current.pointerId)
    )
      return;
    const p = point(e);
    if (current.type === "drag")
      gesture.current = { type: "drag", drag: updateDrag(current.drag, p) };
    else
      gesture.current = {
        ...current,
        current: p,
        moved: current.moved || Math.hypot(p.x - current.start.x, p.y - current.start.y) >= 3,
      };
    if (frame.current === null) frame.current = requestAnimationFrame(draw);
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (
      !current ||
      e.pointerId !== (current.type === "drag" ? current.drag.pointerId : current.pointerId)
    )
      return;
    const p = point(e);
    cancel();
    if (current.type === "drag") {
      const operation = finishDrag(updateDrag(current.drag, p));
      if (operation) onMove(operation);
    } else if (current.moved || Math.hypot(p.x - current.start.x, p.y - current.start.y) >= 3) {
      onCamera({
        ...current.camera,
        x: current.camera.x + p.x - current.start.x,
        y: current.camera.y + p.y - current.start.y,
      });
    } else if (editing && !pending) onSelect([]);
  }
  return {
    containerRef,
    worldRef,
    registry,
    cancel,
    isInteracting: () => gesture.current !== null,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.code === "Space" && e.target === containerRef.current) {
          space.current = true;
          e.preventDefault();
        }
      },
      onKeyUp: (e: React.KeyboardEvent) => {
        if (e.code === "Space") space.current = false;
      },
      onBlur: () => {
        space.current = false;
      },
    },
  };
}
