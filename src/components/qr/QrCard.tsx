"use client";

import ActivateTicketButton from "@/checkpoint/components/qr/ActivateTicketButton";
import QrCountdownRings from "@/checkpoint/components/qr/QrCountdownRings";
import QrRingLegend from "@/checkpoint/components/qr/QrRingLegend";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import {
  GenerateTokenDocument,
  GenerateTokenMutation,
  GenerateTokenMutationVariables,
  GetMyFullTicketListQuery,
  TicketPayload,
} from "@/checkpoint/generated/graphql";
import useGenerateTokenMutation from "@/checkpoint/hooks/ticket/useGenerateTokenMutation";
import { env } from "@/checkpoint/lib/env";
import { loadPrivateKey } from "@/checkpoint/utils/ticket/device-utils";
import { hapticCritical, hapticRotate } from "@/checkpoint/utils/ticket/haptics";
import { qrBeatAnimation } from "@/checkpoint/utils/ticket/qr-beat";
import { signQrMessage } from "@/checkpoint/utils/ticket/qr-signature";
import { useMutation } from "@apollo/client/react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Backend alignment:
 * - TokenService.generate() sets JWT expiration to 60 seconds.
 * - The frontend must therefore not depend on non-existent TicketPayload fields
 *   such as rotationSeconds or lastRotatedAt.
 * - We intentionally use a frontend QR lifecycle that stays below backend expiry.
 */
const QR_TOKEN_LIFETIME_SECONDS = 45;
const QR_SIGNATURE_LIFETIME_SECONDS = 8;
const QR_CRITICAL_THRESHOLD_SECONDS = 5;

const RING_SIZE = 420;
const QR_SIZE = 260;
const QR_INSET = (RING_SIZE - QR_SIZE) / 2;

type SignedQrPayload = {
  token: string;
  signature: string;
  deviceId: string | null;
};

type Props = {
  ticket?: GetMyFullTicketListQuery["getMyTickets"][number] | undefined;
  event?: any;
};

