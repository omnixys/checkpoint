"use client";

import DownloadIcon from "@mui/icons-material/Download";
import { Box, Typography } from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type React from "react";
import { useRef } from "react";

interface Props {
  file: File | null;
  onSelect: (file: File) => void;
}

/* ---------------------------------------------------------------------
 * VisionOS Premium Drag & Drop Zone
 * - Parallax
 * - Glassmorphism
 * - Glow ring
 * - Touch-friendly
 * ------------------------------------------------------------------- */
export default function VisionDropzone({ file, onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);

        x.set(dx / 4);
        y.set(dy / 4);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onDrop={(event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
          const selectedFile = event.dataTransfer.files[0];

          if (selectedFile) {
            onSelect(selectedFile);
          }
        }}
        onDragOver={(event: React.DragEvent<HTMLDivElement>) => {
          event.preventDefault();
        }}
        onClick={() => {
          inputRef.current?.click();
        }}
        sx={{
          borderRadius: 4,
          p: 4,
          cursor: "pointer",
          userSelect: "none",
          textAlign: "center",
          background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0.25))",
          backdropFilter: "blur(50px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "inset 0 0 40px rgba(255,255,255,0.2), 0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            margin: "0 auto",
            mb: 2,
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.15))",
            boxShadow: "0 0 35px rgba(255,255,255,0.55), inset 0 0 18px rgba(255,255,255,0.3)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DownloadIcon sx={{ fontSize: 38, opacity: 0.85 }} />
        </Box>

        <Typography sx={{ opacity: 0.85, fontSize: 20, fontWeight: 600 }}>
          Datei ablegen oder auswählen
        </Typography>

        <Typography sx={{ mt: 0.5, opacity: 0.6, fontSize: 13 }}>Unterstützt: CSV, XLSX</Typography>

        {file ? (
          <Typography sx={{ mt: 2, opacity: 0.75, fontSize: 13 }}>Gewählt: {file.name}</Typography>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          hidden={true}
          accept=".csv,.xlsx"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];

            if (selectedFile) {
              onSelect(selectedFile);
            }
          }}
        />
      </Box>
    </motion.div>
  );
}
