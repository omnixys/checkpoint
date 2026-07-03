"use client";

import type { PaletteMode } from "@mui/material";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { STORAGE_MODE, STORAGE_SCHEME } from "@/checkpoint/constants/color";
import { triggerAccentPulse } from "@/checkpoint/themes/accent-animation";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import type { OmnixysColorScheme } from "@/checkpoint/themes/paletteTypes";

export type ThemeProfile = "wedding";

interface ThemeModeProviderProps {
  children: React.ReactNode;
  initialThemeProfile: ThemeProfile | null;
}

const WEDDING_PROFILE: ThemeProfile = "wedding";

function clearThemeProfileCookie() {
  const domain = window.location.hostname.endsWith(".omnixys.com") ? "; domain=.omnixys.com" : "";

  document.cookie = `theme=; path=/; max-age=0; SameSite=Lax${domain}`;
}

// -------------------------------------------------------------
// Context Types
// -------------------------------------------------------------
interface ThemeModeContextValue {
  mode: PaletteMode;
  scheme: OmnixysColorScheme;
  setMode: (mode: PaletteMode) => void;
  setScheme: (scheme: OmnixysColorScheme) => void;
  toggle: () => void;
}

// -------------------------------------------------------------
// React Context
// -------------------------------------------------------------
export const ThemeModeContext = React.createContext<ThemeModeContextValue | null>(null);

export default function ThemeModeProvider({
  children,
  initialThemeProfile,
}: ThemeModeProviderProps) {
  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  const [mode, setMode] = React.useState<PaletteMode>(
    initialThemeProfile === WEDDING_PROFILE ? "dark" : "light",
  );
  const [scheme, setScheme] = React.useState<OmnixysColorScheme>(
    initialThemeProfile === WEDDING_PROFILE ? "wedding" : "original",
  );

  // -------------------------------------------------------------
  // Load mode + scheme from localStorage
  // -------------------------------------------------------------
  React.useEffect(() => {
    const url = new URL(window.location.href);
    const requestedProfile =
      initialThemeProfile === WEDDING_PROFILE || url.searchParams.get("theme") === WEDDING_PROFILE;

    if (requestedProfile) {
      window.localStorage.setItem(STORAGE_MODE, "dark");
      window.localStorage.setItem(STORAGE_SCHEME, "wedding");
      setMode("dark");
      setScheme("wedding");
      clearThemeProfileCookie();

      if (url.searchParams.has("theme")) {
        url.searchParams.delete("theme");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }

      return;
    }

    const savedMode = window.localStorage.getItem(STORAGE_MODE) as PaletteMode | null;

    const savedScheme = window.localStorage.getItem(STORAGE_SCHEME) as OmnixysColorScheme | null;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setMode(savedMode ?? (prefersDark ? "dark" : "light"));
    setScheme(savedScheme ?? "original");
  }, [initialThemeProfile]);

  // -------------------------------------------------------------
  // Smooth iOS-like transition on theme change
  // -------------------------------------------------------------
  React.useEffect(() => {
    void mode;
    void scheme;

    const root = document.documentElement;
    root.classList.add("theme-transition");

    const accent = getComputedStyle(root).getPropertyValue("--mui-palette-primary-main").trim();

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
  const theme = React.useMemo(() => createAppTheme(mode, scheme), [mode, scheme]);

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
