"use client";

import React from "react";
import { TextField, Button, Box, Stack } from "@mui/material";

export default function TeamEditor({ values, setValue }: any) {
  const add = () =>
    setValue("members", [...(values.members || []), { name: "", role: "", image: "", bio: "" }]);

  const update = (idx: number, key: string, val: any) => {
    const arr = [...(values.members || [])];
    arr[idx] = { ...arr[idx], [key]: val };
    setValue("members", arr);
  };

  const remove = (idx: number) => {
    const arr = [...(values.members || [])];
    arr.splice(idx, 1);
    setValue("members", arr);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={add} sx={{ mb: 2 }}>
        Add Member
      </Button>

      <Stack spacing={3}>
        {(values.members || []).map((m: any, i: number) => (
          <Box key={i}>
            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 1 }}
              value={m.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />
            <TextField
              label="Role"
              fullWidth
              sx={{ mb: 1 }}
              value={m.role}
              onChange={(e) => update(i, "role", e.target.value)}
            />
            <TextField
              label="Image URL"
              fullWidth
              sx={{ mb: 1 }}
              value={m.image}
              onChange={(e) => update(i, "image", e.target.value)}
            />
            <TextField
              label="Bio"
              fullWidth
              value={m.bio}
              onChange={(e) => update(i, "bio", e.target.value)}
            />

            <Button sx={{ mt: 1 }} color="error" onClick={() => remove(i)}>
              Delete Member
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
