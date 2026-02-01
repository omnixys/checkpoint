"use client";

import React from "react";
import { Box, Stack, TextField, Chip, useTheme } from "@mui/material";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------------
 * Filter component with search + status chips
 * Uses theme colors only.
 * ------------------------------------------------------------------------- */
export default function InvitationFilters({ logic }) {
  const theme = useTheme();

  const statuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    // "SENT",
    // "RSVPED",
    "DECLINED",
    "ACCEPTED",
  ];

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        placeholder="Suchen nach Name..."
        value={logic.search}
        onChange={(e) => logic.setSearch(e.target.value)}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          overflowX: "auto",
          py: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {statuses.map((s) => (
          <Chip
            key={s}
            label={s}
            onClick={() =>
              logic.setStatusFilter(logic.statusFilter === s ? null : s)
            }
            variant={logic.statusFilter === s ? "filled" : "outlined"}
            color={logic.statusFilter === s ? "primary" : "default"}
            sx={{
              borderRadius: "12px",
              whiteSpace: "nowrap",
              px: 1.8,
            }}
          />
        ))}
      </Box>
      
    </Stack>
  );
}
