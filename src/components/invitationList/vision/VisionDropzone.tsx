"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import DownloadIcon from "@mui/icons-material/Download";

/* ---------------------------------------------------------------------
 * VisionOS Premium Drag & Drop Zone
 * - Parallax
 * - Glassmorphism
 * - Glow ring
 * - Touch-friendly
 * ------------------------------------------------------------------- */
export default function VisionDropzone({
  file,
  onSelect,
}: {
  file: File | null;
  onSelect: (file: File) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        x.set(dx / 4);
        y.set(dy / 4);
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) onSelect(f);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("visionUploadInput")?.click()}
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        style={{
          borderRadius: 32,
          padding: 32,
          cursor: "pointer",
          userSelect: "none",
          textAlign: "center",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.25))",
          backdropFilter: "blur(50px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow:
            "inset 0 0 40px rgba(255,255,255,0.2), 0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Glow Ring */}
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            margin: "0 auto",
            mb: 2,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.15))",
            boxShadow:
              "0 0 35px rgba(255,255,255,0.55), inset 0 0 18px rgba(255,255,255,0.3)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DownloadIcon sx={{ fontSize: 38, opacity: 0.85 }} />
        </Box>

        <Typography fontSize={20} fontWeight={600} sx={{ opacity: 0.85 }}>
          Datei ablegen oder auswählen
        </Typography>
        <Typography fontSize={13} sx={{ mt: 0.5, opacity: 0.6 }}>
          Unterstützt: CSV, XLSX
        </Typography>

        {file && (
          <Typography fontSize={13} sx={{ mt: 2, opacity: 0.75 }}>
            Gewählt: {file.name}
          </Typography>
        )}

        <input
          id="visionUploadInput"
          type="file"
          hidden
          accept=".csv,.xlsx"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSelect(f);
          }}
        />
      </motion.div>
    </motion.div>
  );
}
