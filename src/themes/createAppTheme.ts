import { createTheme, type PaletteMode } from "@mui/material";
import { buildExtendedPalette } from "@/checkpoint/themes/buildExtendedPalette";
import { buildVisualTokens } from "@/checkpoint/themes/buildVisualTokens";
import { appleDark, appleLight } from "./colors/appleColors";
import { omnixysPresets } from "./colors/omnixysPresets";
import { createComponentOverrides } from "./components";
import type { OmnixysColorScheme } from "./paletteTypes";

export const createAppTheme = (mode: PaletteMode, scheme: OmnixysColorScheme = "original") => {
  const apple = mode === "light" ? appleLight : appleDark;
  const omnixys = omnixysPresets[scheme];
  const omni = omnixys[mode];
  const visual = buildVisualTokens(mode, scheme);

  const extended = buildExtendedPalette(mode, omni);
  const isWedding = scheme === "wedding";
  const bodyFont = isWedding
    ? "var(--font-wedding-sans), Lato, Arial, sans-serif"
    : "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', Inter, Roboto, sans-serif";
  const editorialFont = isWedding
    ? "var(--font-wedding-serif), 'Playfair Display', Georgia, serif"
    : bodyFont;

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
      fontFamily: bodyFont,
      h1: { fontFamily: editorialFont, fontWeight: 500 },
      h2: { fontFamily: editorialFont, fontWeight: 500 },
      h3: { fontFamily: editorialFont, fontWeight: 500 },
      h4: { fontFamily: editorialFont, fontWeight: 500 },
      button: {
        fontFamily: bodyFont,
        letterSpacing: isWedding ? "0.08em" : undefined,
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: isWedding ? 20 : 16,
      borderRadius2: 5,
      sectionRadius: 3,
      buttonRadius: 3,
    },
    spacing: 8,

    omnixys: {
      scheme,
      visual,
    },
  });

  baseTheme.components = createComponentOverrides(baseTheme);

  return baseTheme;
};
