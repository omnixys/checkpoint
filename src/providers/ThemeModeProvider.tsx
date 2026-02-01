"use client";

import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { PaletteMode } from "@mui/material";

import { triggerAccentPulse } from "@/lib/accent-animation";
import { createAppTheme } from "@/themes/createAppTheme";
import type { OmnixysColorScheme } from "@/themes/paletteTypes";
import { STORAGE_MODE, STORAGE_SCHEME } from "../constants/storage/color";

// -------------------------------------------------------------
// Context Types
// -------------------------------------------------------------
type ThemeModeContextValue = {
  mode: PaletteMode;
  scheme: OmnixysColorScheme;
  setMode: (mode: PaletteMode) => void;
  setScheme: (scheme: OmnixysColorScheme) => void;
  toggle: () => void;
};

// -------------------------------------------------------------
// React Context
// -------------------------------------------------------------
export const ThemeModeContext =
  React.createContext<ThemeModeContextValue | null>(null);

export default function ThemeModeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [scheme, setScheme] = React.useState<OmnixysColorScheme>("original");

  // -------------------------------------------------------------
  // Load mode + scheme from localStorage
  // -------------------------------------------------------------
  React.useEffect(() => {
    const savedMode = window.localStorage.getItem(
      STORAGE_MODE,
    ) as PaletteMode | null;

    const savedScheme = window.localStorage.getItem(
      STORAGE_SCHEME,
    ) as OmnixysColorScheme | null;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setMode(savedMode ?? (prefersDark ? "dark" : "light"));
    setScheme(savedScheme ?? "original");
  }, []);

  // -------------------------------------------------------------
  // Smooth iOS-like transition on theme change
  // -------------------------------------------------------------
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");

    const accent = getComputedStyle(root)
      .getPropertyValue("--mui-palette-primary-main")
      .trim();

    if (accent) {
      triggerAccentPulse(accent);
    }

    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350);

    return () => clearTimeout(timeout);
  }, [mode, scheme]);

  // -------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------
  const value = React.useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      scheme,

      setMode: (next) => {
        window.localStorage.setItem(STORAGE_MODE, next);
        setMode(next);
      },

      setScheme: (next) => {
        window.localStorage.setItem(STORAGE_SCHEME, next);
        setScheme(next);
      },

      toggle: () => {
        const next: PaletteMode = mode === "dark" ? "light" : "dark";
        window.localStorage.setItem(STORAGE_MODE, next);
        setMode(next);
      },
    }),
    [mode, scheme],
  );

  // -------------------------------------------------------------
  // Theme creation
  // -------------------------------------------------------------
  const theme = React.useMemo(
    () => createAppTheme(mode, scheme),
    [mode, scheme],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// -------------------------------------------------------------
// Hook
// -------------------------------------------------------------
export function useThemeMode() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
}
