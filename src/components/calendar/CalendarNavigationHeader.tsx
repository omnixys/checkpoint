"use client";

import { JSX } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

type Props = {
  date: Date;
  unit: "month" | "year";
  onNavigate: (dir: "prev" | "next") => void;
};

export default function CalendarNavigationHeader({
  date,
  unit,
  onNavigate,
}: Props): JSX.Element {
  const theme = useTheme();

  const label =
    unit === "month"
      ? date.toLocaleDateString("de-DE", { month: "long", year: "numeric" })
      : date.getFullYear();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
      }}
    >
      <IconButton onClick={() => onNavigate("prev")}>
        <ChevronLeftRoundedIcon />
      </IconButton>

      <Typography
        sx={{
          fontWeight: 700,
          color: theme.palette.omnixys.textPrimary,
        }}
      >
        {label}
      </Typography>

      <IconButton onClick={() => onNavigate("next")}>
        <ChevronRightRoundedIcon />
      </IconButton>
    </Box>
  );
}
