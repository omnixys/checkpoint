"use client";

import { Box, Typography, Paper } from "@mui/material";
import { JSX } from "react";

export default function OnboardingSlide({
  title,
  text,
  icon,
  action,
}: {
  title: string;
  text: string;
  icon: string;
  action: JSX.Element;
}) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        textAlign: "center",
        maxWidth: 400,
        width: "100%",
        backgroundColor: (t) => t.palette.apple.systemBackground,
      }}
    >
      <Typography sx={{ fontSize: "60px", mb: 2 }}>{icon}</Typography>

      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        {text}
      </Typography>

      {action}
    </Paper>
  );
}
