"use client";

import React from "react";
import { TextField, Button, Box, Stack } from "@mui/material";

export default function TimelineEditor({ values, setValue }: any) {
  const addStep = () =>
    setValue("steps", [...(values.steps || []), { time: "", title: "", description: "" }]);

  const update = (idx: number, key: string, value: any) => {
    const arr = [...(values.steps || [])];
    arr[idx] = { ...arr[idx], [key]: value };
    setValue("steps", arr);
  };

  const remove = (idx: number) => {
    const arr = [...(values.steps || [])];
    arr.splice(idx, 1);
    setValue("steps", arr);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={addStep} sx={{ mb: 2 }}>
        Add Step
      </Button>

      <Stack spacing={3}>
        {(values.steps || []).map((step: any, i: number) => (
          <Box key={i}>
            <TextField
              label="Time"
              value={step.time}
              fullWidth
              sx={{ mb: 1 }}
              onChange={(e) => update(i, "time", e.target.value)}
            />
            <TextField
              label="Title"
              value={step.title}
              fullWidth
              sx={{ mb: 1 }}
              onChange={(e) => update(i, "title", e.target.value)}
            />
            <TextField
              label="Description"
              value={step.description}
              fullWidth
              onChange={(e) => update(i, "description", e.target.value)}
            />
            <Button sx={{ mt: 1 }} color="error" onClick={() => remove(i)}>
              Delete Step
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
