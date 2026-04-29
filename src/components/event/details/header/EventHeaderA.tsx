"use client";

import { alpha, Box, Chip, Stack, Typography, useTheme } from "@mui/material";

type Props = {
  ev: any;
};

export default function EventHeaderA({ ev }: Props) {
  const theme = useTheme();

  const roleChipColor =
    ev.myRole === "ADMIN" ? "primary" : ev.myRole === "SECURITY" ? "success" : "default";

  return (
    <Box
      sx={{
        borderRadius: 5,
        px: 3,
        py: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(18px)",
        boxShadow: theme.shadows[3],
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {ev.name}
        </Typography>

        <Chip
          label={ev.myRole ?? "Guest"}
          color={roleChipColor}
          variant={ev.myRole === "GUEST" ? "outlined" : "filled"}
          sx={{ width: "fit-content", fontWeight: 600 }}
        />

        <Typography variant="body1" color="text.secondary">
          {new Date(ev.settings.startsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          bis{" "}
          {new Date(ev.settings.endsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
      </Stack>
    </Box>
  );
}
