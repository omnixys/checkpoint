"use client";

import { useTheme } from "@mui/material";
import L from "leaflet";
import { useMemo } from "react";

/**
 * -------------------------------------------------------------
 * useMapMarker
 * -------------------------------------------------------------
 * Generates a dynamic SVG marker based on the current theme.
 *
 * WHY:
 * - Avoid static assets
 * - Ensure design consistency with Omnixys theme
 * - Support dark/light + color presets automatically
 * - High DPI / Retina ready (SVG)
 */
export function useMapMarker(): L.Icon {
  const theme = useTheme();

  return useMemo(() => {
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    /**
     * SVG Marker Template
     * - Uses theme colors dynamically
     * - Includes subtle glow + glass effect
     */
    const svg = `
      <svg width="48" height="64" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${secondary}" stop-opacity="1"/>
          </radialGradient>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>

        <path
          d="M24 0C13 0 4 9 4 20c0 14 20 44 20 44s20-30 20-44C44 9 35 0 24 0z"
          fill="url(#g)"
          filter="url(#shadow)"
        />

        <circle
          cx="24"
          cy="20"
          r="8"
          fill="rgba(255,255,255,0.18)"
          stroke="rgba(255,255,255,0.5)"
          stroke-width="1.5"
        />
      </svg>
    `;

    /**
     * Encode SVG as data URL
     * Required for Leaflet compatibility
     */
    const encoded = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");

    return new L.Icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,${encoded}`,
      iconSize: [40, 54],
      iconAnchor: [20, 54],
      className: "omnixys-map-marker",
    });
  }, [theme.palette.primary.main, theme.palette.secondary.main]);
}
