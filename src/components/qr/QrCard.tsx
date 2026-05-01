"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
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
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { QRCodeCanvas } from "qrcode.react";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivateTicketButton from "@/checkpoint/components/qr/ActivateTicketButton";
import QrCountdownRings from "@/checkpoint/components/qr/QrCountdownRings";
import QrRingLegend from "@/checkpoint/components/qr/QrRingLegend";
import { BackButtonBase } from "@/checkpoint/components/utils/back-button-base";
import type { GetActiveEventQuery, GetMyFullTicketListQuery } from "@/checkpoint/generated/graphql";
import useGenerateTokenMutation from "@/checkpoint/hooks/ticket/useGenerateTokenMutation";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { env } from "@/checkpoint/lib/env";
import { loadPrivateKey } from "@/checkpoint/utils/ticket/device-utils";
import { hapticCritical, hapticRotate } from "@/checkpoint/utils/ticket/haptics";
import { qrBeatAnimation } from "@/checkpoint/utils/ticket/qr-beat";
import { signQrMessage } from "@/checkpoint/utils/ticket/qr-signature";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import { useDevice } from "@/checkpoint/providers/DeviceProvider";

const QR_TOKEN_LIFETIME_SECONDS = 45;
const QR_SIGNATURE_LIFETIME_SECONDS = 8;
const QR_CRITICAL_THRESHOLD_SECONDS = 5;
const RING_SIZE = 620;
const QR_SIZE = 460;
const MARGIN_SIZE = 10;

type SignedQrPayload = {
  token: string;
  signature: string;
  deviceId: string;
};

type Ticket = GetMyFullTicketListQuery["getMyTickets"][number];
type Event = NonNullable<GetActiveEventQuery["event"]>;

type Props = {
  ticket?: Ticket | undefined;
  event?: Event | null | undefined;
  onActivated?: (() => void) | undefined;
};

