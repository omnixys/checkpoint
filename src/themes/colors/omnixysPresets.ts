import type { OmnixysColorScheme, OmnixysPresetExtended } from "@/checkpoint/themes/paletteTypes";

export const omnixysPresets: Record<OmnixysColorScheme, OmnixysPresetExtended> = {
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
      primary: "#22C55E",
      secondary: "#15803D",
      backgroundDefault: "#F0FDF4",
      backgroundPaper: "#DCFCE7",
      textPrimary: "#14532D",
      textSecondary: "#166534",
      error: "#DC2626",
      success: "#22C55E",
    },
    dark: {
      primary: "#22C55E",
      secondary: "#15803D",
      backgroundDefault: "#0B1F14",
      backgroundPaper: "#102A1F",
      textPrimary: "#D1FAE5",
      textSecondary: "#A7F3D0",
      error: "#F87171",
      success: "#22C55E",
    },
    visual: {
      light: {
        glow: {
          primary: "#22C55E",
          secondary: "#4ADE80",
          accent: "#86EFAC",
        },
        gradient: {
          orb: ["#22C55E", "#4ADE80", "#86EFAC"],
          rays: ["#86EFAC", "#4ADE80", "#22C55E"],
        },
        shadow: {
          glow: "rgba(34,197,94,0.6)",
        },
      },
      dark: {
        glow: {
          primary: "#22C55E",
          secondary: "#4ADE80",
          accent: "#86EFAC",
        },
        gradient: {
          orb: ["#22C55E", "#4ADE80", "#86EFAC"],
          rays: ["#86EFAC", "#4ADE80", "#22C55E"],
        },
        shadow: {
          glow: "rgba(34,197,94,0.6)",
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

  brown: {
    light: {
      primary: "#8B5E3C",
      secondary: "#6F4E37",
      backgroundDefault: "#FDF8F6",
      backgroundPaper: "#F5ECE6",
      textPrimary: "#3E2723",
      textSecondary: "#6D4C41",
      error: "#DC2626",
      success: "#22C55E",
    },

    dark: {
      primary: "#8B5E3C",
      secondary: "#6F4E37",
      backgroundDefault: "#1A120E",
      backgroundPaper: "#241813",
      textPrimary: "#F5EDE8",
      textSecondary: "#D7CCC8",
      error: "#F87171",
      success: "#22C55E",
    },

    visual: {
      light: {
        glow: {
          primary: "#8B5E3C",
          secondary: "#A47148",
          accent: "#C19A6B",
        },
        gradient: {
          orb: ["#8B5E3C", "#A47148", "#C19A6B"],
          rays: ["#C19A6B", "#D2B48C", "#A47148"],
        },
        shadow: {
          glow: "rgba(139,94,60,0.55)",
        },
      },

      dark: {
        glow: {
          primary: "#8B5E3C",
          secondary: "#A47148",
          accent: "#C19A6B",
        },
        gradient: {
          orb: ["#8B5E3C", "#A47148", "#C19A6B"],
          rays: ["#C19A6B", "#D2B48C", "#A47148"],
        },
        shadow: {
          glow: "rgba(139,94,60,0.6)",
        },
      },
    },
  },

  wedding: {
    light: {
      primary: "#9B6B24",
      secondary: "#5C4930",
      backgroundDefault: "#F7F2E9",
      backgroundPaper: "#FFFDF8",
      textPrimary: "#241D16",
      textSecondary: "#6D6256",
      error: "#B42318",
      success: "#557A46",
    },
    dark: {
      primary: "#D8B879",
      secondary: "#F1ECE2",
      backgroundDefault: "#050506",
      backgroundPaper: "#0D0C0C",
      textPrimary: "#F1ECE2",
      textSecondary: "#AAA39A",
      error: "#F28B82",
      success: "#9BC58C",
    },
    visual: {
      light: {
        glow: {
          primary: "#B68A45",
          secondary: "#D8B879",
          accent: "#F0DFC0",
        },
        gradient: {
          orb: ["#9B6B24", "#D8B879", "#F0DFC0"],
          rays: ["#E8CF9D", "#D8B879", "#A87931"],
        },
        shadow: {
          glow: "rgba(155,107,36,0.42)",
        },
      },
      dark: {
        glow: {
          primary: "#D8B879",
          secondary: "#A87931",
          accent: "#F1ECE2",
        },
        gradient: {
          orb: ["#4A351E", "#A87931", "#D8B879"],
          rays: ["#D8B879", "#8E642E", "#F1ECE2"],
        },
        shadow: {
          glow: "rgba(216,184,121,0.42)",
        },
      },
    },
  },
};
