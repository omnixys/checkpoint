import type { PaletteMode } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ColorScale, OmnixysExtendedPalette } from "@/checkpoint/themes/paletteTypes";

export function buildExtendedPalette(mode: PaletteMode, omni: ColorScale): OmnixysExtendedPalette {
  const isDark = mode === "dark";

  return {
    surface: {
      level1: omni.backgroundDefault,
      level2: omni.backgroundPaper,
      level3: isDark ? alpha("#FFFFFF", 0.04) : alpha("#000000", 0.04),
    },

    border: {
      subtle: isDark ? alpha("#FFFFFF", 0.08) : alpha("#000000", 0.08),

      strong: isDark ? alpha("#FFFFFF", 0.16) : alpha("#000000", 0.16),
    },
  };
}
