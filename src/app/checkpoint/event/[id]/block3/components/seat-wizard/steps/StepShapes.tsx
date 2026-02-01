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

export default function StepShapes({ data, setData, next, back }) {
  const update = (i, value) => {
    const clone = [...data.sections];
    clone[i].shape = value;
    setData({ ...data, sections: clone });
  };

  return (
    <Box>
      <Stack spacing={3}>
        {data.sections.map((sec, i) => (
          <Stack
            key={i}
            spacing={2}
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: 2,
            }}
          >
            <Typography variant="subtitle1">{sec.name}</Typography>

            <TextField
              select
              label="Bereich Form"
              value={sec.shape}
              onChange={(e) => update(i, e.target.value)}
            >
              <MenuItem value="circle">Kreis</MenuItem>
              <MenuItem value="horseshoe">Hufeisen</MenuItem>
              <MenuItem value="u">U-Form</MenuItem>
              <MenuItem value="vip">VIP</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
            </TextField>
          </Stack>
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
