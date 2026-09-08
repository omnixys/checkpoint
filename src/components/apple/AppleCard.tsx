import { alpha, Paper, type SxProps, type Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import type React from "react";

interface AppleCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const GlassCard = styled(Paper)(({ theme }) => {
  const isDark = theme.palette.mode === "dark";

  return {
    borderRadius: theme.shape.borderRadius,
    padding: 2,
    width: "100%",
    border: "1px solid",
    borderColor: theme.palette.extended.border.subtle,
    // VisionOS-style liquid-glass surface: translucent paper over a
    // backdrop, a subtle inner light edge and a tinted, deep shadow.
    background: alpha(theme.palette.background.paper, isDark ? 0.72 : 0.8),
    backdropFilter: "blur(28px)",
    WebkitBackdropFilter: "blur(28px)",
    boxShadow: isDark
      ? `0 34px 90px ${alpha("#000000", 0.48)}, inset 0 1px 0 ${alpha("#FFFFFF", 0.08)}`
      : `0 34px 90px ${alpha(theme.palette.primary.main, 0.12)}, inset 0 1px 0 ${alpha(
          "#FFFFFF",
          0.9,
        )}`,

    "@media (prefers-reduced-transparency: reduce)": {
      background: theme.palette.background.paper,
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
    },
  };
});

export const AppleCard: React.FC<AppleCardProps> = ({ children, sx }) => (
  <GlassCard sx={sx}>{children}</GlassCard>
);