export default function QrCard({ ticket, event }: Props) {
  const theme = useTheme();
  const searchParams = useSearchParams();

  const from = searchParams.get("from");

  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [cycleKey, setCycleKey] = useState<number>(0);
  const [cycleStartedAt, setCycleStartedAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPreparingQr, setIsPreparingQr] = useState<boolean>(false);

  const inFlightRef = useRef(false);
  const hasStartedRef = useRef(false);
  const criticalHapticFiredRef = useRef(false);

  const { generateToken, generateTokenLoading } = useGenerateTokenMutation();

  const isDeviceActivated = useMemo((): boolean => {
    return (
      Boolean(ticket?.deviceId) &&
      Boolean(ticket?.devicePublicKey) &&
      Boolean(ticket?.deviceActivationAt)
    );
  }, [ticket]);

  const presenceColor = useMemo((): string => {
    if (!ticket) {
      return theme.palette.error.main;
    }

    return ticket.currentState === "INSIDE" ? theme.palette.success.main : theme.palette.error.main;
  }, [theme.palette.error.main, theme.palette.success.main, ticket]);

  const isRevoked = ticket?.revoked ?? false;

  const isQrActive = useMemo(() => {
    return remainingSeconds > 0 && !!qrPayload;
  }, [qrPayload, remainingSeconds]);

  const seatLabel = ticket?.seatId ?? null;

  useEffect(() => {
    if (!cycleStartedAt) {
      setRemainingSeconds(0);
      criticalHapticFiredRef.current = false;
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - cycleStartedAt) / 1000);
      const remaining = Math.max(QR_TOKEN_LIFETIME_SECONDS - elapsed, 0);

      setRemainingSeconds(remaining);

      if (
        remaining > 0 &&
        remaining <= QR_CRITICAL_THRESHOLD_SECONDS &&
        !criticalHapticFiredRef.current
      ) {
        criticalHapticFiredRef.current = true;
        void hapticCritical();
      }
    };

    tick();
    const id = setInterval(tick, 250);

    return () => clearInterval(id);
  }, [cycleStartedAt]);

  const generateSignedQrPayload = useCallback(async () => {
    if (!ticket || isRevoked || !isDeviceActivated) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;

    setErrorMessage(null);
    setIsPreparingQr(true);

    try {
      const deviceId = ticket.deviceId;

      const privateKey = await loadPrivateKey();
      const res = await generateToken({
        variables: { ticketId: ticket.id },
        fetchPolicy: "no-cache",
      });

      // TODO optimieren!!!
      if (!privateKey) throw new Error("Missing Private Key!");

      const token = res.data?.generateToken;
      if (!token) throw new Error("Missing token");

      const signature = await signQrMessage({
        token,
        deviceId,
        privateKey,
      });

      const payload: SignedQrPayload = {
        token,
        signature,
        deviceId,
      };

      setQrPayload(JSON.stringify(payload));
      setCycleStartedAt(Date.now());
      setCycleKey((p) => p + 1);

      await hapticRotate();
    } catch (e) {
      console.error(e);

      setErrorMessage("QR konnte nicht generiert werden");
      setQrPayload(null);
      setCycleStartedAt(null);
    } finally {
      setIsPreparingQr(false);
      inFlightRef.current = false;
    }
  }, [ticket, isDeviceActivated, isRevoked, generateToken]);

  const generateRef = useRef(generateSignedQrPayload);

  useEffect(() => {
    generateRef.current = generateSignedQrPayload;
  }, [generateSignedQrPayload]);

  useEffect(() => {
    if (!isDeviceActivated || isRevoked) return;
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;

    generateRef.current();
  }, [isDeviceActivated, isRevoked]);

  if (!ticket || !event) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <Box
        sx={{
          p: { xs: 2.25, sm: 3.25, md: 4 },
          borderRadius: 4,
          backdropFilter: "blur(36px)",
          WebkitBackdropFilter: "blur(36px)",
          bgcolor:
            theme.palette.mode === "light"
              ? `${apple.systemBackground}CC`
              : `${apple.secondarySystemBackground}CC`,
          border: `1px solid ${apple.separator}`,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 24px 80px rgba(15, 23, 42, 0.08)"
              : "0 24px 80px rgba(0, 0, 0, 0.45)",
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={30} direction={"row"}>
            <BackButtonBase href={from ?? env.CHECKPOINT_BASE_PATH} label={"zurück"} />
            <Stack spacing={1.5}>
              <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 800 }}>
                {event.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  opacity: 0.92,
                }}
              >
                {new Date(event?.settings?.startsAt).toLocaleString()}
              </Typography>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${ticket.currentState}-${ticket.revoked ? "revoked" : "active"}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                >
                  <Chip
                    label={isRevoked ? "REVOKED" : ticket.currentState}
                    sx={{
                      mt: 0.5,
                      alignSelf: "flex-start",
                      fontWeight: 800,
                      bgcolor: `${isRevoked ? theme.palette.error.main : presenceColor}22`,
                      color: isRevoked ? theme.palette.error.main : presenceColor,
                      border: `1px solid ${isRevoked ? theme.palette.error.main : presenceColor}55`,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </Stack>
          </Stack>

          {isRevoked ? (
            <Alert
              severity="error"
              icon={<WarningAmberRoundedIcon />}
              sx={{
                borderRadius: 3,
                bgcolor: `${theme.palette.error.main}12`,
                border: `1px solid ${theme.palette.error.main}33`,
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Ticket wurde deaktiviert
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {ticket.revokedReason ?? "Bitte wende dich an den Veranstalter."}
              </Typography>
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
              }}
            >
              {errorMessage}
            </Alert>
          ) : null}

          {!isRevoked && !isDeviceActivated ? <ActivateTicketButton ticketId={ticket.id} /> : null}

          {!isRevoked && isDeviceActivated ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: { xs: 0.5, sm: 1.5 },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: 360, sm: 420 },
                  display: "flex",
                  justifyContent: "center",
                  p: { xs: 1.25, sm: 2.5 },
                  borderRadius: 4,
                  bgcolor: theme.palette.mode === "light" ? apple.systemBackground : apple.gray6,
                  border: `1px solid ${apple.separator}`,
                }}
              >
                <motion.div
                  key={cycleKey}
                  {...qrBeatAnimation(QR_TOKEN_LIFETIME_SECONDS)}
                  style={{
                    position: "relative",
                    width: RING_SIZE,
                    height: RING_SIZE,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <QrCountdownRings
                    nonceSeconds={QR_TOKEN_LIFETIME_SECONDS}
                    signatureSeconds={QR_SIGNATURE_LIFETIME_SECONDS}
                    size={RING_SIZE}
                    outerStroke={7}
                    innerStroke={5}
                    cycleKey={cycleKey}
                    criticalThresholdSeconds={QR_CRITICAL_THRESHOLD_SECONDS}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      inset: QR_INSET,
                      borderRadius: 4,
                      bgcolor:
                        theme.palette.mode === "light" ? apple.systemBackground : apple.gray6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                      overflow: "visible",
                    }}
                  >
                    {isPreparingQr && !qrPayload ? (
                      <Stack
                        spacing={1.5}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <CircularProgress size={34} sx={{ color: theme.palette.primary.main }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          QR wird vorbereitet…
                        </Typography>
                      </Stack>
                    ) : (
                      <>
                        <QRCodeCanvas
                          value={qrPayload ?? "NO_TOKEN"}
                          size={QR_SIZE}
                          marginSize={2}
                          fgColor={theme.palette.primary.main}
                          bgColor={apple.systemBackground}
                        />
                        {/* {seatLabel ? <QrSeatOverlay seat={seatLabel} /> : null} */}
                      </>
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Box>
          ) : null}

          {!isRevoked && isDeviceActivated ? (
            <Stack spacing={1.5}>
              <Button
                fullWidth
                onClick={() => {
                  void generateSignedQrPayload();
                }}
                disabled={generateTokenLoading || isPreparingQr}
                startIcon={
                  generateTokenLoading || isPreparingQr ? undefined : <RefreshRoundedIcon />
                }
                sx={{
                  borderRadius: 3,
                  py: 1.35,
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.main}55`,
                  bgcolor: `${theme.palette.primary.main}08`,
                  "&:hover": {
                    bgcolor: `${theme.palette.primary.main}14`,
                    borderColor: `${theme.palette.primary.main}88`,
                  },
                  "&.Mui-disabled": {
                    borderColor: apple.separator,
                  },
                }}
              >
                {generateTokenLoading || isPreparingQr ? (
                  <CircularProgress size={22} sx={{ color: theme.palette.primary.main }} />
                ) : isQrActive ? (
                  "QR-Code jetzt erneuern"
                ) : (
                  "QR-Code generieren"
                )}
              </Button>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <QrRingLegend />

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color:
                      remainingSeconds <= QR_CRITICAL_THRESHOLD_SECONDS
                        ? theme.palette.error.main
                        : theme.palette.text.secondary,
                  }}
                >
                  {isQrActive
                    ? `Aktuell noch ${remainingSeconds}s gültig`
                    : "Noch kein aktiver QR-Code"}
                </Typography>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </motion.div>
  );
}
