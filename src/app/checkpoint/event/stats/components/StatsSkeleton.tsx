"use client";

import { Box, Skeleton, Stack } from "@mui/material";
import { JSX } from "react";

export default function StatsSkeleton(): JSX.Element {
  return (
    <Stack spacing={2} padding={2}>
      {[...Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: 3,
            backgroundColor: "background.paper",
            padding: 2,
          }}
        >
          <Skeleton width="40%" height={24} />
          <Skeleton width="60%" height={40} />
        </Box>
      ))}
    </Stack>
  );
}
