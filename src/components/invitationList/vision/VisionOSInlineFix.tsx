"use client";

import { Box, Typography, TextField } from "@mui/material";
import { motion } from "framer-motion";

export function VisionOSInlineFix({
  rowIndex,
  row,
  onEdit,
}: {
  rowIndex: number;
  row: any;
  onEdit: (newRow: any) => void;
}) {
  return (
    <motion.div
      initial={{ background: "rgba(255,200,200,0.4)" }}
      animate={{
        background: "rgba(255,255,255,0.35)",
        transition: { delay: 0.6 },
      }}
      style={{
        borderRadius: 16,
        padding: "16px",
        marginBottom: "12px",
        backdropFilter: "blur(30px)",
      }}
    >
      <Typography fontWeight={600} sx={{ mb: 1 }}>
        Fehler in Zeile {rowIndex + 2} korrigieren
      </Typography>

      {Object.keys(row).map((key) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Typography fontSize={13} sx={{ opacity: 0.6 }}>
            {key}
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={row[key] ?? ""}
            onChange={(e) => onEdit({ ...row, [key]: e.target.value })}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.65)",
            }}
          />
        </Box>
      ))}
    </motion.div>
  );
}
