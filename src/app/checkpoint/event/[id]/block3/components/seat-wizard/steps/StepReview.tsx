"use client";

import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";

export default function StepReview({ data, submit, back, loading }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Zusammenfassung
      </Typography>

      <Stack spacing={2}>
        {data.sections.map((sec, i) => (
          <Box key={i}>
            <Typography variant="subtitle1">
              {sec.name} – {sec.shape}
            </Typography>

            {sec.tables.map((tbl, t) => (
              <Typography key={t} sx={{ ml: 2 }}>
                • {tbl.name} ({tbl.shape}) – {tbl.seats.count} Sitze
              </Typography>
            ))}
          </Box>
        ))}
      </Stack>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button onClick={back}>Zurück</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? "Generiere..." : "Layout erstellen"}
        </Button>
      </Box>
    </Box>
  );
}
