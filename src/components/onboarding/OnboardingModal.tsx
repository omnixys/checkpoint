"use client";

import React, { JSX } from "react";
import { Box, Fade, Button } from "@mui/material";
import OnboardingSlide from "./OnboardingSlide";

interface Props {
  onFinish: () => void;
}

export default function OnboardingModal({ onFinish }: Props): JSX.Element {
  const [step, setStep] = React.useState(0);
  const total = 4;

  React.useEffect(() => {
    // Lock scroll while onboarding visible
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const next = () => {
    if (step < total - 1) setStep(step + 1);
  };

  const finish = () => {
    localStorage.setItem("checkpoint.onboardingDone", "1");
    onFinish(); // VERY IMPORTANT – closes the modal
  };

  const slides = [
    {
      title: "Willkommen bei Checkpoint",
      text: "Die moderne Art, Einladungen, Tickets und Events zu verwalten.",
      icon: "✨",
      action: (
        <Button variant="contained" onClick={next}>
          Weiter
        </Button>
      ),
    },
    {
      title: "Einladungen & Tickets",
      text: "Behalte den Überblick über Events, Plus-Ones und QR-Tickets.",
      icon: "🎟️",
      action: (
        <Button variant="contained" onClick={next}>
          Weiter
        </Button>
      ),
    },
    {
      title: "Sicherheit & Event-Scan",
      text: "Unsere QR-Engine sorgt für sichere Einlasskontrolle.",
      icon: "🔐",
      action: (
        <Button variant="contained" onClick={next}>
          Weiter
        </Button>
      ),
    },
    {
      title: "Bereit?",
      text: "Du bist startklar!",
      icon: "🚀",
      action: (
        <Button variant="contained" onClick={finish}>
          App starten
        </Button>
      ),
    },
  ];

  const slide = slides[step];

  return (
    <Fade in>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <OnboardingSlide {...slide} />
      </Box>
    </Fade>
  );
}
