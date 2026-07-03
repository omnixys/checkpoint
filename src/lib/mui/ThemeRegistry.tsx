"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import * as React from "react";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";

/**
 * Emotion cache must be stable across renders
 */
function createEmotionCache() {
  return createCache({
    key: "mui",
    prepend: true,
  });
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo(() => createEmotionCache(), []);

  const { mode, scheme } = useThemeMode();

  /**
   * IMPORTANT:
   * No mounted check → must be deterministic SSR/CSR
   */
  const theme = React.useMemo(() => createAppTheme(mode, scheme), [mode, scheme]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
