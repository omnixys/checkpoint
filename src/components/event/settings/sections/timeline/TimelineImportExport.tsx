"use client";

import { alpha, Box, Button, Stack, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { TimelineItem } from "../TimelineSection";

export function TimelineImportExport({ onImport }: { onImport: (items: TimelineItem[]) => void }) {
  const theme = useTheme();

  const handleFile = async (file: File) => {
    const ext = file.name.split(".").pop();

    if (ext === "xlsx") {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer);
      const firstSheetName = wb.SheetNames[0];
      if (!firstSheetName) return;
      const sheet = wb.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json<any>(sheet || {});

      const items = json.map((row) => ({
        id: crypto.randomUUID(),
        label: row.Label,
        type: row.Type || "INFO",
        timestamp: buildTimestamp(row.Time),
      }));

      onImport(items);
      return;
    }

    const text = await file.text();

    const items = text
      .split("\n")
      .slice(1)
      .map((row) => {
        const [label, type, time] = row.split(",");

        if (!label || !time) return null;

        return {
          id: crypto.randomUUID(),
          label: label.trim(),
          type: type?.trim() || "INFO",
          timestamp: buildTimestamp(time.trim()),
        };
      })
      .filter(Boolean) as TimelineItem[];

    onImport(items);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        backdropFilter: "blur(16px)",
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.primary.main, 0.12)},
          ${alpha(theme.palette.secondary.main, 0.08)}
        )`,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">Import Timeline</Typography>

        <Button component="label" variant="contained">
          Upload CSV / Excel
          <input
            hidden
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </Button>
      </Stack>
    </Box>
  );
}

function buildTimestamp(time: string) {
  const parts = time.split(":");
  return dayjs()
    .hour(+(parts[0] || 0))
    .minute(+(parts[1] || 0))
    .toISOString();
}
