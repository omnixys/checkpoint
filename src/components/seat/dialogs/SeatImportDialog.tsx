"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import SeatImportPreviewTable from "@/checkpoint/components/seat/SeatImportPreviewTable";

interface SeatImportRow {
  section: string;
  table: string;
  number: string;
  note: string;
  [key: string]: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (rows: SeatImportRow[]) => void;
}

export default function SeatImportDialog({ open, onClose, onImport }: Props) {
  const theme = useTheme();
  const [rows, setRows] = React.useState<SeatImportRow[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const text = typeof loadEvent.target?.result === "string" ? loadEvent.target.result : "";

      parseCsv(text);
    };

    reader.readAsText(file);
  }

  function parseCsv(text: string) {
    const lines = text.split("\n").map((line) => line.trim());
    const header = lines[0]?.split(",").map((column) => column.trim());

    const required = ["section", "table", "number", "note"];
    const nextErrors: string[] = [];

    if (!header || header.length === 0) {
      setErrors(["Die CSV-Datei enthält keinen Header."]);
      setRows([]);
      return;
    }

    const missing = required.filter((requiredColumn) => !header.includes(requiredColumn));
    if (missing.length > 0) {
      setErrors([`Fehlende Spalten: ${missing.join(", ")}`]);
      setRows([]);
      return;
    }

    const data: SeatImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];

      if (!currentLine) {
        continue;
      }

      const cols = currentLine.split(",").map((column) => column.trim());
      const row: SeatImportRow = {
        section: "",
        table: "",
        number: "",
        note: "",
      };

      header.forEach((key, index) => {
        row[key] = cols[index] ?? "";
      });

      if (!row.number) {
        nextErrors.push(`Fehler in Zeile ${i}: number fehlt`);
      }

      data.push(row);
    }

    setErrors(nextErrors);
    setRows(data);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Seats importieren</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Button variant="contained" component="label">
            CSV auswählen
            <input hidden={true} type="file" accept=".csv" onChange={handleFile} />
          </Button>

          {errors.length > 0 && (
            <Stack spacing={1} sx={{ p: 2 }}>
              {errors.map((error) => (
                <Typography key={error} sx={{ color: theme.palette.error.main }}>
                  {error}
                </Typography>
              ))}
            </Stack>
          )}

          {rows.length > 0 && <SeatImportPreviewTable rows={rows} />}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>

        <Button variant="contained" onClick={() => onImport(rows)} disabled={rows.length === 0}>
          Importieren
        </Button>
      </DialogActions>
    </Dialog>
  );
}
