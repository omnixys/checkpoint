"use client";

import React, { useState } from "react";
import { alpha, IconButton, useTheme } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { motion } from "framer-motion";

export default function RefreshArcButton({ onReload }: { onReload: any }) {
  const [spin, setSpin] = useState(false);
  const theme = useTheme();

  const trigger = async () => {
    setSpin(true);
    await onReload();
    setTimeout(() => setSpin(false), 600);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Arc Spinner */}
      {spin && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          style={{
            position: "absolute",
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "3px solid rgba(0,0,0,0.12)",
            borderTopColor: "#007aff",
          }}
        />
      )}

      <IconButton
        onClick={trigger}
        sx={{
          width: 42,
          height: 42,
          backdropFilter: "blur(12px)",
          background: alpha(theme.palette.primary.main, 0.15),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: theme.shadows[3],
          "&:hover": {
            background: alpha(theme.palette.primary.main, 0.25),
          },
        }}
      >
        <RefreshRoundedIcon />
      </IconButton>
    </motion.div>
  );
}
