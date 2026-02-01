"use client";

import React from "react";
import { TextField, Box } from "@mui/material";

export default function LocationEditor({ values, setValue }: any) {
  return (
    <Box>
      <TextField
        label="Title"
        fullWidth
        sx={{ mb: 2 }}
        value={values.title || ""}
        onChange={(e) => setValue("title", e.target.value)}
      />

      <TextField
        label="Address"
        fullWidth
        sx={{ mb: 2 }}
        value={values.address || ""}
        onChange={(e) => setValue("address", e.target.value)}
      />

      <TextField
        label="Image URL"
        fullWidth
        sx={{ mb: 2 }}
        value={values.image || ""}
        onChange={(e) => setValue("image", e.target.value)}
      />

      <TextField
        label="Map Embed URL"
        fullWidth
        value={values.mapEmbedUrl || ""}
        onChange={(e) => setValue("mapEmbedUrl", e.target.value)}
      />
    </Box>
  );
}
