import { omnixysPresets } from "@/checkpoint/themes/colors/omnixysPresets";
import { OmnixysColorScheme } from "./paletteTypes";

export type RGB = readonly [number, number, number];


function hexToRgb(hex: string): RGB {
  const cleaned = hex.replace("#", "");

  const parts = cleaned.match(/.{1,2}/g);

  if (!parts || parts.length !== 3) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const nums = parts.map((x) => parseInt(x, 16));

  const [r, g, b] = nums;

  // zusätzliche Sicherheit (optional, aber sauber)
  if (
    r === undefined ||
    g === undefined ||
    b === undefined ||
    Number.isNaN(r) ||
    Number.isNaN(g) ||
    Number.isNaN(b)
  ) {
    throw new Error(`Invalid RGB conversion: ${hex}`);
  }

  return [r, g, b];
}
/**
 * Central visual token builder.
 *
 * This function is the single source of truth for all
 * non-standard visual styling (shader, orb, logo, background).
 *
 * This eliminates magic numbers across the UI layer.
 */
export function buildVisualTokens(
  mode: "light" | "dark",
  scheme: OmnixysColorScheme,
) {
  const isDark = mode === "dark";

const schemeMap = Object.fromEntries(
  Object.entries(omnixysPresets).map(([key, preset]) => {
    return [key, hexToRgb(preset.light.primary)];
  }),
) as Record<OmnixysColorScheme, RGB>;

  const base = schemeMap[scheme];

  const toRgba = (rgb: RGB, alpha: number) =>
    `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;

  return {
    background: {
      base: isDark ? "#000000" : "#ffffff",
    },

    orb: {
      gradient: `radial-gradient(circle at 50% 55%, ${toRgba(base, 0.65)}, ${toRgba(
        base,
        0.45,
      )}, ${toRgba(base, 0.25)})`,
      glow: `0 0 150px 70px ${toRgba(base, 0.55)}`,
    },

    shader: {
      brightness: isDark ? 0.3 : 0.75,
      colorA: base,
      colorB: isDark ? ([255, 255, 255] as const) : ([0, 0, 0] as const),
    },

    logo: {
      src: `/logo/omnixys-original.png`,
    },
  };
}
