"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";

export default function StepTables({ data, setData, next, back }) {
  const addTable = (secIndex) => {
    const clone = [...data.sections];
    clone[secIndex].tables.push({
      name: `Tisch ${clone[secIndex].tables.length + 1}`,
      shape: "circle",
      seats: { count: 6, shape: "circle" },
    });
    setData({ ...data, sections: clone });
  };

  const update = (secIndex, tblIndex, field, value) => {
    const clone = [...data.sections];
    clone[secIndex].tables[tblIndex][field] = value;
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
                <TextField
                  fullWidth
                  label="Tisch Name"
                  value={tbl.name}
                  onChange={(e) => update(i, t, "name", e.target.value)}
                />

                <TextField
                  select
                  fullWidth
                  label="Form"
                  value={tbl.shape}
                  onChange={(e) => update(i, t, "shape", e.target.value)}
                >
                  <MenuItem value="circle">Rund</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="row">Reihe</MenuItem>
                </TextField>
              </Stack>
            ))}

            <Button variant="outlined" onClick={() => addTable(i)}>
              + Tisch hinzufügen
            </Button>
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
