"use client";

import React, { JSX } from "react";
import { Box, Fade, Button } from "@mui/material";
import OnboardingSlide from "./OnboardingSlide";
import { ONBOARDING } from "@/checkpoint/constants/cookie";

interface Props {
  onFinish: () => void;
}

type SlideItem = {
  title: string;
  text: string;
  icon: string;
  action: JSX.Element;
};

export default function OnboardingModal({ onFinish }: Props): JSX.Element {
  const [step, setStep] = React.useState<number>(0);
  const total = 4;

  React.useEffect(() => {
    // Lock scroll while onboarding is visible
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const next = (): void => {
    setStep((prev) => {
      if (prev < total - 1) {
        return prev + 1;
      }

      return prev;
    });
  };

  const finish = (): void => {
    localStorage.setItem(ONBOARDING, "1");
    onFinish();
  };

  const slides: SlideItem[] = [
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

  if (!slide) {
    return <></>;
  }

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
