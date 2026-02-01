"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

export default function StepSeats({ data, setData, next, back }) {
  const update = (secIndex, tblIndex, field, value) => {
    const clone = [...data.sections];
    clone[secIndex].tables[tblIndex].seats[field] = value;
    setData({ ...data, sections: clone });
  };

  return (
    <Box>
      <Stack spacing={3}>
        {data.sections.map((sec, i) => (
          <Box key={i}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {sec.name}
            </Typography>

            {sec.tables.map((tbl, t) => (
              <Stack
                key={t}
                spacing={2}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  boxShadow: 2,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1">{tbl.name}</Typography>

                <TextField
                  type="number"
                  label="Anzahl Sitze"
                  value={tbl.seats.count}
                  onChange={(e) =>
                    update(i, t, "count", Number(e.target.value))
                  }
                />

                <TextField
                  select
                  label="Sitz Form"
                  value={tbl.seats.shape}
                  onChange={(e) => update(i, t, "shape", e.target.value)}
                >
                  <MenuItem value="circle">Kreis</MenuItem>
                  <MenuItem value="spiral">Spiral</MenuItem>
                  <MenuItem value="scatter">Zufällig</MenuItem>
                  <MenuItem value="u">U-Form</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="row">Reihe</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                </TextField>
              </Stack>
            ))}
          </Box>
        ))}
      </Stack>

      <Box mt={3} display="flex" justifyContent="space-between">
        <Button onClick={back}>Zurück</Button>
        <Button variant="contained" onClick={next}>
          Weiter
        </Button>
      </Box>
    </Box>
  );
}
