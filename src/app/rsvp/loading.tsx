import { Box, Skeleton, Stack } from "@mui/material";
import { JSX } from "react";

export default async function RsvpLoading(): Promise<JSX.Element> {
  return (
    <Stack
      spacing={2}
      sx={{
        padding: 2,
      }}
    >
      <Skeleton width="40%" height={32} />
      <Skeleton width="80%" height={24} />
      <Skeleton width="100%" height={56} />
    </Stack>
  );
}
