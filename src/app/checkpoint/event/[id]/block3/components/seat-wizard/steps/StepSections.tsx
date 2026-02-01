"use client";

import React from "react";
import { Box, Button, TextField, Stack, MenuItem } from "@mui/material";

export default function StepSections({ data, setData, next }) {
  const addSection = () => {
    setData({
      ...data,
      sections: [
        ...data.sections,
        {
          name: `Section ${data.sections.length + 1}`,
          shape: "circle",
          tables: [],
        },
      ],
    });
  };

  const update = (i, field, value) => {
    const clone = [...data.sections];
    clone[i][field] = value;
    setData({ ...data, sections: clone });
  };

  return (
    <Box>
      <Stack spacing={2}>
        {data.sections.map((sec, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: 2,
            }}
          >
            <TextField
              fullWidth
              label="Section Name"
              value={sec.name}
              onChange={(e) => update(i, "name", e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              select
              fullWidth
              label="Form"
              value={sec.shape}
              onChange={(e) => update(i, "shape", e.target.value)}
            >
              <MenuItem value="circle">Kreis</MenuItem>
              <MenuItem value="horseshoe">Hufeisen</MenuItem>
              <MenuItem value="u">U-Form</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
            </TextField>
          </Box>
        ))}

        <Button variant="outlined" onClick={addSection}>
          + Bereich hinzufügen
        </Button>
      </Stack>

      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={next}
          disabled={data.sections.length === 0}
        >
          Weiter
        </Button>
      </Box>
    </Box>
  );
}
