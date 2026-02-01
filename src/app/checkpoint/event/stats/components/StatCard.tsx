"use client";

import { Box, Typography } from "@mui/material";
import { JSX, ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
};

export default function StatCard({
  label,
  value,
  helper,
  icon,
}: Props): JSX.Element {
  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 2,
        backgroundColor: "background.paper",
        boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h4" fontWeight={600}>
        {value}
      </Typography>

      {helper && (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      )}

      {icon}
    </Box>
  );
}
