"use client";

import { FitScreen, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SeatListQuery, SeatMapViewQuery } from "@/checkpoint/generated/graphql";
import {
  type LayoutDocument,
  type LayoutNode,
  type MoveOperation,
  orderedNodes,
} from "./core/document";
import { type Camera, clientToScreen, fitCamera, zoomCamera } from "./core/geometry";
import SeatMapDebugOverlay from "./SeatMapDebugOverlay";
import SeatNode from "./SeatNode";
import { cameraTransform, nodeTransform, useSeatMapInteraction } from "./useSeatMapInteraction";

type Presence = NonNullable<SeatMapViewQuery["seatPresencesByEvent"]>[number];
type ColorGroup = SeatMapViewQuery["seatLayout"][number]["seats"][number]["colorGroup"];
interface Props {
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
  pending: boolean;
}
const Body = memo(function Body({
  node,
  selected,
  editing,
  onSelect,
}: {
  node: Exclude<LayoutNode, { kind: "SEAT" }>;
  selected: boolean;
  editing: boolean;
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
        bgcolor: node.kind === "SECTION" ? "background.default" : "action.selected",
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
  pending,
}: Props) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 }),
    [showDebug, setShowDebug] = useState(false);
  const interaction = useSeatMapInteraction({
    document,
    camera,
    editing: isEditing,
    pending,
    onSelect,
    onMove,
    onCamera: setCamera,
  });
  const { containerRef, worldRef, registry, handlers, cancel } = interaction;
  const fitEvent = useRef<string | null>(null),
    currentDocument = useRef(document);
  currentDocument.current = document;
  const nodes = useMemo(() => orderedNodes(document), [document]);
  const visible = useMemo(() => nodes.filter((n) => n.kind !== "SEAT" || !n.hidden), [nodes]);
  const ordered = useMemo(
    () =>
      [...visible].sort(
        (a, b) =>
          ({ SECTION: 0, TABLE: 1, SEAT: 2 })[a.kind] - { SECTION: 0, TABLE: 1, SEAT: 2 }[b.kind],
      ),
    [visible],
  );
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);
  const seatMap = useMemo(() => new Map(seats.map((s) => [s.id, s])), [seats]);
  const fitView = useCallback(() => {
    const container = containerRef.current;
    if (!container?.clientWidth || !container.clientHeight) return;
    cancel();
    setCamera(
      fitCamera(
        orderedNodes(currentDocument.current).filter((n) => n.kind !== "SEAT" || !n.hidden),
        { width: container.clientWidth, height: container.clientHeight },
      ),
    );
    fitEvent.current = currentDocument.current.eventId;
  }, [containerRef, cancel]);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const initialFit = () => {
      if (document.order.length && fitEvent.current !== document.eventId) fitView();
    };
    initialFit();
    const observer = new ResizeObserver(initialFit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, fitView, document.eventId, document.order.length]);
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
      {!nodes.length && (
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
        {ordered.map((n) => {
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
                transform: nodeTransform(n),
                transformOrigin: "0 0",
              }}
            >
              {n.kind === "SEAT" ? (
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
              ) : (
                <Body
                  node={n}
                  selected={selected.has(n.id)}
                  editing={isEditing && !pending}
                  onSelect={onSelect}
                />
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
    </Box>
  );
}
