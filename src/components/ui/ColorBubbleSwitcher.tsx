"use client";

import { useThemeMode } from "@/providers/ThemeModeProvider";
import { OmnixysColorScheme } from "@/themes/theme1";
import {
  Box,
  Fade,
  IconButton,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useRef, useState } from "react";

// -------------------------------------------------------------
// Available colors
// -------------------------------------------------------------
const schemes: OmnixysColorScheme[] = [
  "original",
  "red",
  "green",
  "yellow",
  "blue",
];

const bubbleColor: Record<OmnixysColorScheme, string> = {
  original: "#6A4BBC",
  red: "#DC2626",
  green: "#16A34A",
  yellow: "#F59E0B",
  blue: "#2563EB",
};

// -------------------------------------------------------------
// VisionOS Floating Color Picker
// -------------------------------------------------------------
export default function ColorBubbleSwitcher() {
  const { scheme, setScheme } = useThemeMode();

  const theme = useTheme();
  const isTouch = useMediaQuery("(hover: none)");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------
  // Show picker (Popover)
  // -------------------------------------------------------------
  const showPicker = (target: HTMLElement) => {
    setAnchorEl(target);
    setOpen(true);
  };

  // -------------------------------------------------------------
  // Desktop Hover
  // -------------------------------------------------------------
  const handleHover = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouch) return; // no hover on touch devices
    showPicker(e.currentTarget);
  };

  // -------------------------------------------------------------
  // Touch tap
  // -------------------------------------------------------------
  const handleTap = (e: React.MouseEvent<HTMLElement>) => {
    if (!isTouch) return; // tap only for touch
    showPicker(e.currentTarget);
  };

  // -------------------------------------------------------------
  // Long Press (iOS style)
  // -------------------------------------------------------------
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (!isTouch) return;

    longPressTimer.current = setTimeout(() => {
      showPicker(e.currentTarget);
    }, 450); // iOS widget long-press timing
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // -------------------------------------------------------------
  // Close picker
  // -------------------------------------------------------------
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Main Color Bubble */}
      <IconButton
        size="small"
        onMouseEnter={handleHover}
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: bubbleColor[scheme],
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.25), 0 0 20px rgba(255,255,255,0.4)",
          transformStyle: "preserve-3d",
          transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
          "&:hover": {
            transform: "scale(1.12) translateZ(12px)",
          },
        }}
      />

      {/* VisionOS Floating Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableAutoFocus
        disableRestoreFocus
        PaperProps={{
          sx: {
            p: 1.5,
            px: 2,
            display: "flex",
            gap: 1.6,
            borderRadius: 4,
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.28)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.25), 0 0 40px rgba(255,255,255,0.25)",
            transformOrigin: "center",
            animation: "visionOSFloat 260ms cubic-bezier(.4,0,.2,1)",
          },
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        {/* Buttons */}
        <Fade in={open} timeout={200}>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
            }}
          >
            {schemes.map((s) => (
              <IconButton
                key={s}
                size="small"
                onClick={() => {
                  setScheme(s);
                  handleClose();
                }}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: bubbleColor[s],
                  boxShadow:
                    s === scheme
                      ? "0 0 0 3px rgba(0,0,0,0.2)"
                      : "0 6px 18px rgba(0,0,0,0.2)",
                  transition:
                    "all 0.25s cubic-bezier(.4,0,.2,1), transform 0.2s ease",
                  transform: s === scheme ? "scale(1.18)" : "scale(1)",
                  "&:hover": {
                    transform: "scale(1.22)",
                  },
                }}
              />
            ))}
          </Box>
        </Fade>
      </Popover>
    </>
  );
}
