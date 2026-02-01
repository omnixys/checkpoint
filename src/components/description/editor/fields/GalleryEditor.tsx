"use client";

import React from "react";
import { TextField, Button, Box, Stack } from "@mui/material";

export default function GalleryEditor({ values, setValue }: any) {
  const addImage = () =>
    setValue("images", [...(values.images || []), ""]);

  const updateImage = (index: number, url: string) => {
    const arr = [...(values.images || [])];
    arr[index] = url;
    setValue("images", arr);
  };

  const removeImage = (index: number) => {
    const arr = [...(values.images || [])];
    arr.splice(index, 1);
    setValue("images", arr);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={addImage} sx={{ mb: 2 }}>
        Add Image
      </Button>

      <Stack spacing={2}>
        {(values.images || []).map((img: string, i: number) => (
          <Stack key={i} direction="row" spacing={1}>
            <TextField
              label={`Image ${i + 1}`}
              value={img}
              fullWidth
              onChange={(e) => updateImage(i, e.target.value)}
            />
            <Button color="error" onClick={() => removeImage(i)}>
              X
            </Button>
          </Stack>
        ))}
      </Stack>

      <TextField
        label="Aspect Ratio"
        value={values.aspectRatio || "16:9"}
        fullWidth
        onChange={(e) => setValue("aspectRatio", e.target.value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
