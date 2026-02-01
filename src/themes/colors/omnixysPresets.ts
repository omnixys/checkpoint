// src/theme/omnixysPresets.ts

import { ColorPreset, OmnixysColorScheme } from "./paletteTypes";

export const omnixysPresets: Record<OmnixysColorScheme, ColorPreset> = {
  original: {
    light: {
      primary: "#6A4BBC",
      secondary: "#4E3792",
      backgroundDefault: "#F8F8FC",
      backgroundPaper: "#FFFFFF",
      textPrimary: "#312E81",
      textSecondary: "#6B7280",
      error: "#F87171",
      success: "#A3E635",
    },
    dark: {
      primary: "#6A4BBC",
      secondary: "#4E3792",
      backgroundDefault: "#121212",
      backgroundPaper: "#1E1E1E",
      textPrimary: "#EDEDED",
      textSecondary: "#BFBFC7",
      error: "#F87171",
      success: "#A3E635",
    },
  },

  red: {
    light: {
      primary: "#DC2626",
      secondary: "#991B1B",
      backgroundDefault: "#FFF1F2",
      backgroundPaper: "#FFE4E6",
      textPrimary: "#450A0A",
      textSecondary: "#7F1D1D",
      error: "#DC2626",
      success: "#4ADE80",
    },
    dark: {
      primary: "#DC2626",
      secondary: "#991B1B",
      backgroundDefault: "#1C0B0B",
      backgroundPaper: "#2B0E0E",
      textPrimary: "#FEE2E2",
      textSecondary: "#FCA5A5",
      error: "#DC2626",
      success: "#4ADE80",
    },
  },

  green: {
    light: {
      primary: "#16A34A",
      secondary: "#065F46",
      backgroundDefault: "#F0FDF4",
      backgroundPaper: "#DCFCE7",
      textPrimary: "#064E3B",
      textSecondary: "#065F46",
      error: "#DC2626",
      success: "#16A34A",
    },
    dark: {
      primary: "#16A34A",
      secondary: "#065F46",
      backgroundDefault: "#0F172A",
      backgroundPaper: "#1E293B",
      textPrimary: "#D1FAE5",
      textSecondary: "#A7F3D0",
      error: "#F87171",
      success: "#16A34A",
    },
  },

  yellow: {
    light: {
      primary: "#F59E0B",
      secondary: "#B45309",
      backgroundDefault: "#FFFBEB",
      backgroundPaper: "#FEF3C7",
      textPrimary: "#78350F",
      textSecondary: "#92400E",
      error: "#DC2626",
      success: "#A3E635",
    },
    dark: {
      primary: "#F59E0B",
      secondary: "#B45309",
      backgroundDefault: "#1C1917",
      backgroundPaper: "#292524",
      textPrimary: "#FEF3C7",
      textSecondary: "#FCD34D",
      error: "#F87171",
      success: "#A3E635",
    },
  },

  blue: {
    light: {
      primary: "#2563EB",
      secondary: "#1E40AF",
      backgroundDefault: "#EFF6FF",
      backgroundPaper: "#FFFFFF",
      textPrimary: "#1E3A8A",
      textSecondary: "#3B82F6",
      error: "#DC2626",
      success: "#22C55E",
    },
    dark: {
      primary: "#2563EB",
      secondary: "#1E40AF",
      backgroundDefault: "#0F172A",
      backgroundPaper: "#1E293B",
      textPrimary: "#DBEAFE",
      textSecondary: "#93C5FD",
      error: "#DC2626",
      success: "#22C55E",
    },
  },
};
