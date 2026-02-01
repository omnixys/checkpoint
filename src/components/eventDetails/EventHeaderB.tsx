"use client";

import { EventRole } from "@/types/event/event-enum.type";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { EventHeaderProps } from "./EventActions";

export default function EventHeaderB({ ev }: EventHeaderProps) {
  const theme = useTheme();

  const roleChipColor =
    ev.myRole === EventRole.ADMIN
      ? "primary"
      : ev.myRole === EventRole.SECURITY
      ? "success"
      : "default";

  const hero =
    (ev as unknown as { imageUrl?: string }).imageUrl ||
    "/event/event-default.png";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
        height: { xs: 220, sm: 260, md: 300 },
      }}
    >
      <Image src={hero} alt={ev.name} fill style={{ objectFit: "cover" }} />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${theme.palette.background.paper} 8%, transparent 60%)`,
        }}
      />

      <Stack
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 24,
          left: 24,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: theme.palette.primary.contrastText }}
        >
          {ev.name}
        </Typography>

        <Chip
          label={ev.myRole ?? "Guest"}
          color={roleChipColor}
          variant={ev.myRole === "GUEST" ? "outlined" : "filled"}
          sx={{
            width: "fit-content",
            backdropFilter: "blur(8px)",
            fontWeight: 600,
          }}
        />

        <Typography
          variant="body1"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          {new Date(ev.startsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          bis{" "}
          {new Date(ev.endsAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Typography>
      </Stack>
    </Box>
  );
}
