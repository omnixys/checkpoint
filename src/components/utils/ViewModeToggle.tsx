"use client";

import React from "react";
import { Box, Stack, useTheme, alpha, Typography, Tooltip } from "@mui/material";

import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import ImageIcon from "@mui/icons-material/Image";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BlurOnIcon from "@mui/icons-material/BlurOn";

import { motion } from "framer-motion";
import { EventVisualOverride, EventViweMode } from "@/checkpoint/types/event.type";

type Props = {
  viewMode: EventViweMode;
  onViewModeChange: (v: EventViweMode) => void;

  visualOverride: EventVisualOverride;
  onVisualOverrideChange: (v: EventVisualOverride) => void;

  disabled: boolean;
};

/* --------------------------------------------------------
 * Segmented Button with Tooltip + Disabled
 * ------------------------------------------------------ */
function SegmentedButton({
  active,
  onClick,
  children,
  tooltip,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tooltip: string;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <Tooltip title={disabled ? "" : tooltip} arrow enterDelay={300} disableInteractive>
      <motion.div
        {...(!disabled && {
          whileTap: { scale: 0.94 },
          whileHover: { scale: 1.03 },
        })}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Box
          onClick={!disabled ? onClick : undefined}
          role="button"
          aria-label={tooltip}
          sx={{
            cursor: disabled ? "not-allowed" : "pointer",
            px: 2,
            py: 1,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: 1,

            bgcolor: active
              ? alpha(theme.palette.primary.main, disabled ? 0.08 : 0.18)
              : "transparent",

            color: disabled
              ? alpha(theme.palette.text.disabled, 0.6)
              : active
                ? theme.palette.primary.main
                : theme.palette.text.secondary,

            opacity: disabled ? 0.5 : 1,
            transition: "all 0.25s ease",
            userSelect: "none",
            pointerEvents: disabled ? "none" : "auto",

            "&:hover": {
              backgroundColor: disabled ? "transparent" : alpha(theme.palette.primary.main, 0.12),
            },
          }}
        >
          {children}
        </Box>
      </motion.div>
    </Tooltip>
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
  disabled,
}: Props) {
  const theme = useTheme();

  const visualDisabled = disabled || viewMode === "list";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: { xs: "center", sm: "flex-start" },
      }}
    >
      <Stack
        spacing={2}
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
        {/* VIEW MODE */}
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
            tooltip="Listenansicht"
            disabled={disabled}
          >
            <ViewListIcon fontSize="small" />
            <Typography variant="body2">Liste</Typography>
          </SegmentedButton>

          <SegmentedButton
            active={viewMode === "grid"}
            onClick={() => onViewModeChange("grid")}
            tooltip="Grid Ansicht"
            disabled={disabled}
          >
            <GridViewIcon fontSize="small" />
            <Typography variant="body2">Grid</Typography>
          </SegmentedButton>
        </Box>

        {/* VISUAL MODE */}
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
            opacity: visualDisabled ? 0.5 : 1,
          }}
        >
          <SegmentedButton
            active={visualOverride === "auto"}
            onClick={() => onVisualOverrideChange("auto")}
            tooltip="Automatisch"
            disabled={visualDisabled}
          >
            <BlurOnIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "image"}
            onClick={() => onVisualOverrideChange("image")}
            tooltip="Bild anzeigen"
            disabled={visualDisabled}
          >
            <ImageIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "banner"}
            onClick={() => onVisualOverrideChange("banner")}
            tooltip="Banner anzeigen"
            disabled={visualDisabled}
          >
            <HorizontalRuleIcon fontSize="small" />
          </SegmentedButton>

          <SegmentedButton
            active={visualOverride === "none"}
            onClick={() => onVisualOverrideChange("none")}
            tooltip="Ohne Vorschau"
            disabled={visualDisabled}
          >
            <ViewListIcon fontSize="small" />
          </SegmentedButton>
        </Box>
      </Stack>
    </Box>
  );
}
