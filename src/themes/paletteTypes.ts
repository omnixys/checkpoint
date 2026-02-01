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

export type OmnixysColorScheme =
  | "original"
  | "red"
  | "green"
  | "yellow"
  | "blue";
