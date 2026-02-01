"use client";

import { ScanResult } from "@/types/scan/scan.type";
import {
  Alert,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

const REASON_LABEL: Record<NonNullable<ScanResult["reason"]>, string> = {
  INVALID_QR: "Ungültiger oder manipulierte QR-Code",
  TICKET_REVOKED: "Ticket wurde widerrufen",
  WRONG_EVENT: "Ticket gehört zu einem anderen Event",
  ALREADY_INSIDE: "Gast ist bereits eingecheckt",
  DEVICE_MISMATCH: "Gerätebindung stimmt nicht überein",
  OK: "Scan erfolgreich",
};

export default function ScanResultCard({ result }: { result: ScanResult }) {
  const theme = useTheme();
  

  const color =
    result.status === "SUCCESS"
      ? theme.palette.success.main
      : result.status === "ERROR"
      ? theme.palette.error.main
      : theme.palette.warning.main;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={2}>
          {/* STATUS */}
          <Chip
            label={result.status}
            sx={{ bgcolor: color + "22", color, fontWeight: 700 }}
          />

          {/* MESSAGE */}
          <Typography variant="h6" fontWeight={700}>
            {result.message}
          </Typography>

          {/* ERROR / WARNING REASON */}
          {!result.valid && result.reason && (
            <Alert severity="error">
              <b>Grund:</b> {REASON_LABEL[result.reason]}
            </Alert>
          )}

          {result.valid && result.reason && result.reason !== "OK" && (
            <Alert severity="warning">
              <b>Hinweis:</b> {REASON_LABEL[result.reason]}
            </Alert>
          )}

          {result.status === "SUCCESS" && (
            <>
              {/* GUEST */}
              {result.guest && (
                <>
                  <Divider />
                  <Typography>
                    <b>Gast:</b> {result.guest.firstName}{" "}
                    {result.guest.lastName}
                  </Typography>
                </>
              )}

              {/* SEAT */}
              {result.seat && (
                <Typography>
                  <b>Sitz:</b> {result.seat.sectionName}
                  {result.seat.tableName && ` · Tisch ${result.seat.tableName}`}
                  {result.seat.number && ` · Platz ${result.seat.number}`}
                </Typography>
              )}

              {/* TICKET */}
              {result.ticket && (
                <>
                  <Divider />
                  <Typography variant="body2">
                    <b>Ticket:</b> {result.ticket.id}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Status: {result.ticket.currentState} ·{" "}
                    {result.ticket.revoked ? "Widerrufen" : "Aktiv"}
                  </Typography>
                </>
              )}
            </>
          )}

          {result.status === "ERROR" && (
            <>
              {/* DEVICE BINDING */}
              {result.device && (
                <>
                  <Divider />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Gerätebindung
                  </Typography>

                  <Typography variant="caption">
                    <b>Hash(ticket):</b> {result.device.hash}
                  </Typography>
   
                  <Typography variant="caption">
                    <b>Aktiviert:</b>
                    {new Date(result.device.activatedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="caption">
                    <b>IP:</b> {result.device.activationIP}
                  </Typography>

                  {!result.deviceMatched && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      QR-Code wurde auf einem anderen Gerät erzeugt
                    </Alert>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
}
