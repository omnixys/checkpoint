"use client";

import { Box, useTheme } from "@mui/material";
import Image from "next/image";
import type { Event } from "@/types/event/event.type";

type Props = {
  ev: Event;
  visualStyle: "image" | "banner" | "none";
};

export default function EventCardMedia({ ev, visualStyle }: Props) {
  const theme = useTheme();

  // Falls später: ev.imageUrl kann aus DB kommen
  const imageUrl =
    (ev as unknown as { imageUrl?: string }).imageUrl ||
    "/event/event-default.png";

  // ---------- NONE ----------
  if (visualStyle === "none") {
    return null;
  }

  // ---------- BANNER ----------
  if (visualStyle === "banner") {
    return (
      <Box
        sx={{
          width: "100%",
          height: 12,
          bgcolor: theme.palette.primary.main,
        }}
      />
    );
  }

  // ---------- IMAGE ----------
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 160, sm: 180, md: 200 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src={imageUrl}
        alt={ev.name}
        fill
        style={{
          objectFit: "cover",
        }}
        sizes="(max-width: 600px) 100vw,
               (max-width: 900px) 50vw,
               33vw"
      />
    </Box>
  );
}
