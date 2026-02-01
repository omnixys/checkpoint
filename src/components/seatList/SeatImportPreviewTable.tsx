"use client";

import React from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
} from "@mui/material";

export default function SeatImportPreviewTable({ rows }: { rows: any[] }) {
  if (rows.length === 0) return null;

  const headers = Object.keys(rows[0]);

  return (
    <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
      <Table stickyHeader>
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
          {rows.map((r, i) => (
            <TableRow key={i}>
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
