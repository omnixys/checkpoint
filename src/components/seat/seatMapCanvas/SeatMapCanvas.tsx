"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SeatMapViewQuery } from "@/checkpoint/generated/graphql";
import type { SeatListQuery } from "@/checkpoint/generated/graphql";
import { Box, Chip, IconButton, LinearProgress, Stack, Tooltip } from "@mui/material";
import { ZoomIn, ZoomOut, FitScreen } from "@mui/icons-material";
import SeatNode from "./SeatNode";
import type { SelectedItem } from "./SeatMapEditorToolbar";

type Props = {
  sections: SeatMapViewQuery["seatLayout"];
  presenceMap: Map<string, NonNullable<SeatMapViewQuery["seatPresencesByEvent"]>[number]>;
  seats: SeatListQuery["seats"];
  seatGuestMap: Map<string, string>;
  getSeatHolderLabel: (seat: SeatListQuery["seats"][number]) => string;
  loading: boolean;
  eventId: string;
  role: string;
  highlightedSeatIds?: Set<string> | undefined;
  ownSeatIds?: Set<string> | undefined;

  // Editor props
  isEditing?: boolean;
  selectedItems?: SelectedItem[];
  onSelectItem?: (items: SelectedItem[]) => void;
  onMoveSeat?: (seatId: string, x: number, y: number) => void;
  onMoveTable?: (tableId: string, x: number, y: number) => void;
  onMoveSection?: (sectionId: string, x: number, y: number) => void;
};

