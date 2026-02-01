"use client";

import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

import {
  CREATE_TOKEN,
  ROTATE_TOKEN,
} from "@/graphql/ticket/ticket.mutation";
import { Event } from "@/types/event/event.type";
import {
  CreateTokenRequest,
  CreateTokenResult,
} from "@/types/ticket/ticket-graphql-mutation.type";
import { Ticket } from "@/types/ticket/ticket.type";
import { getDeviceHash } from "@/utils/device-hash";
import ActivateTicketButton from "./ActivateTicketButton";
import { hapticRotate } from "./haptics";
import { qrBeatAnimation } from "./qr-beat";
import QrCountdownRings from "./QrCountdownRings";
import QrRingLegend from "./QrRingLegend";
import { useAutoRotateQr } from "./useAutoRotateQr";
import { useCriticalPhaseHaptic } from "./useCriticalPhaseHaptic";
import { useQrActiveState } from "./useQrActiveState";

const RING_SIZE = 420;
const QR_SIZE = 260;
const QR_INSET = (RING_SIZE - QR_SIZE) / 2; // = 50

type Props = {
  ticket?: Ticket;
  event?: Event;
};

export default function TicketCard({ ticket, event }: Props) {
  const theme = useTheme();

  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const [token, setToken] = useState<string | null>(null);
  const [cycleKey, setCycleKey] = useState(0);

  if (!ticket || !event) {
    return null;
  }

  /* -------------------------------------------------------------
   * States
   * ----------------------------------------------------------- */
  const isDeviceActivated =
    !!ticket.deviceHash &&
    !!ticket.devicePublicKey &&
    !!ticket.deviceActivationAt &&
    !!ticket.deviceActivationIP;

  const isRevoked = ticket.revoked;

  const presenceColor =
    ticket.currentState === "INSIDE" ? omni.success : omni.error;

  /* -------------------------------------------------------------
   * Mutations
   * ----------------------------------------------------------- */
  const [generateToken, { loading: loadingToken }] = useMutation<
    CreateTokenResult,
    CreateTokenRequest
  >(CREATE_TOKEN, {
    onCompleted: (data) => setToken(data?.generateToken ?? null),
  });

  const [rotateNonce, { loading: loadingRotate }] = useMutation(ROTATE_TOKEN);

  const handleRotate = async () => {
    if (isRevoked || !isDeviceActivated) return;

    await rotateNonce({ variables: { input: { ticketId: ticket.id } } });
    const deviceHash = await getDeviceHash();
    const res = await generateToken({
      variables: {
        input: {
          ticketId: ticket.id,
          deviceHash,
        },
      },
    });
    setToken(res?.data?.generateToken ?? null);

    setCycleKey((k) => k + 1); // restart countdown arc
    // Haptic feedback
    hapticRotate();
  };

  useCriticalPhaseHaptic(
    ticket.rotationSeconds,
    5, // critical threshold
    cycleKey // resets on rotate
  );

  useAutoRotateQr({
    rotationSeconds: ticket.rotationSeconds,
    enabled: !isRevoked && isDeviceActivated,
    cycleKey,
    onRotate: handleRotate,
  });

  const isActive = useQrActiveState({
    rotationSeconds: ticket.rotationSeconds,
    cycleKey,
    enabled: !isRevoked && isDeviceActivated,
  });

  /* =============================================================
   * UI
   * ============================================================ */
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 22 }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(36px)",
          WebkitBackdropFilter: "blur(36px)",
          bgcolor:
            theme.palette.mode === "light"
              ? apple.systemBackground + "CC"
              : apple.secondarySystemBackground + "CC",
          border: `1px solid ${apple.separator}`,
        }}
      >
        <Stack spacing={3}>
          {/* -------------------------------------------------- */}
          {/* Header */}
          {/* -------------------------------------------------- */}
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ color: omni.textPrimary }}
            >
              {event.name}
            </Typography>

            <Typography sx={{ color: omni.textSecondary, opacity: 0.75 }}>
              {new Date(event.startsAt).toLocaleString()}
            </Typography>

            <AnimatePresence mode="wait">
              <motion.div
                key={ticket.currentState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <Chip
                  label={isRevoked ? "REVOKED" : ticket.currentState}
                  sx={{
                    mt: 1.5,
                    fontWeight: 700,
                    bgcolor: isRevoked
                      ? omni.error + "22"
                      : presenceColor + "22",
                    color: isRevoked ? omni.error : presenceColor,
                    border: `1px solid ${
                      isRevoked ? omni.error : presenceColor
                    }55`,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* -------------------------------------------------- */}
          {/* REVOKED STATE */}
          {/* -------------------------------------------------- */}
          {isRevoked && (
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: omni.error + "11",
                border: `1px solid ${omni.error}44`,
                textAlign: "center",
              }}
            >
              <Typography fontWeight={700} sx={{ color: omni.error }}>
                Ticket wurde deaktiviert
              </Typography>
              <Typography sx={{ color: omni.textSecondary, mt: 1 }}>
                Bitte wende dich an den Veranstalter.
              </Typography>
            </Box>
          )}

          {/* -------------------------------------------------- */}
          {/* ACTIVATE OR QR */}
          {/* -------------------------------------------------- */}
          {!isRevoked && !isDeviceActivated && (
            <ActivateTicketButton ticketId={ticket.id} />
          )}

          {!isRevoked && isDeviceActivated && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor:
                    theme.palette.mode === "light"
                      ? apple.systemBackground
                      : apple.gray6,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <motion.div
                    {...qrBeatAnimation(ticket.rotationSeconds)}
                    style={{
                      position: "relative",
                      width: RING_SIZE,
                      height: RING_SIZE,
                    }}
                  >
                    <QrCountdownRings
                      nonceSeconds={ticket.rotationSeconds}
                      signatureSeconds={Math.min(8, ticket.rotationSeconds)}
                      size={RING_SIZE}
                      outerStroke={7}
                      innerStroke={5}
                      cycleKey={cycleKey}
                      criticalThresholdSeconds={5}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        inset: QR_INSET,
                        borderRadius: 3,
                        bgcolor:
                          theme.palette.mode === "light"
                            ? apple.systemBackground
                            : apple.gray6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 12px 32px rgba(0,0,0,0.25)`,
                      }}
                    >
                      {/* VisionOS Accent Pulse */}
                      <Box
                        sx={{
                          width: QR_SIZE,
                          height: QR_SIZE,
                          borderRadius: 4,
                          overflow: "hidden",
                          backgroundColor: apple.systemBackground,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />

                      <QRCodeCanvas
                        value={token ?? "NO_TOKEN"}
                        size={260}
                        marginSize={3}
                        fgColor={omni.primary}
                        // bgColor={apple.systemBackground}
                      />

                      {/* {ticket.seatId && <QrSeatOverlay seat={ticket.seatId} />} */}
                    </Box>
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <QrRingLegend />
                </Box>
              </Box>
            </Box>
          )}

          {/* -------------------------------------------------- */}
          {/* ROTATE */}
          {/* -------------------------------------------------- */}
          {!isRevoked && isDeviceActivated && (
            <Button
              fullWidth
              onClick={handleRotate}
              disabled={loadingRotate || loadingToken || isActive}
              sx={{
                borderRadius: 3,
                py: 1.2,
                color: omni.primary,
                border: `1px solid ${omni.primary}66`,
                "&:hover": {
                  bgcolor: omni.primary + "11",
                },
              }}
            >
              {loadingRotate || loadingToken ? (
                <CircularProgress size={22} sx={{ color: omni.primary }} />
              ) : isActive ? (
                "QR aktiv"
              ) : (
                "QR neu generieren"
              )}
            </Button>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
}
