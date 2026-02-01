"use client";

import { EventRole } from "@/types/event/event-enum.type";
import { alpha, Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { EventHeaderProps } from "./EventActions";

export default function EventHeaderC({ ev }: EventHeaderProps) {
  const theme = useTheme();

  const roleChipColor =
    ev.myRole === EventRole.ADMIN
      ? "primary"
      : ev.myRole === EventRole.SECURITY
      ? "success"
      : "default";

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: "blur(14px)",
        boxShadow: theme.shadows[2],
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {ev.name}
        </Typography>

        <Chip
          label={ev.myRole ?? "Guest"}
          color={roleChipColor}
          variant="filled"
          sx={{ width: "fit-content", fontWeight: 600 }}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          Start:{" "}
          {new Date(ev.startsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Ende:{" "}
          {new Date(ev.endsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
      </Stack>
    </Box>
  );
}
