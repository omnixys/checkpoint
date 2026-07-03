import { OmnixysColorScheme } from "@/checkpoint/themes/paletteTypes";
import { appleLight } from "./colors/appleColors";
import { OmnixysPresetExtended } from "./paletteTypes";

declare module "@mui/material/styles" {
  interface Shape {
    borderRadius2: number | string;
    sectionRadius?: number | string;
    buttonRadius?: number | string;
  }

  interface ShapeOptions {
    borderRadius2?: number | string;
    sectionRadius?: number | string;
    buttonRadius?: number | string;
  }

  interface Theme {
    omnixys: {
      scheme: OmnixysColorScheme;
      visual: {
        background: {
          base: string;
        };
        orb: {
          gradient: string;
          glow: string;
        };
        rays: {
          gradient: string;
          blur: string;
        };
        shader: {
          brightness: number;
          colorA: readonly [number, number, number];
          colorB: readonly [number, number, number];
        };
        logo: {
          src: string;
          glow: string;
        };
      };
    };
  }

  interface ThemeOptions {
    omnixys?: {
      scheme?: OmnixysColorScheme;
      visual?: {
        background?: {
          base?: string;
        };
        orb?: {
          gradient?: string;
          glow?: string;
        };
        rays?: {
          gradient?: string;
          blur?: string;
        };
        shader?: {
          brightness?: number;
          colorA?: readonly [number, number, number];
          colorB?: readonly [number, number, number];
        };
        logo?: {
          src?: string;
          glow?: string;
        };
      };
    };
  }

  interface Palette {
    apple: typeof appleLight;
    omnixys: OmnixysPresetExtended;
    extended: OmnixysExtendedPalette;
  }

  interface PaletteOptions {
    apple?: typeof appleLight;
    omnixys?: OmnixysPresetExtended;
    extended: OmnixysExtendedPalette;
  }
}
