"use client";

import { Dialog, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export function VisionOSSuccessSheet({
  open,
  onClose,
  count,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
}) {
  function fire() {
    confetti({
      particleCount: 140,
      spread: 65,
      origin: { y: 0.6 },
      colors: ["#d4ffd5", "#ffffff"],
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100, damping: 15 },
        }}
      >
        <Box
          sx={{
            p: 4,
            borderRadius: 5,
            textAlign: "center",
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow:
              "0 15px 60px rgba(0,0,0,0.25), inset 0 0 40px rgba(255,255,255,0.3)",
          }}
        >
          <Typography
            fontSize={26}
            fontWeight={700}
            sx={{ mb: 2, color: "rgba(0,0,0,0.85)" }}
          >
            Import erfolgreich!
          </Typography>

          <Typography sx={{ mb: 3, opacity: 0.8 }}>
            {count} Einträge importiert
          </Typography>

          <Button
            variant="contained"
            onClick={() => {
              fire();
              onClose();
            }}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1,
              fontSize: 16,
              fontWeight: 600,
              background: "linear-gradient(180deg, #a1e9b1, #6adf89, #32d764)",
              color: "#003300",
              boxShadow: "0 6px 25px rgba(0,255,80,0.35)",
            }}
          >
            Fertig
          </Button>
        </Box>
      </motion.div>
    </Dialog>
  );
}
