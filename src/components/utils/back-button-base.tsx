"use client";

import { Button, alpha, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export type BackButtonBaseProps = {
  href: string;
  label: string;
  /**
   * Optional override for animation (for future extensibility)
   */
  disableAnimation?: boolean;
};

/**
 * Core reusable Back Button component.
 *
 * Responsibilities:
 * - Pure UI rendering
 * - Animation
 * - Styling
 *
 * No routing logic, no domain logic.
 */
export function BackButtonBase({ href, label, disableAnimation = false }: BackButtonBaseProps) {
  const theme = useTheme();

  const content = (
    <Button
      component={Link}
      href={href}
      startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
      sx={{
        borderRadius: "14px",
        px: 2,
        py: 0.8,
        textTransform: "none",
        fontWeight: 600,
        backdropFilter: "blur(14px)",
        backgroundColor: alpha(theme.palette.background.paper, 0.35),
        transition: "all 0.25s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          transform: "translateX(-2px)",
        },
      }}
    >
      {label}
      {/* Zurück zur Liste */}
    </Button>
  );

  if (disableAnimation) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {content}
    </motion.div>
  );
}
