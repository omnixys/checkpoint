"use client";

import React from "react";
import { TextField, Box } from "@mui/material";

export default function QuoteEditor({ values, setValue }: any) {
  return (
    <Box>
      <TextField
        label="Quote"
        fullWidth
        sx={{ mb: 2 }}
        value={values.quote || ""}
        onChange={(e) => setValue("quote", e.target.value)}
      />

      <TextField
        label="Author"
        fullWidth
        value={values.author || ""}
        onChange={(e) => setValue("author", e.target.value)}
      />
    </Box>
  );
}
