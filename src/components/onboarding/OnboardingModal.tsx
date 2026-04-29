"use client";

import { Box, Button, IconButton, Stack, Typography, useTheme } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import OnboardingSlide from "./OnboardingSlide";

type Slide = {
  title: string;
  text: string;
  icon: string;
};

const slides = [
  {
    title: "Willkommen zu Checkpoint",
    text: "Verwalte Events, Gäste und Tickets in einer Plattform.",
    icon: "🎉",
  },
  {
    title: "Sitzplatz-Management",
    text: "Ordne Gästen Sitzplätze intelligent zu.",
    icon: "🪑",
  },
  {
    title: "Live Scanning",
    text: "QR-Code Check-in in Echtzeit.",
    icon: "📱",
  },
] satisfies Slide[];

export default function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const isLast = step === slides.length - 1;

  const next = () => {
    if (isLast) return onClose();
    setStep((s) => s + 1);
  };

  const back = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: back,
    trackMouse: true,
  });

  if (!open) return null;

  return (
    <Box
      {...handlers}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backdropFilter: "blur(30px)",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          background: theme.palette.background.paper,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 24,
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          sx={{
            p: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="subtitle2">Onboarding</Typography>

          <IconButton onClick={onClose}>
            <CloseRounded />
          </IconButton>
        </Stack>

        {/* Slide */}
        <Box sx={{ px: 3, py: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.35 }}
            >
              <OnboardingSlide {...slides[step]!} />
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Progress */}
        <Stack direction="row" spacing={1} sx={{ pb: 1, justifyContent: "center" }}>
          {slides.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: i === step ? "primary.main" : "grey.600",
                opacity: i === step ? 1 : 0.4,
              }}
            />
          ))}
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <Button fullWidth onClick={back} disabled={step === 0}>
            Zurück
          </Button>

          <Button fullWidth variant="contained" onClick={next}>
            {isLast ? "Starten" : "Weiter"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
