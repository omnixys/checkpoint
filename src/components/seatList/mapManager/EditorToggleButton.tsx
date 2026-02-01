"use client";

import { Button, alpha, useTheme } from "@mui/material";
import React from "react";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";

export default function EditorToggleButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      startIcon={<BuildRoundedIcon />}
      variant={active ? "contained" : "outlined"}
      sx={{
        position: "fixed",
        bottom: 26,
        right: 26,
        zIndex: 999,
        px: 3,
        py: 1.5,
        borderRadius: "20px",
        bgcolor: active
          ? alpha(theme.palette.primary.main, 0.88)
          : alpha(theme.palette.background.paper, 0.45),
        backdropFilter: "blur(18px)",
      }}
    >
      {active ? "Editor aktiv" : "Editor öffnen"}
    </Button>
  );
}
