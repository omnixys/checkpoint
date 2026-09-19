"use client";

import { FitScreen, RotateRight, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { memo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SeatListQuery, SeatMapViewQuery } from "@/checkpoint/generated/graphql";
import {
  type LayoutDocument,
  type LayoutNode,
  type MoveOperation,
  orderedNodes,
  type ResizeOperation,
  type RotateOperation,
  resizeNode,
  rotateNode,
  scaleNodes,
  selectionBounds,
} from "./core/document";
import { type Camera, clientToScreen, fitCamera, zoomCamera } from "./core/geometry";
import SeatMapDebugOverlay from "./SeatMapDebugOverlay";
import SeatNode from "./SeatNode";
import { cameraTransform, nodeTransform, useSeatMapInteraction } from "./useSeatMapInteraction";

type Presence = NonNullable<SeatMapViewQuery["seatPresencesByEvent"]>[number];
type ColorGroup = SeatMapViewQuery["seatLayout"][number]["seats"][number]["colorGroup"];
export interface WorldBackground {
  url: string;
  width: number;
  height: number;
  opacity: number;
  visible: boolean;
}
interface Props {
  worldBackground?: WorldBackground | undefined;
  showObjects?: boolean;
  document: LayoutDocument;
  presenceMap: Map<string, Presence>;
  colorGroups: ReadonlyMap<string, ColorGroup>;
  seats: SeatListQuery["seats"];
  getSeatHolderLabel: (seat: SeatListQuery["seats"][number]) => string;
  role: string;
  highlightedSeatIds?: Set<string> | undefined;
  ownSeatIds?: Set<string> | undefined;
  isEditing: boolean;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onMove: (operation: MoveOperation) => void;
  onResize?: (operation: ResizeOperation) => void;
  onRotate?: (operation: RotateOperation) => void;
  pending: boolean;
  editorToolbar?: ReactNode;
}
const Body = memo(function Body({
  node,
  selected,
  editing,
  transparent = false,
  onSelect,
}: {
  node: Exclude<LayoutNode, { kind: "SEAT" }>;
  selected: boolean;
  editing: boolean;
  transparent?: boolean;
  onSelect: (ids: string[]) => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={`${node.kind === "SECTION" ? "Bereich" : "Tisch"} ${node.name}`}
      aria-pressed={editing ? selected : undefined}
      onClick={(e) => {
        if (editing && e.detail === 0) onSelect([node.id]);
      }}
      sx={{
        position: "absolute",
        left: -node.width / 2,
        top: -node.height / 2,
        width: node.width,
        height: node.height,
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        borderRadius: ["ROUND", "CIRCLE", "OVAL"].includes(node.shape) ? "50%" : 1,
        bgcolor:
          node.kind === "SECTION"
            ? transparent
              ? "transparent"
              : "background.default"
            : "action.selected",
        color: "text.secondary",
        typography: "caption",
        fontWeight: 500,
        cursor: editing ? "move" : "default",
        p: 0,
        "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: 2 },
      }}
    >
      <Typography
        component="span"
        variant="caption"
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...(node.kind === "SECTION"
            ? { position: "absolute", top: -24, left: 8, maxWidth: "100%" }
            : { px: 1 }),
        }}
      >
        {node.name}
      </Typography>
    </Box>
  );
});
export default function SeatMapCanvas({
  document,
  presenceMap,
  colorGroups,
  seats,
  getSeatHolderLabel,
  role,
  highlightedSeatIds,
  ownSeatIds,
  isEditing,
  selectedIds,
  onSelect,
  onMove,
  onResize,
  onRotate,
  pending,
  editorToolbar,
  worldBackground,
  showObjects = true,
}: Props) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 }),
    [showDebug, setShowDebug] = useState(false);
  const interaction = useSeatMapInteraction({
    document,
    camera,
    editing: isEditing,
    pending,
    selectedIds,
    onSelect,
    onMove,
    onCamera: setCamera,
  });
  const { containerRef, worldRef, registry, handlers, cancel } = interaction;
  const backgroundRef = useRef(worldBackground);
  backgroundRef.current = worldBackground;
  const fitEvent = useRef<string | null>(null),
    currentDocument = useRef(document);
  currentDocument.current = document;
  const nodes = useMemo(() => orderedNodes(document), [document]);
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const [resizing, setResizing] = useState<{
    nodeId: string;
    pointerId: number;
    start: { x: number; y: number };
    before: LayoutDocument;
    after: LayoutDocument;
  } | null>(null);
  const [rotating, setRotating] = useState<{
    nodeId: string;
    pointerId: number;
    lastAngle: number;
    delta: number;
    before: LayoutDocument;
    after: LayoutDocument;
  } | null>(null);
  const [groupScaling, setGroupScaling] = useState<{
    pointerId: number;
    start: { x: number; y: number };
    bounds: NonNullable<ReturnType<typeof selectionBounds>>;
    before: LayoutDocument;
    after: LayoutDocument;
  } | null>(null);
  const seatMap = useMemo(() => new Map(seats.map((s) => [s.id, s])), [seats]);
  const fitView = useCallback(() => {
    const container = containerRef.current;
    if (!container?.clientWidth || !container.clientHeight) return;
    cancel();
    setCamera(
      fitCamera(
        [
          ...orderedNodes(currentDocument.current).filter((n) => n.kind !== "SEAT" || !n.hidden),
          ...(backgroundRef.current
            ? [
                {
                  x: backgroundRef.current.width / 2,
                  y: backgroundRef.current.height / 2,
                  width: backgroundRef.current.width,
                  height: backgroundRef.current.height,
                  rotation: 0,
                },
              ]
            : []),
        ],
        { width: container.clientWidth, height: container.clientHeight },
      ),
    );
    fitEvent.current = currentDocument.current.eventId;
  }, [containerRef, cancel]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const initialFit = () => {
      if ((document.order.length || worldBackground) && fitEvent.current !== document.eventId)
        fitView();
    };
    initialFit();
    const observer = new ResizeObserver(initialFit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, fitView, document.eventId, document.order.length, worldBackground]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        isEditing &&
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "d" &&
        containerRef.current?.contains(e.target as Node)
      ) {
        e.preventDefault();
        setShowDebug((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [containerRef, isEditing]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      cancel();
      const anchor = clientToScreen({ x: e.clientX, y: e.clientY }, el.getBoundingClientRect());
      setCamera((c) => zoomCamera(c, c.scale * Math.exp(-e.deltaY * 0.002), anchor));
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [containerRef, cancel]);
  const zoom = (factor: number) => {
    cancel();
    const el = containerRef.current;
    if (el)
      setCamera((c) =>
        zoomCamera(c, c.scale * factor, { x: el.clientWidth / 2, y: el.clientHeight / 2 }),
      );
  };
  const resizeStart = (event: React.PointerEvent<HTMLButtonElement>, node: LayoutNode) => {
    if (pending) return;
    event.stopPropagation();
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setResizing({
      nodeId: node.id,
      pointerId: event.pointerId,
      start: clientToScreen({ x: event.clientX, y: event.clientY }, bounds),
      before: document,
      after: document,
    });
  };
  const resizeMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizing || event.pointerId !== resizing.pointerId) return;
    const bounds = containerRef.current?.getBoundingClientRect();
    const before = resizing.before.nodes[resizing.nodeId];
    if (!bounds || !before) return;
    const current = clientToScreen({ x: event.clientX, y: event.clientY }, bounds);
    const worldDeltaX = (current.x - resizing.start.x) / camera.scale;
    const worldDeltaY = (current.y - resizing.start.y) / camera.scale;
    // Express the pointer delta in the node's own (rotated) axes so the dragged
    // corner follows the cursor even when the node is turned.
    const radians = (-before.rotation * Math.PI) / 180;
    const localDeltaX = worldDeltaX * Math.cos(radians) - worldDeltaY * Math.sin(radians);
    const localDeltaY = worldDeltaX * Math.sin(radians) + worldDeltaY * Math.cos(radians);
    setResizing((active) =>
      active
        ? {
            ...active,
            after: resizeNode(
              active.before,
              active.nodeId,
              before.width + localDeltaX,
              before.height + localDeltaY,
            ),
          }
        : active,
    );
  };
  const resizeFinish = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!resizing || event.pointerId !== resizing.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const operation = resizing.after === resizing.before ? null : resizing;
    setResizing(null);
    if (operation)
      onResize?.({ nodeId: operation.nodeId, before: operation.before, after: operation.after });
  };
  const resizeByKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>, node: LayoutNode) => {
    if (pending) return;
    const step = event.shiftKey ? 80 : 20;
    const width =
      node.width + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0);
    const height =
      node.height + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0);
    if (width === node.width && height === node.height) return;
    event.preventDefault();
    const after = resizeNode(document, node.id, width, height);
    if (after !== document) onResize?.({ nodeId: node.id, before: document, after });
  };
  const screenToWorld = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const screen = clientToScreen({ x: event.clientX, y: event.clientY }, bounds);
    return { x: (screen.x - camera.x) / camera.scale, y: (screen.y - camera.y) / camera.scale };
  };
  const rotateStart = (event: React.PointerEvent<HTMLButtonElement>, node: LayoutNode) => {
    if (pending) return;
    event.stopPropagation();
    const point = screenToWorld(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const angle = Math.atan2(point.y - node.y, point.x - node.x) * (180 / Math.PI);
    setRotating({
      nodeId: node.id,
      pointerId: event.pointerId,
      lastAngle: angle,
      delta: 0,
      before: document,
      after: document,
    });
  };
  const rotateMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!rotating || event.pointerId !== rotating.pointerId) return;
    const node = rotating.before.nodes[rotating.nodeId];
    const point = screenToWorld(event);
    if (!node || !point) return;
    const angle = Math.atan2(point.y - node.y, point.x - node.x) * (180 / Math.PI);
    let step = angle - rotating.lastAngle;
    step =
      Math.atan2(Math.sin((step * Math.PI) / 180), Math.cos((step * Math.PI) / 180)) *
      (180 / Math.PI);
    setRotating((active) =>
      active
        ? {
            ...active,
            lastAngle: angle,
            delta: active.delta + step,
            after: rotateNode(active.before, active.nodeId, node.rotation + active.delta + step),
          }
        : active,
    );
  };
  const rotateFinish = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!rotating || event.pointerId !== rotating.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const operation = rotating.after === rotating.before ? null : rotating;
    setRotating(null);
    if (operation)
      onRotate?.({ nodeId: operation.nodeId, before: operation.before, after: operation.after });
  };
  const rotateByKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>, node: LayoutNode) => {
    if (pending) return;
    const step = event.shiftKey ? 45 : 5;
    const rotation =
      node.rotation + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0);
    if (rotation === node.rotation) return;
    event.preventDefault();
    const after = rotateNode(document, node.id, rotation);
    if (after !== document) onRotate?.({ nodeId: node.id, before: document, after });
  };
  const groupBounds = useMemo(
    () => (selectedIds.length > 1 ? selectionBounds(document, selectedIds) : null),
    [document, selectedIds],
  );
  const groupScaleStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!groupBounds || pending) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setGroupScaling({
      pointerId: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      bounds: groupBounds,
      before: document,
      after: document,
    });
  };
  const groupScaleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!groupScaling || event.pointerId !== groupScaling.pointerId) return;
    const sx = Math.max(
      0.1,
      (groupScaling.bounds.width + (event.clientX - groupScaling.start.x) / camera.scale) /
        groupScaling.bounds.width,
    );
    const sy = Math.max(
      0.1,
      (groupScaling.bounds.height + (event.clientY - groupScaling.start.y) / camera.scale) /
        groupScaling.bounds.height,
    );
    setGroupScaling((active) =>
      active ? { ...active, after: scaleNodes(active.before, selectedIds, sx, sy) } : active,
    );
  };
  const groupScaleFinish = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!groupScaling || event.pointerId !== groupScaling.pointerId) return;
    const operation = groupScaling.after === groupScaling.before ? null : groupScaling;
    setGroupScaling(null);
    if (operation)
      onResize?.({ nodeId: selectedIds[0]!, before: operation.before, after: operation.after });
  };
  const kindName = (node: LayoutNode) =>
    node.kind === "SECTION" ? "Bereich" : node.kind === "TABLE" ? "Tisch" : "Sitz";
  const displayNodes = useMemo(
    () => orderedNodes(groupScaling?.after ?? rotating?.after ?? resizing?.after ?? document),
    [document, groupScaling?.after, resizing?.after, rotating?.after],
  );
  const resizeHandle = (node: LayoutNode) => (
    <Box
      component="button"
      type="button"
      aria-label={`${kindName(node)} ${node.kind === "SEAT" ? String(node.number ?? "") : node.name} vergrößern`}
      onPointerDown={(event) => resizeStart(event, node)}
      onPointerMove={resizeMove}
      onPointerUp={resizeFinish}
      onPointerCancel={() => setResizing(null)}
      onKeyDown={(event) => resizeByKeyboard(event, node)}
      sx={{
        position: "absolute",
        width: 20,
        height: 20,
        right: -node.width / 2 - 10,
        bottom: -node.height / 2 - 10,
        borderRadius: "50%",
        border: 2,
        borderColor: "background.paper",
        bgcolor: "primary.main",
        cursor: "nwse-resize",
        p: 0,
        zIndex: 2,
        opacity: pending ? 0.4 : 1,
        pointerEvents: pending ? "none" : "auto",
        "&:focus-visible": {
          outline: 2,
          outlineColor: "primary.main",
          outlineOffset: 3,
        },
      }}
    />
  );
  const rotateHandle = (node: LayoutNode) => (
    <Box
      component="button"
      type="button"
      aria-label={`${kindName(node)} ${node.kind === "SEAT" ? String(node.number ?? "") : node.name} drehen`}
      onPointerDown={(event) => rotateStart(event, node)}
      onPointerMove={rotateMove}
      onPointerUp={rotateFinish}
      onPointerCancel={() => setRotating(null)}
      onKeyDown={(event) => rotateByKeyboard(event, node)}
      sx={{
        position: "absolute",
        width: 20,
        height: 20,
        right: -node.width / 2 - 10,
        top: -node.height / 2 - 10,
        borderRadius: "50%",
        border: 2,
        borderColor: "background.paper",
        bgcolor: "secondary.main",
        cursor: "crosshair",
        p: 0,
        zIndex: 2,
        display: "grid",
        placeItems: "center",
        "&:focus-visible": {
          outline: 2,
          outlineColor: "secondary.main",
          outlineOffset: 3,
        },
      }}
    >
      <RotateRight fontSize="small" sx={{ fontSize: 16 }} />
    </Box>
  );
  return (
    <Box
      ref={containerRef}
      {...handlers}
      tabIndex={0}
      role="region"
      aria-label={isEditing ? "Sitzplan bearbeiten" : "Sitzplan ansehen"}
      data-testid="seatmap-canvas"
      aria-busy={pending}
      sx={{
        flexGrow: 1,
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        position: "relative",
        bgcolor: "action.hover",
        userSelect: "none",
        touchAction: "none",
        cursor: isEditing ? "default" : "grab",
        "&:focus-visible": { outline: 2, outlineColor: "primary.main", outlineOffset: -2 },
      }}
    >
      <Stack
        data-camera-control
        direction="row"
        spacing={0.5}
        sx={{
          position: "absolute",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
          zIndex: 60,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 0.5,
        }}
      >
        <Tooltip title="Vergrößern">
          <IconButton size="small" aria-label="Zoom in" onClick={() => zoom(1.2)}>
            <ZoomIn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Verkleinern">
          <IconButton size="small" aria-label="Zoom out" onClick={() => zoom(1 / 1.2)}>
            <ZoomOut fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="An Fenster anpassen">
          <IconButton size="small" aria-label="Fit to screen" onClick={fitView}>
            <FitScreen fontSize="small" />
          </IconButton>
        </Tooltip>
        <Chip label={`${Math.round(camera.scale * 100)}%`} size="small" variant="outlined" />
      </Stack>
      {!nodes.length && !worldBackground && (
        <Box
          sx={{ height: "100%", display: "grid", placeItems: "center", color: "text.secondary" }}
        >
          Kein Sitzplan vorhanden.
        </Box>
      )}
      <Box
        ref={worldRef}
        data-testid="seatmap-world"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: cameraTransform(camera),
          transformOrigin: "0 0",
        }}
      >
        {groupBounds && (
          <Box
            sx={{
              position: "absolute",
              left: groupBounds.left,
              top: groupBounds.top,
              width: groupBounds.width,
              height: groupBounds.height,
              border: 2,
              borderColor: "primary.main",
              pointerEvents: "none",
              zIndex: 30,
            }}
          >
            <Box
              component="button"
              type="button"
              aria-label="Auswahl proportional skalieren"
              onPointerDown={groupScaleStart}
              onPointerMove={groupScaleMove}
              onPointerUp={groupScaleFinish}
              sx={{
                pointerEvents: "auto",
                position: "absolute",
                right: -10,
                bottom: -10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: 2,
                borderColor: "background.paper",
                bgcolor: "primary.main",
                cursor: "nwse-resize",
              }}
            />
          </Box>
        )}
        {worldBackground?.visible && (
          <Box
            component="img"
            src={worldBackground.url}
            alt="Temporäre Planvorlage"
            draggable={false}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: worldBackground.width,
              height: worldBackground.height,
              opacity: worldBackground.opacity,
              pointerEvents: "none",
            }}
          />
        )}
        {showObjects &&
          displayNodes.map((n) => {
            const seat = seatMap.get(n.id),
              occupied = Boolean(seat?.guestId || seat?.invitationId);
            return (
              <Box
                key={n.id}
                ref={(element: HTMLDivElement | null) => {
                  if (element) registry.current.set(n.id, element);
                  else registry.current.delete(n.id);
                }}
                data-node-id={n.id}
                data-testid={`${n.kind.toLowerCase()}-${n.id}`}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: n.width,
                  height: n.height,
                  transform: nodeTransform(n),
                  transformOrigin: "0 0",
                }}
              >
                {n.kind === "SEAT" ? (
                  <>
                    <SeatNode
                      seatId={n.id}
                      seatNumber={n.number}
                      x={0}
                      y={0}
                      rotation={0}
                      width={n.width}
                      height={n.height}
                      shape={n.shape}
                      presence={presenceMap.get(n.id) ?? null}
                      isOccupied={occupied}
                      occupantName={occupied && seat ? getSeatHolderLabel(seat) : undefined}
                      isOwnSeat={ownSeatIds?.has(n.id)}
                      highlighted={highlightedSeatIds ? highlightedSeatIds.has(n.id) : undefined}
                      role={role}
                      colorGroup={colorGroups.get(n.id)}
                      isEditing={isEditing}
                      isSelected={selected.has(n.id)}
                      onClick={(e) => {
                        if (!pending && e.detail === 0) onSelect([n.id]);
                      }}
                    />
                    {isEditing && selected.has(n.id) && (
                      <>
                        {resizeHandle(n)}
                        {rotateHandle(n)}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Body
                      node={n}
                      transparent={Boolean(worldBackground?.visible)}
                      selected={selected.has(n.id)}
                      editing={isEditing && !pending}
                      onSelect={onSelect}
                    />
                    {isEditing && selected.has(n.id) && (
                      <>
                        {resizeHandle(n)}
                        {rotateHandle(n)}
                      </>
                    )}
                  </>
                )}
              </Box>
            );
          })}
      </Box>
      {isEditing && (
        <SeatMapDebugOverlay
          document={document}
          camera={camera}
          selectedIds={selectedIds}
          visible={showDebug}
          onToggle={() => setShowDebug((v) => !v)}
        />
      )}
      {editorToolbar && (
        <Box sx={{ position: "absolute", top: 52, left: 1, zIndex: 69 }}>{editorToolbar}</Box>
      )}
    </Box>
  );
}
