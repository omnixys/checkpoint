"use client";

import CheckIcon from "@mui/icons-material/CheckCircleRounded";
import { Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { JSX } from "react";
import { AppleCardGlass } from "./EventSteps.style";

export default function Step5Success({
  eventId,
  onDone,
}: {
  eventId: string;
  onDone: () => void;
}): JSX.Element {
  return (
    <AppleCardGlass>
      <Stack spacing={4} alignItems="center" textAlign="center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
          }}
        >
          <CheckIcon
            sx={{
              fontSize: 90,
              color: "rgb(52,199,89)", // iOS green
            }}
          />
        </motion.div>

        {/* Title */}
        <Typography variant="h5" fontWeight={800} sx={{ mt: -2 }}>
          Event erfolgreich erstellt!
        </Typography>

        {/* Info */}
        <Typography sx={{ opacity: 0.7, maxWidth: 400 }}>
          Dein Event wurde gespeichert. Du kannst jetzt Gäste einladen, Plätze
          verwalten und Tickets generieren.
        </Typography>

        {/* Buttons */}
        <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 3 }}
            onClick={() => onDone()}
          >
            Zum Event
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{ borderRadius: 3 }}
            href="/event"
          >
            Weitere Events anzeigen
          </Button>
        </Stack>
      </Stack>
    </AppleCardGlass>
  );
}
