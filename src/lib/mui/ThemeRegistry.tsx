"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "@/checkpoint/themes/createAppTheme";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";

/**
 * Emotion cache must be stable across renders
 */
function createEmotionCache() {
  return createCache({
    key: "mui",
    prepend: true,
  });
}

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => createEmotionCache(), []);

  const { mode, scheme } = useThemeMode();

  /**
   * IMPORTANT:
   * No mounted check → must be deterministic SSR/CSR
   */
  const theme = React.useMemo(() => {
    return createAppTheme(mode, scheme);
  }, [mode, scheme]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
