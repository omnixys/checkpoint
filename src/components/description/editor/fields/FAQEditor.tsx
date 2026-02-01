"use client";

import React from "react";
import { TextField, Button, Box, Stack } from "@mui/material";

export default function FAQEditor({ values, setValue }: any) {
  const add = () =>
    setValue("items", [...(values.items || []), { question: "", answer: "" }]);

  const update = (idx: number, key: string, val: any) => {
    const arr = [...(values.items || [])];
    arr[idx] = { ...arr[idx], [key]: val };
    setValue("items", arr);
  };

  const remove = (idx: number) => {
    const arr = [...(values.items || [])];
    arr.splice(idx, 1);
    setValue("items", arr);
  };

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={add}>
        Add FAQ Entry
      </Button>

      <Stack spacing={3}>
        {(values.items || []).map((q: any, i: number) => (
          <Box key={i}>
            <TextField
              label="Question"
              fullWidth
              sx={{ mb: 1 }}
              value={q.question}
              onChange={(e) => update(i, "question", e.target.value)}
            />

            <TextField
              label="Answer"
              fullWidth
              value={q.answer}
              onChange={(e) => update(i, "answer", e.target.value)}
            />

            <Button color="error" onClick={() => remove(i)} sx={{ mt: 1 }}>
              Delete
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
