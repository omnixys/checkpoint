"use client";

import React from "react";
import { useTheme, Box } from "@mui/material";
import { motion } from "framer-motion";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

/* ----------------------------------------------------------------------------
 * VisionOS Floating Back-to-Top FAB
 * - Glassy Bubble
 * - Floating Lift Hover
 * - Smooth fade in/out
 * - Bounce scroll animation
 * --------------------------------------------------------------------------- */
export default function BackToTopButton({ visible }: { visible: boolean }) {
  const theme = useTheme();

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 90,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.6,
        y: visible ? 0 : 50,
      }}
      transition={{
        duration: 0.25,
        type: "spring",
        stiffness: 240,
        damping: 22,
      }}
    >
      <motion.div
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.16 },
        }}
        whileTap={{
          scale: 0.88,
          transition: { duration: 0.14 },
        }}
        onClick={scrollTop}
      >
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            // VisionOS glass bubble
            backdropFilter: "blur(14px)",
            backgroundColor: theme.palette.background.paper + "CC",
            boxShadow: theme.shadows[6],
          }}
        >
          <KeyboardArrowUpRoundedIcon
            sx={{ fontSize: 32, color: theme.palette.text.primary }}
          />
        </Box>
      </motion.div>
    </motion.div>
  );
}
