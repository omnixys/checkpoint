"use client";

import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function SeatImportPreviewTable({ rows }: { rows: any[] }) {
  if (rows.length === 0) {
    return null;
  }

  const headers = Object.keys(rows[0]);
  const rowKey = (row: Record<string, unknown>) =>
    headers.map((header) => String(row[header] ?? "")).join("|");

  return (
    <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
      <Table stickyHeader={true}>
        <TableHead>
          <TableRow>
            {headers.map((h) => (
              <TableCell key={h} sx={{ fontWeight: 700 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={rowKey(r)}>
              {headers.map((h) => (
                <TableCell key={h}>{r[h]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
