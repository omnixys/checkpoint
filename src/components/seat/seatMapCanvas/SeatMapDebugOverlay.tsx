"use client";

import { BugReport } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import type { LayoutDocument } from "./core/document";
import type { Camera } from "./core/geometry";

interface Props {
  document: LayoutDocument;
  camera: Camera;
  selectedIds: string[];
  visible: boolean;
  onToggle: () => void;
}
export default function SeatMapDebugOverlay({
  document,
  camera,
  selectedIds,
  visible,
  onToggle,
}: Props) {
  return (
    <Box
      data-camera-control
      sx={{
        position: "absolute",
        top: 1,
        left: 1,
        zIndex: 70,
        bgcolor: "background.paper",
        borderRadius: 1,
        p: 0.5,
      }}
    >
      <Tooltip title="Koordinaten-Diagnose (Ctrl/Cmd+Shift+D)">
        <IconButton
          size="small"
          aria-label={visible ? "Hide debug overlay" : "Show debug overlay"}
          onClick={onToggle}
          data-testid="debug-toggle"
        >
          <BugReport fontSize="small" />
        </IconButton>
      </Tooltip>
      {visible && (
        <Stack spacing={0.5} sx={{ p: 1, minWidth: 200 }}>
          <Typography variant="caption">
            Zoom: {camera.scale.toFixed(3)} · Pan: {camera.x.toFixed(1)} / {camera.y.toFixed(1)}
          </Typography>
          <Typography variant="caption">
            {document.order.length} Elemente · World-Mittelpunkte
          </Typography>
          {selectedIds.map((id) => {
            const n = document.nodes[id];
            return n ? (
              <Typography variant="caption" key={id}>
                {n.kind}: {n.x.toFixed(1)} / {n.y.toFixed(1)} · {n.rotation.toFixed(1)}°
              </Typography>
            ) : null;
          })}
        </Stack>
      )}
    </Box>
  );
}
