"use client";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

/* --------------------------------------------------------------------
 * Guard Component
 * Blocks the page if no activeEventId is set.
 * Shows:
 *  - Premium VisionOS Empty State
 *  - Modal (first reminder)
 * ------------------------------------------------------------------ */
export default function ActiveEventGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const { activeEventId, loading } = useActiveEvent();

  const [open, setOpen] = React.useState(true);

  // While loading events → show nothing
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
        }}
      >
        <Typography variant="body1">Lade Event-Daten…</Typography>
      </Box>
    );
  }

  // If an event is selected → show normal page
  if (activeEventId) {
    return <>{children}</>;
  }

  /* ----------------------------------------------------------------
   * Empty State (VisionOS Card)
   * ---------------------------------------------------------------- */
  return (
    <>
      {/* Modal Reminder */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ backdropFilter: "blur(12px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          style={{
            background: theme.palette.background.paper,
            borderRadius: 24,
            maxWidth: 420,
            margin: "120px auto",
            padding: "28px 32px",
          }}
        >
          <Typography variant="h6" fontWeight={700} textAlign="center">
            Aktives Event auswählen
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 1.5, textAlign: "center", opacity: 0.75 }}
          >
            Um diese Seite zu nutzen, musst du zuerst ein Event auswählen.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              href="/event"
              sx={{ borderRadius: 2 }}
            >
              Event auswählen
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={() => setOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Später
            </Button>
          </Stack>
        </motion.div>
      </Modal>

      {/* Empty State Card */}
      <Box
        sx={{
          width: "100%",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        >
          <Box
            sx={{
              p: 4,
              borderRadius: 4,
              backdropFilter: "blur(40px)",
              bgcolor: theme.palette.background.default + "60",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 8px 32px ${theme.palette.divider}`,
              maxWidth: 420,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 52,
                opacity: 0.35,
                mb: 1,
                userSelect: "none",
              }}
            >
              🎟️
            </Typography>

            <Typography variant="h6" fontWeight={700}>
              Kein aktives Event ausgewählt
            </Typography>

            <Typography variant="body1" sx={{ mt: 1, opacity: 0.75 }}>
              Wähle eines deiner Events aus, um fortzufahren.
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3, borderRadius: 2 }}
              href="/event"
            >
              Event auswählen
            </Button>
          </Box>
        </motion.div>
      </Box>
    </>
  );
}