function formatDateTime(value: unknown, locale: string) {
  if (!value) return null;

  const date =
    value instanceof Date
      ? value
      : typeof value === "number"
        ? new Date(value)
        : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function QrCard({ ticket, event, onActivated }: Props) {
  const theme = useTheme();
  const locale = useLocale();
    const { isMobile} = useDevice();
  const tQr = useTypedTranslations("qr");
  const tTicket = useTypedTranslations("ticket");
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [cycleKey, setCycleKey] = useState<number>(0);
  const [cycleStartedAt, setCycleStartedAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPreparingQr, setIsPreparingQr] = useState<boolean>(false);

  const inFlightRef = useRef(false);
  const hasStartedRef = useRef(false);
  const criticalHapticFiredRef = useRef(false);
  const ticketIdRef = useRef<string | null>(null);

  const { generateToken, generateTokenLoading } = useGenerateTokenMutation();

  const isDeviceActivated = useMemo(
    () => Boolean(ticket?.deviceId && ticket.devicePublicKey && ticket.deviceActivationAt),
    [ticket],
  );

  const isRevoked = ticket?.revoked ?? false;
  const isQrActive = remainingSeconds > 0 && Boolean(qrPayload);
  const ticketId = ticket?.id ?? null;
  const eventStartDate = formatDateTime(event?.settings?.startsAt, locale);
  const validUntilDate = cycleStartedAt
    ? formatDateTime(cycleStartedAt + QR_TOKEN_LIFETIME_SECONDS * 1000, locale)
    : null;

  const status = useMemo(() => {
    if (isRevoked) {
      return {
        label: tTicket("status.revoked"),
        color: theme.palette.error.main,
        icon: WarningAmberRoundedIcon,
      };
    }

    if (isPreparingQr) {
      return {
        label: tQr("rotatingState"),
        color: theme.palette.primary.main,
        icon: RefreshRoundedIcon,
      };
    }

    if (isQrActive) {
      return {
        label: tTicket("status.valid"),
        color: theme.palette.success.main,
        icon: CheckCircleRoundedIcon,
      };
    }

    return {
      label: tTicket("status.expired"),
      color: theme.palette.warning.main,
      icon: WarningAmberRoundedIcon,
    };
  }, [
    isPreparingQr,
    isQrActive,
    isRevoked,
    tQr,
    tTicket,
    theme.palette.error.main,
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ]);

  const StatusIcon = status.icon;

  useEffect(() => {
    if (ticketIdRef.current === ticketId) return;

    ticketIdRef.current = ticketId;
    hasStartedRef.current = false;
    criticalHapticFiredRef.current = false;
    setQrPayload(null);
    setCycleStartedAt(null);
    setRemainingSeconds(0);
    setErrorMessage(null);
  }, [ticketId]);

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
    const id = window.setInterval(tick, 250);

    return () => window.clearInterval(id);
  }, [cycleStartedAt]);

  const generateSignedQrPayload = useCallback(async () => {
    if (!ticket || isRevoked || !isDeviceActivated || inFlightRef.current) return;

    const deviceId = ticket.deviceId;
    if (!deviceId) return;

    inFlightRef.current = true;
    setErrorMessage(null);
    setIsPreparingQr(true);

    try {
      const privateKey = await loadPrivateKey();
      if (!privateKey) throw new Error("missing_private_key");

      const response = await generateToken({
        variables: { ticketId: ticket.id },
        fetchPolicy: "no-cache",
      });

      const token = response.data?.generateToken;
      if (!token) throw new Error("missing_token");

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
      setCycleKey((previous) => previous + 1);
      criticalHapticFiredRef.current = false;

      await hapticRotate();
    } catch {
      setErrorMessage(tQr("prepareFailed"));
      setQrPayload(null);
      setCycleStartedAt(null);
    } finally {
      setIsPreparingQr(false);
      inFlightRef.current = false;
    }
  }, [generateToken, isDeviceActivated, isRevoked, tQr, ticket]);

  const generateRef = useRef(generateSignedQrPayload);

  useEffect(() => {
    generateRef.current = generateSignedQrPayload;
  }, [generateSignedQrPayload]);

  useEffect(() => {
    if (!isDeviceActivated || isRevoked || hasStartedRef.current) return;

    hasStartedRef.current = true;
    void generateRef.current();
  }, [isDeviceActivated, isRevoked]);

  useEffect(() => {
    if (!isDeviceActivated || isRevoked || !qrPayload || remainingSeconds > 0) return;

    const id = window.setTimeout(() => {
      void generateRef.current();
    }, 300);

    return () => window.clearTimeout(id);
  }, [isDeviceActivated, isRevoked, qrPayload, remainingSeconds]);

  const { fullSeatInfo } = useSeatQuery({
    loadFullSeatInfo: true,
    seatId: ticket?.seatId
  });


  if (!ticket || !event || !fullSeatInfo) {
    return null;
  }

  type SeatSegment = {
    label: string;
    value: string;
  };

  const seatSegments: SeatSegment[] = [
    fullSeatInfo.section?.name
      ? { label: tTicket("section"), value: fullSeatInfo.section.name }
      : null,

    fullSeatInfo.table?.name
      ? { label: tTicket("table"), value: fullSeatInfo.table.name }
      : null,

    // fullSeatInfo.label
    //   ? { label: tTicket("seat"), value: fullSeatInfo.label }
    //   : null,

    fullSeatInfo.number
      ? { label: tTicket("seat"), value: String(fullSeatInfo.number) }
      : null,
  ].filter((v): v is SeatSegment => v !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 5,
          border: 1,
          borderColor: alpha(theme.palette.divider, 0.72),
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.76,
          )}, ${alpha(theme.palette.primary.main, 0.09)}, ${alpha(
            theme.palette.secondary.main,
            0.06,
          )})`,
          backdropFilter: "blur(34px) saturate(160%)",
          WebkitBackdropFilter: "blur(34px) saturate(160%)",
          boxShadow: `0 ${theme.spacing(3)} ${theme.spacing(9)} ${alpha(
            theme.palette.common.black,
            theme.palette.mode === "dark" ? 0.44 : 0.14,
          )}`,
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
          >
            <BackButtonBase href={from ?? env.CHECKPOINT_BASE_PATH} label={tQr("back")} />

            <Stack spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ alignItems: "center", justifyContent: "space-between", gap: 1.25 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 900,
                      letterSpacing: 0,
                    }}
                  >
                    {tQr("securePass")}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 900,
                      lineHeight: 1.12,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {event.name}
                  </Typography>
                </Box>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={status.label}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      icon={
                        <StatusIcon sx={{ width: theme.spacing(2), height: theme.spacing(2) }} />
                      }
                      label={status.label}
                      sx={{
                        flexShrink: 0,
                        fontWeight: 900,
                        color: status.color,
                        backgroundColor: alpha(status.color, 0.12),
                        border: 1,
                        borderColor: alpha(status.color, 0.34),
                        "& .MuiChip-icon": {
                          color: status.color,
                        },
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </Stack>

              {eventStartDate ? (
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {tQr("eventStarts", { date: eventStartDate })}
                </Typography>
              ) : null}

              {ticket.seatId ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <EventSeatRoundedIcon
                    sx={{
                      width: theme.spacing(2),
                      height: theme.spacing(2),
                      color: theme.palette.text.secondary,
                    }}
                  />
                {isMobile ? (
                  <Stack spacing={1}>
                      {seatSegments.map((seg, index) => {
                        const isLast = index === seatSegments.length - 1;
                        return (
                          <Box
                            key={index}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: 3,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",

                              background: isLast
                                ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.25)}, ${alpha(
                                  theme.palette.success.main,
                                  0.1,
                                )})`
                                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(
                                  theme.palette.background.paper,
                                  0.4,
                                )})`,

                              border: `1px solid ${isLast
                                ? alpha(theme.palette.success.main, 0.4)
                                : alpha(theme.palette.primary.main, 0.25)
                                }`,

                              backdropFilter: "blur(12px)",
                            }}
                          >
                            {/* Label */}
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontWeight: 600,
                              }}
                            >
                              {seg.label}
                            </Typography>

                            {/* Value */}
                            <Typography
                              sx={{
                                fontWeight: 900,
                                fontSize: "0.95rem",
                                letterSpacing: 0.3,
                                maxWidth: "60%",
                                textAlign: "right",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {seg.value}
                            </Typography>
                          </Box>
                        );
                      })}
                  </Stack>
                ) : (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ gap: 1, flexWrap: "wrap", alignItems: "center" }}
                  >
                    {seatSegments.map((seg, index) => (
                      <Fragment key={index}>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 999,
                            background: `linear-gradient(135deg, ${alpha(
                              theme.palette.primary.main,
                              0.18,
                            )}, ${alpha(theme.palette.secondary.main, 0.12)})`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800 }}
                          >
                            {seg.value}
                          </Typography>
                        </Box>

                        {index < seatSegments.length - 1 && (
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            →
                          </Typography>
                        )}
                      </Fragment>
                    ))}
                  </Stack>
                )}
                </Stack>
              ) : null}
            </Stack>
          </Stack>

          {isRevoked ? (
            <Alert
              severity="error"
              icon={<WarningAmberRoundedIcon />}
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: alpha(theme.palette.error.main, 0.34),
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>{tQr("revokedTitle")}</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {ticket.revokedReason ?? tQr("revokedFallback")}
              </Typography>
            </Alert>
          ) : null}

          {errorMessage ? (
            <Alert
              severity="error"
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: alpha(theme.palette.error.main, 0.32),
                backgroundColor: alpha(theme.palette.error.main, 0.09),
              }}
            >
              {errorMessage}
            </Alert>
          ) : null}

          {!isRevoked && !isDeviceActivated ? (
            <Stack
              spacing={2}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 4,
                border: 1,
                borderColor: alpha(theme.palette.divider, 0.62),
                backgroundColor: alpha(theme.palette.background.paper, 0.48),
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  }}
                >
                  <ShieldRoundedIcon
                    sx={{ width: theme.spacing(2.8), height: theme.spacing(2.8) }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 900 }}>{tQr("activationIntroTitle")}</Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {tQr("activationIntroText")}
                  </Typography>
                </Box>
              </Stack>

              <ActivateTicketButton ticketId={ticket.id} onActivated={onActivated} />
            </Stack>
          ) : null}

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
                  maxWidth: theme.spacing(52),
                  aspectRatio: "1 / 1",
                  display: "flex",
                  justifyContent: "center",
                  p: { xs: 1.25, sm: 2.5 },
                  borderRadius: 5,
                  border: 1,
                  borderColor: alpha(theme.palette.divider, 0.62),
                  backgroundColor: alpha(theme.palette.background.paper, 0.62),
                  boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.12)}`,
                }}
              >
                <motion.div
                  key={cycleKey}
                  {...qrBeatAnimation(QR_TOKEN_LIFETIME_SECONDS)}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    maxWidth: RING_SIZE,
                    maxHeight: RING_SIZE,
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
                      inset: { xs: "20%", sm: "19%" },
                      borderRadius: 4,
                      backgroundColor: theme.palette.background.paper,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(4)} ${alpha(
                        theme.palette.common.black,
                        theme.palette.mode === "dark" ? 0.32 : 0.12,
                      )}`,
                      overflow: "hidden",
                    }}
                  >
                    {!qrPayload ? (
                      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
                        {isPreparingQr ? (
                          <CircularProgress size={theme.spacing(4)} />
                        ) : (
                          <WarningAmberRoundedIcon
                            sx={{
                              width: theme.spacing(4),
                              height: theme.spacing(4),
                              color: theme.palette.warning.main,
                            }}
                          />
                        )}
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {isPreparingQr ? tQr("prepareQr") : tQr("qrUnavailable")}
                        </Typography>
                      </Stack>
                    ) : (
                      <QRCodeCanvas
                        value={qrPayload}
                        size={QR_SIZE}
                        marginSize={MARGIN_SIZE}
                        fgColor={theme.palette.primary.main}
                        bgColor={theme.palette.background.paper}
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      />
                    )}
                  </Box>
                </motion.div>
              </Box>
            </Box>
          ) : null}

          {!isRevoked && isDeviceActivated ? (
            <Stack spacing={1.5}>
              <Button
                fullWidth={true}
                onClick={() => {
                  void generateSignedQrPayload();
                }}
                disabled={generateTokenLoading || isPreparingQr}
                startIcon={
                  generateTokenLoading || isPreparingQr ? undefined : (
                    <RefreshRoundedIcon
                      sx={{ width: theme.spacing(2.2), height: theme.spacing(2.2) }}
                    />
                  )
                }
                sx={{
                  borderRadius: 3,
                  py: 1.35,
                  fontWeight: 900,
                  color: theme.palette.primary.main,
                  border: 1,
                  borderColor: alpha(theme.palette.primary.main, 0.34),
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.14),
                    borderColor: alpha(theme.palette.primary.main, 0.54),
                  },
                  "&.Mui-disabled": {
                    borderColor: alpha(theme.palette.divider, 0.62),
                  },
                }}
              >
                {generateTokenLoading || isPreparingQr ? (
                  <CircularProgress size={theme.spacing(2.4)} />
                ) : isQrActive ? (
                  tQr("refreshNow")
                ) : (
                  tQr("generate")
                )}
              </Button>

              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  rowGap: 1,
                }}
              >
                <QrRingLegend />

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color:
                      remainingSeconds <= QR_CRITICAL_THRESHOLD_SECONDS
                        ? theme.palette.error.main
                        : theme.palette.text.secondary,
                  }}
                >
                  {isQrActive
                    ? validUntilDate
                      ? tQr("validUntil", { date: validUntilDate })
                      : tQr("validFor", { seconds: remainingSeconds })
                    : tQr("noActiveQr")}
                </Typography>
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </motion.div>
  );
}
