"use client";

import React from "react";
import { motion } from "framer-motion";

export default function RefreshOrbButton({ onReload }) {
  return (
    <motion.div
      onClick={onReload}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        cursor: "pointer",
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.05))",
        boxShadow:
          "0 4px 20px rgba(255,255,255,0.35), inset 0 -2px 12px rgba(0,0,0,0.2)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        style={{ width: 18, height: 18 }}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4v2m0 12v2m8-8h-2M6 12H4m12.95 4.95l-1.41-1.41M7.46 7.46L6.05 6.05m10.49-.41l-1.41 1.41M7.46 16.54l-1.41 1.41"
            stroke="#111"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
