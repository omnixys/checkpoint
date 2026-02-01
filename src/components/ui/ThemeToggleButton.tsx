// /frontend/src/app/components/ui/ThemeToggleButton.tsx
"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "@/providers/ThemeModeProvider";

export default function ThemeToggleButton() {
  const { mode, toggle } = useThemeMode();

  return (
    <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
      <IconButton
        onClick={toggle}
        aria-label="Theme Toggle"
        size="large"
        edge="end"
      >
        {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}
