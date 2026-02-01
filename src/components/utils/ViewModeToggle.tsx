"use client";

import React from "react";
import { Box, Stack, useTheme, alpha, Typography } from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import ImageIcon from "@mui/icons-material/Image";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BlurOnIcon from "@mui/icons-material/BlurOn";

import { motion } from "framer-motion";

type Props = {
  viewMode: "list" | "grid";
  onViewModeChange: (v: "list" | "grid") => void;

  visualOverride: "auto" | "image" | "banner" | "none";
  onVisualOverrideChange: (v: "auto" | "image" | "banner" | "none") => void;
};

/* --------------------------------------------------------
 * Apple-like Segmented Button
 * ------------------------------------------------------ */
function SegmentedButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <motion.div
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Box
        onClick={onClick}
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: active
            ? alpha(theme.palette.primary.main, 0.18)
            : "transparent",
          color: active
            ? theme.palette.primary.main
            : theme.palette.text.secondary,
          transition: "background-color 0.25s ease, color 0.25s ease",
          userSelect: "none",
        }}
      >
        {children}
      </Box>
    </motion.div>
  );
}

/* --------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------ */
export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
  visualOverride,
  onVisualOverrideChange,
}: Props) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: {xs: "center", sm: "flex-start"}, // <— echte Zentrierung
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        direction={{ xs: "column", sm: "row" }}
        sx={{
          flexShrink: 0,
          overflowX: { xs: "auto", sm: "visible" },
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          flexWrap: "nowrap",
        }}
      >
        {/* VIEW MODE (List / Grid) */}
        <Box
          sx={{
            backdropFilter: "blur(14px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
            borderRadius: "16px",
            px: 1,
            py: 0.5,
            display: "flex",
            gap: 0.5,
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <SegmentedButton
            active={viewMode === "list"}
            onClick={() => onViewModeChange("list")}
          >
            <ViewListIcon fontSize="small" />
            <Typography variant="body2">Liste</Typography>
          </SegmentedButton>

          <SegmentedButton
            active={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
          >
            <GridViewIcon fontSize="small" />
            <Typography variant="body2">Grid</Typography>
          </SegmentedButton>
        </Box>

        {/* VISUAL STYLE OVERRIDE */}
        <Box
          sx={{
            backdropFilter: "blur(14px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.3),
            borderRadius: "16px",
            px: 1,
            py: 0.5,
            display: "flex",
            gap: 0.5,
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <SegmentedButton
            active={visualOverride === "auto"}
            onClick={() => onVisualOverrideChange("auto")}
          >
            <BlurOnIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "image"}
            onClick={() => onVisualOverrideChange("image")}
          >
            <ImageIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "banner"}
            onClick={() => onVisualOverrideChange("banner")}
          >
            <HorizontalRuleIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "none"}
            onClick={() => onVisualOverrideChange("none")}
          >
            <ViewListIcon fontSize="small" />
          </SegmentedButton>
        </Box>
      </Stack>
    </Box>
  );
}
