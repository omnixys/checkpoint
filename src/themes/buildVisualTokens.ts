import { OmnixysColorScheme } from "./paletteTypes";

export type RGB = readonly [number, number, number];

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

  const schemeMap: Record<OmnixysColorScheme, RGB> = {
    original: [106, 75, 188],
    red: [220, 38, 38],
    green: [22, 163, 74],
    yellow: [245, 158, 11],
    blue: [37, 99, 235],
  };

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
