export type ColorScale = {
  primary: string;
  secondary: string;

  backgroundDefault: string;
  backgroundPaper: string;

  textPrimary: string;
  textSecondary: string;

  error: string;
  success: string;
};

export type ColorPreset = {
  light: ColorScale;
  dark: ColorScale;
};

export type OmnixysColorScheme = "original" | "red" | "green" | "yellow" | "blue" | "brown";

export type OmnixysExtendedPalette = {
  surface: {
    level1: string;
    level2: string;
    level3: string;
  };
  border: {
    subtle: string;
    strong: string;
  };
};

/**
 * Extended visual tokens for advanced UI (shader, glow, gradients).
 * This avoids hardcoded colors inside components or shaders.
 */
export type OmnixysVisualTokens = {
  glow: {
    primary: string;
    secondary: string;
    accent: string;
  };

  gradient: {
    orb: [string, string, string];
    rays: [string, string, string];
  };

  shadow: {
    glow: string;
  };
};

export type OmnixysPresetExtended = ColorPreset & {
  visual: {
    light: OmnixysVisualTokens;
    dark: OmnixysVisualTokens;
  };
};
