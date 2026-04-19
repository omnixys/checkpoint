import { PaletteMode, ThemeOptions, createTheme } from "@mui/material";
import { OmnixysColorScheme, OmnixysPresetExtended } from "./paletteTypes";
import { omnixysPresets } from "./colors/omnixysPresets";
import { appleDark, appleLight } from "./colors/appleColors";
import { createComponentOverrides } from "./components";
import { buildExtendedPalette } from "@/checkpoint/themes/buildExtendedPalette";
import { buildVisualTokens } from "@/checkpoint/themes/buildVisualTokens";

export const createAppTheme = (mode: PaletteMode, scheme: OmnixysColorScheme = "original") => {
  const apple = mode === "light" ? appleLight : appleDark;
  const omnixys = omnixysPresets[scheme];
  const omni = omnixys[mode];
    const visual = buildVisualTokens(mode, scheme);


    const extended = buildExtendedPalette(mode, omni);

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

      divider: extended.border.subtle,

      apple,
      omnixys,
      extended,
    },

    typography: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, Roboto, sans-serif",
      button: { textTransform: "none", fontWeight: 600 },
    },

    shape: { borderRadius: 16 },
    spacing: 8,

    omnixys: {
      scheme,
      visual,
    },
  });

  baseTheme.components = createComponentOverrides(baseTheme);

  return baseTheme;
};
