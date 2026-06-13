"use client";

import type { OmnixysColorScheme } from "@/checkpoint/themes/paletteTypes";

/**
 * Resolves the correct logo path based on the active color scheme.
 * This ensures branding consistency across the application.
 */
export function resolveLogoPath(scheme: OmnixysColorScheme): string {
  if (scheme === "wedding" || scheme === "brown") {
    return "/logo/omnixys-original.png";
  }

  return `/logo/omnixys-${scheme}.png`;
}
