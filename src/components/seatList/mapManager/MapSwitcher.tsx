"use client";

import React from "react";
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  alpha,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

export type MapType = "cinema" | "circular" | "hybrid" | "cluster" | "default" | "list";

export default function MapSwitcher({
  value,
  onChange,
}: {
  value: MapType;
  onChange: (v: MapType) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        alignSelf: "center",
        bgcolor: alpha(theme.palette.background.paper, 0.45),
        px: 1,
        py: 0.6,
        borderRadius: "20px",
        backdropFilter: "blur(16px)",
      }}
    >
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, v) => v && onChange(v)}
        sx={{
          "& .MuiToggleButton-root": {
            borderRadius: "12px",
            px: 2.4,
            py: 0.8,
          },
        }}
      >
        {/* <ToggleButton value="cinema">Cinema</ToggleButton>
        <ToggleButton value="circular">Circular</ToggleButton>
        <ToggleButton value="hybrid">Hybrid</ToggleButton> */}
        <ToggleButton value="default">Default</ToggleButton>
        <ToggleButton value="list">Liste</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
