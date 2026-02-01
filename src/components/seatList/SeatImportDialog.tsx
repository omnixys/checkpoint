"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import SeatImportPreviewTable from "./SeatImportPreviewTable";

export default function SeatImportDialog({
  open,
  onClose,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  onImport: (rows: any[]) => void;
}) {
  const theme = useTheme();
  const [rows, setRows] = React.useState<any[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  }

  function parseCSV(text: string) {
    const lines = text.split("\n").map((l) => l.trim());
    const header = lines[0].split(",");

    const required = ["section", "table", "number", "note"];

    const missing = required.filter((r) => !header.includes(r));
    if (missing.length > 0) {
      setErrors([`Fehlende Spalten: ${missing.join(", ")}`]);
      return;
    }

    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;

      const cols = lines[i].split(",");
      const row: any = {};
      header.forEach((key, index) => {
        row[key] = cols[index] ?? "";
      });

      // Validation
      if (!row.number) {
        setErrors((e) => [...e, `Fehler in Zeile ${i}: number fehlt`]);
      }

      data.push(row);
    }

    setRows(data);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Seats importieren</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Button variant="contained" component="label">
            CSV auswählen
            <input hidden type="file" accept=".csv" onChange={handleFile} />
          </Button>

          {errors.length > 0 && (
            <Stack spacing={1} sx={{ p: 2 }}>
              {errors.map((e, i) => (
                <Typography key={i} sx={{ color: theme.palette.error.main }}>
                  {e}
                </Typography>
              ))}
            </Stack>
          )}

          {rows.length > 0 && <SeatImportPreviewTable rows={rows} />}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button
          variant="contained"
          onClick={() => onImport(rows)}
          disabled={rows.length === 0}
        >
          Importieren
        </Button>
      </DialogActions>
    </Dialog>
  );
}
