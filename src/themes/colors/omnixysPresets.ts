import {
  OmnixysColorScheme,
  OmnixysPresetExtended,
} from "@/checkpoint/themes/paletteTypes";

export const omnixysPresets: Record<OmnixysColorScheme, OmnixysPresetExtended> =
  {
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

      visual: {
        light: {
          glow: {
            primary: "#6A4BBC",
            secondary: "#4E3792",
            accent: "#A78BFA",
          },
          gradient: {
            orb: ["#6A4BBC", "#8B5CF6", "#C084FC"],
            rays: ["#A78BFA", "#60A5FA", "#F472B6"],
          },
          shadow: {
            glow: "rgba(106,75,188,0.55)",
          },
        },
        dark: {
          glow: {
            primary: "#6A4BBC",
            secondary: "#4E3792",
            accent: "#A78BFA",
          },
          gradient: {
            orb: ["#6A4BBC", "#8B5CF6", "#C084FC"],
            rays: ["#A78BFA", "#60A5FA", "#F472B6"],
          },
          shadow: {
            glow: "rgba(106,75,188,0.55)",
          },
        },
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

      visual: {
        light: {
          glow: {
            primary: "#DC2626",
            secondary: "#F87171",
            accent: "#FCA5A5",
          },
          gradient: {
            orb: ["#DC2626", "#F87171", "#FCA5A5"],
            rays: ["#FCA5A5", "#FB7185", "#F87171"],
          },
          shadow: {
            glow: "rgba(220,38,38,0.55)",
          },
        },
        dark: {
          glow: {
            primary: "#DC2626",
            secondary: "#F87171",
            accent: "#FCA5A5",
          },
          gradient: {
            orb: ["#DC2626", "#F87171", "#FCA5A5"],
            rays: ["#FCA5A5", "#FB7185", "#F87171"],
          },
          shadow: {
            glow: "rgba(220,38,38,0.55)",
          },
        },
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

      visual: {
        light: {
          glow: {
            primary: "#16A34A",
            secondary: "#22C55E",
            accent: "#4ADE80",
          },
          gradient: {
            orb: ["#16A34A", "#22C55E", "#4ADE80"],
            rays: ["#4ADE80", "#34D399", "#22C55E"],
          },
          shadow: {
            glow: "rgba(22,163,74,0.55)",
          },
        },
        dark: {
          glow: {
            primary: "#16A34A",
            secondary: "#22C55E",
            accent: "#4ADE80",
          },
          gradient: {
            orb: ["#16A34A", "#22C55E", "#4ADE80"],
            rays: ["#4ADE80", "#34D399", "#22C55E"],
          },
          shadow: {
            glow: "rgba(22,163,74,0.55)",
          },
        },
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

      visual: {
        light: {
          glow: {
            primary: "#F59E0B",
            secondary: "#FBBF24",
            accent: "#FCD34D",
          },
          gradient: {
            orb: ["#F59E0B", "#FBBF24", "#FCD34D"],
            rays: ["#FCD34D", "#FDE68A", "#FBBF24"],
          },
          shadow: {
            glow: "rgba(245,158,11,0.55)",
          },
        },
        dark: {
          glow: {
            primary: "#F59E0B",
            secondary: "#FBBF24",
            accent: "#FCD34D",
          },
          gradient: {
            orb: ["#F59E0B", "#FBBF24", "#FCD34D"],
            rays: ["#FCD34D", "#FDE68A", "#FBBF24"],
          },
          shadow: {
            glow: "rgba(245,158,11,0.55)",
          },
        },
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

      visual: {
        light: {
          glow: {
            primary: "#2563EB",
            secondary: "#3B82F6",
            accent: "#60A5FA",
          },
          gradient: {
            orb: ["#2563EB", "#3B82F6", "#60A5FA"],
            rays: ["#60A5FA", "#93C5FD", "#3B82F6"],
          },
          shadow: {
            glow: "rgba(37,99,235,0.55)",
          },
        },
        dark: {
          glow: {
            primary: "#2563EB",
            secondary: "#3B82F6",
            accent: "#60A5FA",
          },
          gradient: {
            orb: ["#2563EB", "#3B82F6", "#60A5FA"],
            rays: ["#60A5FA", "#93C5FD", "#3B82F6"],
          },
          shadow: {
            glow: "rgba(37,99,235,0.55)",
          },
        },
      },
    },
  };