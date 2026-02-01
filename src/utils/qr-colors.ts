// utils/qr-colors.ts
import { getLuminance } from "./color";

export type QrColors = {
  fg: string;
  bg: string;
};

/**
 * Omnixys-aware QR color resolver
 * - Always dark-on-light
 * - Uses Omnixys colors first
 * - Falls back only when required for scan safety
 */
export function getOmnixysQrColors(params: {
  background: string; // omnixys.backgroundPaper
  primary: string; // omnixys.primary
  textPrimary: string; // omnixys.textPrimary
  lightFallback: string; // omnixys.backgroundPaper (light variant)
}): QrColors {
  const bgLum = getLuminance(params.background);

  // Threshold tuned for Omnixys palette
  const isLight = bgLum > 0.72;

  if (isLight) {
    // Light Omnixys theme → use brand colors directly
    return {
      bg: params.background,
      fg: params.primary,
    };
  }

  // Dark Omnixys theme → force light background, dark foreground
  return {
    bg: params.lightFallback,
    fg: params.textPrimary,
  };
}
