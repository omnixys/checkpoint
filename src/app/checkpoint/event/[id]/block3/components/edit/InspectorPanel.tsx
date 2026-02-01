"use client";

import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";

/**
 * VisionOS-like translucent panel
 */
export default function InspectorPanel({ selection, data, onUpdate }) {
  const { sectionId, tableId, seatId } = selection;

  // nothing selected → collapsed panel
  if (!sectionId && !tableId && !seatId) return null;

  // find objects
  const section = data.find((s) => s.id === sectionId);
  const table = section?.tables.find((t) => t.id === tableId);
  const seat = table?.seats.find((x) => x.id === seatId);

  return (
    <Box
      sx={{
        width: 360,
        padding: 3,
        backdropFilter: "blur(18px)",
        background: "rgba(255,255,255,0.22)",
        borderLeft: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 40px rgba(0,0,0,0.15)",
        position: "absolute",
        right: 0,
        top: 0,
        height: "100vh",
        overflowY: "auto",
        animation: "panelIn 0.25s ease-out",
      }}
    >
      <style>{`
      @keyframes panelIn {
        from { opacity: 0; transform: translateX(40px); }
        to { opacity: 1; transform: translateX(0); }
      }
      `}</style>

      {/* SECTION PANEL */}
      {section && !tableId && !seatId && (
        <>
          <Typography variant="h5" gutterBottom>
            Section: {section.name}
          </Typography>

          <TextField
            fullWidth
            label="Name"
            value={section.name}
            sx={{ my: 2 }}
            onChange={(e) =>
              onUpdate({
                type: "section",
                id: section.id,
                patch: { name: e.target.value },
              })
            }
          />

          <TextField
            fullWidth
            label="Radius"
            type="number"
            value={section.meta?.radius ?? 300}
            sx={{ my: 2 }}
            onChange={(e) =>
              onUpdate({
                type: "section",
                id: section.id,
                patch: {
                  meta: {
                    ...section.meta,
                    radius: Number(e.target.value),
                  },
                },
              })
            }
          />
        </>
      )}

      {/* TABLE PANEL */}
      {table && !seatId && (
        <>
          <Typography variant="h5" gutterBottom>
            Tisch: {table.name}
          </Typography>

          <TextField
            fullWidth
            label="Name"
            value={table.name}
            sx={{ my: 2 }}
            onChange={(e) =>
              onUpdate({
                type: "table",
                id: table.id,
                sectionId: section.id,
                patch: { name: e.target.value },
              })
            }
          />

          <TextField
            fullWidth
            type="number"
            label="Seats"
            value={table.capacity}
            sx={{ my: 2 }}
            onChange={(e) =>
              onUpdate({
                type: "table",
                id: table.id,
                sectionId: section.id,
                patch: { capacity: Number(e.target.value) },
              })
            }
          />

          <Select
            fullWidth
            label="Table Shape"
            sx={{ my: 2 }}
            value={table.meta?.shape ?? "circle"}
            onChange={(e) =>
              onUpdate({
                type: "table",
                id: table.id,
                sectionId: section.id,
                patch: {
                  meta: {
                    ...table.meta,
                    shape: e.target.value,
                  },
                },
              })
            }
          >
            <MenuItem value="circle">Kreis</MenuItem>
            <MenuItem value="grid">Grid</MenuItem>
            <MenuItem value="row">Reihe</MenuItem>
          </Select>
        </>
      )}

      {/* SEAT PANEL */}
      {seat && (
        <>
          <Typography variant="h5" gutterBottom>
            Sitzplatz Nr. {seat.number}
          </Typography>

          <TextField
            fullWidth
            label="Label"
            sx={{ my: 2 }}
            value={seat.label}
            onChange={(e) =>
              onUpdate({
                type: "seat",
                id: seat.id,
                sectionId: section.id,
                tableId: table.id,
                patch: { label: e.target.value },
              })
            }
          />

          <Select
            fullWidth
            sx={{ my: 2 }}
            value={seat.meta?.shape ?? "circle"}
            onChange={(e) =>
              onUpdate({
                type: "seat",
                id: seat.id,
                sectionId: section.id,
                tableId: table.id,
                patch: {
                  meta: { ...seat.meta, shape: e.target.value },
                },
              })
            }
          >
            <MenuItem value="circle">Kreis</MenuItem>
            <MenuItem value="grid">Quadrat</MenuItem>
            <MenuItem value="row">Reihe</MenuItem>
          </Select>
        </>
      )}
    </Box>
  );
}
