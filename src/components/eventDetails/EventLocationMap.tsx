"use client";

import { Event } from "@/types/event/event.type";
import { Box, Typography } from "@mui/material";

type Props = {
  ev: Event;
};

export default function EventLocationMap({ ev }: Props) {
  const GOOGLE_MAPS_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5272.374452948911!2d9.4298427!3d48.6445334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479995eb7f76f565%3A0x35acb6bfdf36da5e!2sWhite%20Event%20Palast%20%7C%20Hochzeitssaal%20Stuttgart!5e0!3m2!1sde!2sde!4v1766230632142!5m2!1sde!2sde";

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
        Standort
      </Typography>

      <Box
        sx={{
          height: 260,
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          boxShadow: 4,
        }}
      >
        <iframe
          src={GOOGLE_MAPS_EMBED}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </Box>
    </Box>
  );
}