type DragState = {
  type: "section" | "table" | "seat";
  id: string;
  startMouseX: number;
  startMouseY: number;
  startX: number;
  startY: number;
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;

function isSelected(selectedItems: SelectedItem[] | undefined, type: SelectedItem["type"], id: string): boolean {
  if (!selectedItems) return false;
  return selectedItems.some((s) => s.type === type && s.id === id);
}

export default function SeatMapCanvas({
  sections,
  presenceMap,
  seats,
  seatGuestMap,
  getSeatHolderLabel,
  loading,
  highlightedSeatIds,
  ownSeatIds,
  isEditing = false,
  selectedItems,
  onSelectItem,
  onMoveSeat,
  onMoveTable,
  onMoveSection,
  role,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  const hasFilter = highlightedSeatIds !== undefined;

  const occupiedSeatIds = useMemo(
    () => new Set(seats?.filter((s) => s.guestId || s.invitationId).map((s) => s.id) ?? []),
    [seats],
  );

  const ownerMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of seats ?? []) {
      if (s.guestId || s.invitationId) {
        map.set(s.id, getSeatHolderLabel(s));
      }
    }
    return map;
  }, [seats, getSeatHolderLabel]);

  const bounds = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const section of sections) {
      if (section.x != null && section.y != null) {
        minX = Math.min(minX, section.x);
        minY = Math.min(minY, section.y);
        maxX = Math.max(maxX, section.x + (section.width ?? 400));
        maxY = Math.max(maxY, section.y + (section.height ?? 300));
      }
      for (const table of section.tables ?? []) {
        if (table.x != null && table.y != null) {
          const tw = table.width ?? 120;
          const th = table.height ?? 80;
          minX = Math.min(minX, table.x);
          minY = Math.min(minY, table.y);
          maxX = Math.max(maxX, table.x + tw);
          maxY = Math.max(maxY, table.y + th);
        }
        for (const seat of table.seats ?? []) {
          if (seat.x != null && seat.y != null) {
            minX = Math.min(minX, seat.x);
            minY = Math.min(minY, seat.y);
            maxX = Math.max(maxX, seat.x + 30);
            maxY = Math.max(maxY, seat.y + 30);
          }
        }
      }
      for (const seat of section.seats ?? []) {
        if (seat.x != null && seat.y != null) {
          minX = Math.min(minX, seat.x);
          minY = Math.min(minY, seat.y);
          maxX = Math.max(maxX, seat.x + 30);
          maxY = Math.max(maxY, seat.y + 30);
        }
      }
    }
    if (!isFinite(minX)) return null;
    return { minX, minY, width: maxX - minX + 60, height: maxY - minY + 60 };
  }, [sections]);

  const fitToScreen = useCallback(() => {
    if (!bounds || !containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;
    const sx = cw / bounds.width;
    const sy = ch / bounds.height;
    const s = Math.min(sx, sy) * 0.9;
    setScale(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s)));
    setTranslate({
      x: (cw - bounds.width * s) / 2 - bounds.minX * s,
      y: (ch - bounds.height * s) / 2 - bounds.minY * s,
    });
  }, [bounds]);

  useEffect(() => {
    if (sections.length > 0 && bounds) {
      fitToScreen();
    }
  }, [sections, bounds, fitToScreen]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setScale((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
    }
  }, []);

  // ── Drag handling ──

  const onItemMouseDown = useCallback(
    (e: React.MouseEvent, type: DragState["type"], id: string, currentX: number, currentY: number) => {
      if (!isEditing) return;
      e.stopPropagation();
      e.preventDefault();
      setDragState({ type, id, startMouseX: e.clientX, startMouseY: e.clientY, startX: currentX, startY: currentY });
      setDragOffset({ x: 0, y: 0 });
    },
    [isEditing],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (dragState) return;

      setDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      translateStart.current = { x: translate.x, y: translate.y };
    },
    [translate, dragState],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragState) {
        const dx = (e.clientX - dragState.startMouseX) / scale;
        const dy = (e.clientY - dragState.startMouseY) / scale;
        setDragOffset({ x: dx, y: dy });
        return;
      }
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTranslate({
        x: translateStart.current.x + dx,
        y: translateStart.current.y + dy,
      });
    },
    [dragging, dragState, scale],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);

    if (dragState) {
      const newX = dragState.startX + dragOffset.x;
      const newY = dragState.startY + dragOffset.y;
      if (dragState.type === "seat" && onMoveSeat) {
        onMoveSeat(dragState.id, newX, newY);
      } else if (dragState.type === "table" && onMoveTable) {
        onMoveTable(dragState.id, newX, newY);
      } else if (dragState.type === "section" && onMoveSection) {
        onMoveSection(dragState.id, newX, newY);
      }
      setDragState(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [dragState, dragOffset, onMoveSeat, onMoveTable, onMoveSection]);

  const handleItemClick = useCallback(
    (e: React.MouseEvent, type: SelectedItem["type"], id: string, name: string, sectionId?: string) => {
      if (!isEditing || !onSelectItem) return;
      e.stopPropagation();

      const item: SelectedItem =
        type === "section"
          ? { type: "section", id, name }
          : type === "table"
            ? { type: "table", id, name, sectionId: sectionId ?? "" }
            : { type: "seat", id, label: name };

      if (e.ctrlKey || e.metaKey) {
        const current = selectedItems ?? [];
        const exists = current.some((s) => s.type === item.type && s.id === item.id);
        if (exists) {
          onSelectItem(current.filter((s) => !(s.type === item.type && s.id === item.id)));
        } else {
          onSelectItem([...current, item]);
        }
      } else {
        onSelectItem([item]);
      }
    },
    [isEditing, onSelectItem, selectedItems],
  );

  const handleZoomIn = () => setScale((p) => Math.min(MAX_ZOOM, p + ZOOM_STEP));
  const handleZoomOut = () => setScale((p) => Math.max(MIN_ZOOM, p - ZOOM_STEP));

  if (loading) {
    return <LinearProgress />;
  }

  if (!sections || sections.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "text.secondary",
        }}
      >
        Kein Sitzplan vorhanden.
      </Box>
    );
  }

  const isDraggingItem = dragState !== null;

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "hidden",
        position: "relative",
        bgcolor: "action.hover",
        cursor: isDraggingItem ? "grabbing" : dragging ? "grabbing" : isEditing ? "default" : "grab",
        userSelect: "none",
      }}
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom controls */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 60,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 0.5,
        }}
      >
        <Tooltip title="Vergrössern">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomIn fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Verkleinern">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOut fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="An Fenster anpassen">
          <IconButton size="small" onClick={fitToScreen}>
            <FitScreen fontSize="small" />
          </IconButton>
        </Tooltip>
        <Chip
          label={`${Math.round(scale * 100)}%`}
          size="small"
          variant="outlined"
          sx={{ height: 28 }}
        />
      </Stack>

      {/* Edit mode indicator */}
      {isEditing && (
        <Box
          sx={{
            position: "absolute",
            top: 72,
            right: 16,
            zIndex: 60,
            bgcolor: "warning.main",
            color: "warning.contrastText",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Bearbeitungsmodus
        </Box>
      )}

      {/* Canvas content */}
      <Box
        sx={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {sections.map((section) => {
          const sectionDragOffset =
            dragState?.type === "section" && dragState.id === section.id
              ? dragOffset
              : { x: 0, y: 0 };

          const sectionX = (section.x ?? 0) + sectionDragOffset.x;
          const sectionY = (section.y ?? 0) + sectionDragOffset.y;
          const sectionSelected = isSelected(selectedItems, "section", section.id);

          return (
            <Box
              key={section.id}
              sx={{
                position: "absolute",
                left: sectionX,
                top: sectionY,
                width: section.width ?? 400,
                height: section.height ?? 300,
                border: "2px solid",
                borderColor: sectionSelected ? "primary.main" : "divider",
                borderRadius: 2,
                bgcolor: isEditing ? "action.hover" : "background.default",
                opacity: hasFilter ? 0.6 : 1,
                transition: "opacity 0.2s",
                cursor: isEditing ? "move" : undefined,
              }}
              onMouseDown={(e) => {
                if (isEditing) {
                  onItemMouseDown(e, "section", section.id, section.x ?? 0, section.y ?? 0);
                }
              }}
              onClick={(e) => {
                handleItemClick(e, "section", section.id, section.name);
              }}
            >
              {/* Section name */}
              <Box
                sx={{
                  position: "absolute",
                  top: -24,
                  left: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                }}
              >
                {section.name}
              </Box>

              {/* Tables */}
              {section.tables?.map((table) => {
                const tableDragOffset =
                  dragState?.type === "table" && dragState.id === table.id
                    ? dragOffset
                    : { x: 0, y: 0 };
                const tableX = (table.x ?? 0) + tableDragOffset.x;
                const tableY = (table.y ?? 0) + tableDragOffset.y;
                const tableSelected = isSelected(selectedItems, "table", table.id);

                return (
                  <Box
                    key={table.id}
                    sx={{
                      position: "absolute",
                      left: tableX,
                      top: tableY,
                      width: table.width ?? 120,
                      height: table.height ?? 60,
                      border: "2px solid",
                      borderColor: tableSelected ? "primary.main" : "grey.500",
                      borderRadius: table.shape === "ROUND" ? "50%" : 1,
                      bgcolor: isEditing ? "action.focus" : "action.selected",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "text.secondary",
                      cursor: isEditing ? "move" : undefined,
                    }}
                    onMouseDown={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                        onItemMouseDown(e, "table", table.id, table.x ?? 0, table.y ?? 0);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(e, "table", table.id, table.name, section.id);
                    }}
                  >
                    {table.name}
                  </Box>
                );
              })}

              {/* Seats (floating) */}
              {section.seats?.map((seat) => renderSeat(seat, section.id))}

              {/* Seats (attached to tables) */}
              {section.tables?.map((table) =>
                table.seats?.map((seat) => renderSeat(seat, section.id)),
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  function renderSeat(seat: SeatMapViewQuery["seatLayout"][number]["seats"][number], sectionId: string) {
    const isDraggingSeat = dragState?.type === "seat" && dragState.id === seat.id;
    const seatDragOffset = isDraggingSeat ? dragOffset : { x: 0, y: 0 };
    const seatX = (seat.x ?? 0) + seatDragOffset.x;
    const seatY = (seat.y ?? 0) + seatDragOffset.y;
    const seatSelected = isSelected(selectedItems, "seat", seat.id);

    return (
      <SeatNode
        key={seat.id}
        seatId={seat.id}
        seatNumber={seat.number}
        x={seatX}
        y={seatY}
        rotation={seat.rotation}
        presence={presenceMap.get(seat.id) ?? null}
        isOccupied={occupiedSeatIds.has(seat.id)}
        occupantName={ownerMap.get(seat.id) ?? undefined}
        highlighted={hasFilter ? highlightedSeatIds?.has(seat.id) ?? false : undefined}
        role={role}
        isOwnSeat={ownSeatIds?.has(seat.id) ?? false}
        isEditing={isEditing}
        isSelected={seatSelected}
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation();
            onItemMouseDown(e, "seat", seat.id, seat.x ?? 0, seat.y ?? 0);
          }
        }}
        onClick={(e) => {
          handleItemClick(e, "seat", seat.id, seat.number?.toString() ?? "?");
        }}
      />
    );
  }
}
