import { PaletteMode, ThemeOptions, createTheme } from "@mui/material";
import { OmnixysColorScheme } from "./paletteTypes";
import { omnixysPresets } from "./colors/omnixysPresets";
import { appleDark, appleLight } from "./colors/appleColors";
import { createComponentOverrides } from "./components";

export const createAppTheme = (
  mode: PaletteMode,
  scheme: OmnixysColorScheme = "original",
) => {
  const apple = mode === "light" ? appleLight : appleDark;
  const omni = omnixysPresets[scheme][mode];

  const baseTheme = createTheme({
    palette: {
      mode,
      primary: { main: omni.primary },
      secondary: { main: omni.secondary },
      error: { main: omni.error },
      success: { main: omni.success },

      background: {
        default: omni.backgroundDefault,
        paper: omni.backgroundPaper,
      },

      text: {
        primary: omni.textPrimary,
        secondary: omni.textSecondary,
      },

      divider: apple.separator,
      apple,
      omnixys: omni,
    },

    typography: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, Roboto, sans-serif",
      button: { textTransform: "none", fontWeight: 600 },
    },

    shape: { borderRadius: 16 },
    spacing: 8,
  });

  baseTheme.components = createComponentOverrides(baseTheme);

  return baseTheme;
};
