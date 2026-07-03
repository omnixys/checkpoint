"use client";

import { BugReport } from "@mui/icons-material";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import React from "react";
import type { SeatMapViewQuery } from "@/checkpoint/generated/graphql";
import type { SelectedItem } from "./SeatMapEditorToolbar";

interface Props {
  sections: SeatMapViewQuery["seatLayout"];
  scale: number;
  translate: { x: number; y: number };
  mouseCanvasPos: { x: number; y: number };
  selectedItems: SelectedItem[] | undefined;
  visible: boolean;
  onToggle: () => void;
}

type Section = SeatMapViewQuery["seatLayout"][number];
type Table = NonNullable<Section["tables"]>[number];

function findSectionAtPoint(
  sections: SeatMapViewQuery["seatLayout"],
  cx: number,
  cy: number,
): { section: Section; relX: number; relY: number } | null {
  for (const sec of sections) {
    const sw = sec.width ?? 400;
    const sh = sec.height ?? 300;
    const halfW = sw / 2;
    const halfH = sh / 2;
    if (cx >= sec.x - halfW && cx <= sec.x + halfW && cy >= sec.y - halfH && cy <= sec.y + halfH) {
      return { section: sec, relX: cx - sec.x, relY: cy - sec.y };
    }
  }
  return null;
}

function findTableAtPoint(
  section: Section,
  cx: number,
  cy: number,
): { table: Table; relX: number; relY: number } | null {
  for (const tbl of section.tables ?? []) {
    const tw = tbl.width ?? 120;
    const th = tbl.height ?? 60;
    const tx = (section.x ?? 0) + (tbl.x ?? 0);
    const ty = (section.y ?? 0) + (tbl.y ?? 0);
    if (cx >= tx - tw / 2 && cx <= tx + tw / 2 && cy >= ty - th / 2 && cy <= ty + th / 2) {
      return { table: tbl, relX: cx - tx, relY: cy - ty };
    }
  }
  return null;
}

export default function SeatMapDebugOverlay({
  sections,
  scale,
  translate,
  mouseCanvasPos,
  selectedItems,
  visible,
  onToggle,
}: Props) {
  const sectionHover = React.useMemo(
    () => findSectionAtPoint(sections, mouseCanvasPos.x, mouseCanvasPos.y),
    [sections, mouseCanvasPos],
  );
  const tableHover = React.useMemo(
    () =>
      sectionHover
        ? findTableAtPoint(sectionHover.section, mouseCanvasPos.x, mouseCanvasPos.y)
        : null,
    [sectionHover, mouseCanvasPos],
  );

  if (!visible) {
    return (
      <Tooltip title="Debug-Overlay einblenden (Ctrl+Shift+D)">
        <IconButton
          size="small"
          onClick={onToggle}
          data-testid="debug-toggle"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 70,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <BugReport fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Stack
      spacing={0.5}
      sx={{
        position: "absolute",
        top: 8,
        left: 8,
        zIndex: 70,
        maxWidth: 360,
        minWidth: 260,
        bgcolor: "rgba(0,0,0,0.82)",
        color: "limegreen",
        fontFamily: "monospace",
        fontSize: 11,
        borderRadius: 1.5,
        p: 1,
        boxShadow: 4,
        backdropFilter: "blur(4px)",
      }}
    >
      {/* Header */}
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Chip
          label="DEBUG"
          size="small"
          color="warning"
          sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
        />
        <IconButton size="small" onClick={onToggle} sx={{ color: "limegreen", p: 0.3 }}>
          <BugReport fontSize="small" />
        </IconButton>
      </Stack>

      {/* Transform */}
      <Box>scale: {scale.toFixed(3)}</Box>
      <Box>
        pan: ({translate.x.toFixed(1)}, {translate.y.toFixed(1)})
      </Box>

      {/* Mouse */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 0.5, mt: 0.5 }}>
        <Box sx={{ fontWeight: 700, color: "cyan", mb: 0.25 }}>MOUSE</Box>
        <Box>
          canvas: ({mouseCanvasPos.x.toFixed(1)}, {mouseCanvasPos.y.toFixed(1)})
        </Box>
        {sectionHover && (
          <Box>
            section: ({sectionHover.relX.toFixed(1)}, {sectionHover.relY.toFixed(1)}) [
            {sectionHover.section.name}]
          </Box>
        )}
        {tableHover && (
          <Box>
            table: ({tableHover.relX.toFixed(1)}, {tableHover.relY.toFixed(1)}) [
            {tableHover.table.name}]
          </Box>
        )}
      </Box>

      {/* Sections */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 0.5, mt: 0.5 }}>
        <Box sx={{ fontWeight: 700, color: "cyan", mb: 0.25 }}>SECTIONS</Box>
        {sections.map((sec) => (
          <Box key={sec.id} sx={{ ml: 0.5 }}>
            {sec.name}: center=({sec.x ?? 0}, {sec.y ?? 0}) size=
            {sec.width ?? "?"}x{sec.height ?? "?"} tbls={sec.tables?.length ?? 0}
          </Box>
        ))}
      </Box>

      {/* Selection */}
      {selectedItems && selectedItems.length > 0 && (
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.15)", pt: 0.5, mt: 0.5 }}>
          <Box sx={{ fontWeight: 700, color: "cyan", mb: 0.25 }}>SELECTED</Box>
          {selectedItems.map((item) => (
            <Box key={`${item.type}-${item.id}`} sx={{ ml: 0.5 }}>
              [{item.type}] {item.id.slice(0, 8)}…{" "}
              {"name" in item ? item.name : "label" in item ? item.label : ""}
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  );
}
