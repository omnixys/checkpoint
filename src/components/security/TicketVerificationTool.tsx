"use client";

import React, { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------
 * TicketVerificationTool
 * - Manual ticket check (ID/QR input)
 * - Shows verdict panel (OK / WARNING / DENIED)
 * ------------------------------------------------------------------- */
export default function TicketVerificationTool({
  onVerify,
}: {
  onVerify: (ticketId: string) => Promise<{
    verdict: "OK" | "WARNING" | "DENIED";
    message: string;
  }>;
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    verdict: "OK" | "WARNING" | "DENIED";
    message: string;
  }>(null);

  async function handleCheck() {
    if (!input.trim()) return;
    const res = await onVerify(input.trim());
    setResult(res);
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.18)",
          borderRadius: "24px",
        }}
      >
        <Typography fontSize="1.1rem" fontWeight={600} sx={{ mb: 2 }}>
          Ticket Verification
        </Typography>

        <TextField
          label="Ticket ID / QR / ShareCode"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
            },
          }}
        />

        <Button
          onClick={handleCheck}
          variant="contained"
          sx={{
            mt: 1,
            py: 1.2,
            borderRadius: "16px",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Verify Ticket
        </Button>

        {result && <VerdictPanel {...result} />}
      </Box>
    </Stack>
  );
}

function VerdictPanel({
  verdict,
  message,
}: {
  verdict: "OK" | "WARNING" | "DENIED";
  message: string;
}) {
  const color =
    verdict === "OK"
      ? "#34c759"
      : verdict === "WARNING"
      ? "#ffcc00"
      : "#ff3b30";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Box
        sx={{
          mt: 2,
          px: 2,
          py: 2,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.22)",
          borderLeft: `6px solid ${color}`,
          boxShadow: `0 0 20px ${color}55`,
        }}
      >
        <Typography fontWeight={600} sx={{ color }}>
          {verdict}
        </Typography>
        <Typography sx={{ opacity: 0.7, mt: 0.5 }}>{message}</Typography>
      </Box>
    </motion.div>
  );
}
