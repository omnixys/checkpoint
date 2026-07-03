import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type React from "react";

interface AppleCardProps {
  children: React.ReactNode;
  padding?: number;
}

const GlassCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  padding: "16px",
  width: "100%",
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.65)",
  backdropFilter: "blur(20px)",
}));

export const AppleCard: React.FC<AppleCardProps> = ({ children }) => (
  <GlassCard>{children}</GlassCard>
);
