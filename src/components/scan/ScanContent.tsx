"use client";

import { Capacitor } from "@capacitor/core";
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import NativeScanner from "@/checkpoint/components/scan/NativeScanner";
import ScanResultCard from "@/checkpoint/components/scan/ScanResultCard";
import StatusHeader from "@/checkpoint/components/scan/StatusHeader";
import WebCameraScanner from "@/checkpoint/components/scan/WebCameraScanner";
import type { ScanPayload } from "@/checkpoint/generated/graphql";
import { GateDirection } from "@/checkpoint/generated/graphql";
import useInvitationQuery from "@/checkpoint/hooks/invitation/useInvitationQuery";
import { parseQrPayload, useScanTicket } from "@/checkpoint/hooks/scan/useScanTicket";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useUserQuery from "@/checkpoint/hooks/user/useUserQuery";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { ScanResult } from "@/checkpoint/types/scan.type";
import {
  type ScanFailureReason,
  scanReason,
  scanRequestFailureReason,
  scanStatus,
} from "@/checkpoint/utils/scan-verdict";

const MotionBox = motion.create(Box);

function buildScanResult(
  payload: ScanPayload,
  guest: ScanResult["guest"],
  seat: NonNullable<ScanResult["seat"]> | null | undefined,
  plusOneAgeCategory: ScanResult["plusOneAgeCategory"],
): ScanResult {
  const device =
    payload.ticket.deviceId &&
    payload.ticket.devicePublicKey &&
    payload.ticket.deviceActivationAt &&
    payload.ticket.deviceActivationIP
      ? {
          hash: payload.ticket.deviceId,
          publicKey: payload.ticket.devicePublicKey,
          activatedAt: String(payload.ticket.deviceActivationAt),
          activationIP: payload.ticket.deviceActivationIP,
        }
      : undefined;

  return {
    status: scanStatus(payload.verdict),
    message: payload.message,
    valid: payload.verdict === "OK",
    deviceMatched: payload.verdict !== "DEVICE_MISMATCH",
    reason: scanReason(payload.verdict),
    ticket: payload.ticket,
    ...(plusOneAgeCategory ? { plusOneAgeCategory } : {}),
    ...(guest ? { guest } : {}),
    ...(seat ? { seat } : {}),
    ...(device ? { device } : {}),
  };
}

function buildFailureResult(
  reason: NonNullable<ScanResult["reason"]>,
  message: string,
): ScanResult {
  return {
    status: "ERROR",
    message,
    valid: false,
    deviceMatched: false,
    reason,
  };
}

export default function ScanContent() {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");
  const scanTicket = useScanTicket();
  const [direction, setDirection] = useState<GateDirection>(GateDirection.ENTRY);
  const [scanPayload, setScanPayload] = useState<ScanPayload | null>(null);
  const [fallbackResult, setFallbackResult] = useState<ScanResult | null>(null);
  const [scannerKey, setScannerKey] = useState(0);

  const scannedTicket = scanPayload?.ticket;

  const { fullSeatInfo, fullSeatInfoLoading } = useSeatQuery({
    seatId: scannedTicket?.seatId,
    loadFullSeatInfo: Boolean(scannedTicket?.seatId),
  });

  const { userInfo, userInfoLoading } = useUserQuery({
    userId: scannedTicket?.guestProfileId,
    loadUserName: Boolean(scannedTicket?.guestProfileId),
  });

  const { invitation } = useInvitationQuery({
    invitationId: scannedTicket?.invitationId,
    loadInvitation: Boolean(scannedTicket?.invitationId),
  });

  const plusOneAgeCategory = invitation?.plusOneAgeCategory ?? null;

  const result = useMemo(() => {
    if (scanPayload) {
      return buildScanResult(scanPayload, userInfo ?? undefined, fullSeatInfo, plusOneAgeCategory);
    }

    return fallbackResult;
  }, [fallbackResult, fullSeatInfo, plusOneAgeCategory, scanPayload, userInfo]);

  const clearResult = useCallback(() => {
    setScanPayload(null);
    setFallbackResult(null);
  }, []);

  const failureMessage = useCallback(
    (reason: ScanFailureReason) => {
      const messages: Record<ScanFailureReason, string> = {
        CAMERA_INSECURE: tScanner("failure.cameraInsecure"),
        CAMERA_IN_USE: tScanner("failure.cameraInUse"),
        CAMERA_PERMISSION_DENIED: tScanner("failure.cameraPermission"),
        CAMERA_UNAVAILABLE: tScanner("failure.cameraUnavailable"),
        EMPTY_RESPONSE: tScanner("failure.emptyResponse"),
        NETWORK_ERROR: tScanner("failure.network"),
        UNEXPECTED_ERROR: tScanner("failure.unexpected"),
      };

      return messages[reason];
    },
    [tScanner],
  );

  const handleFailure = useCallback(
    (reason: ScanFailureReason) => {
      setScanPayload(null);
      setFallbackResult(buildFailureResult(reason, failureMessage(reason)));
    },
    [failureMessage],
  );

  const startNextScan = useCallback(() => {
    clearResult();
    setScannerKey((current) => current + 1);
  }, [clearResult]);

  const handleWebDetect = useCallback(
    async (qrText: string) => {
      clearResult();

      if (!parseQrPayload(qrText)) {
        setFallbackResult(buildFailureResult("INVALID_QR", tScanner("invalidQr")));
        return false;
      }

      try {
        const payload = await scanTicket(qrText, { direction });

        if (!payload) {
          setFallbackResult(buildFailureResult("EMPTY_RESPONSE", failureMessage("EMPTY_RESPONSE")));
          return false;
        }

        setScanPayload(payload);
        return payload.verdict === "OK";
      } catch (error) {
        const reason = scanRequestFailureReason(error);
        setFallbackResult(buildFailureResult(reason, failureMessage(reason)));
        return false;
      }
    },
    [clearResult, direction, failureMessage, scanTicket, tScanner],
  );

  const isNative = Capacitor.isNativePlatform();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: `radial-gradient(circle at top, ${alpha(
          theme.palette.primary.main,
          0.14,
        )}, ${alpha(theme.palette.background.default, 0)} 42%), ${theme.palette.background.default}`,
      }}
    >
      <StatusHeader />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          minWidth: 0,
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={2.5} sx={{ width: "100%", maxWidth: theme.spacing(64), minWidth: 0 }}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 4,
              border: 1,
              borderColor: alpha(theme.palette.divider, 0.72),
              backgroundColor: alpha(theme.palette.background.paper, 0.58),
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
              boxShadow: `0 ${theme.spacing(3)} ${theme.spacing(8)} ${alpha(
                theme.palette.common.black,
                theme.palette.mode === "dark" ? 0.42 : 0.14,
              )}`,
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ px: { xs: 0.5, sm: 1 }, pt: { xs: 0.5, sm: 1 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 800,
                    lineHeight: 1.15,
                  }}
                >
                  {tScanner("title")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mt: 0.75,
                  }}
                >
                  {isNative ? tScanner("nativeSubtitle") : tScanner("webSubtitle")}
                </Typography>
              </Box>

              <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={direction}
                onChange={(_, value: GateDirection | null) => {
                  if (value) {
                    setDirection(value);
                  }
                }}
                aria-label={tScanner("direction.label")}
                sx={{
                  backgroundColor: alpha(theme.palette.background.default, 0.5),
                }}
              >
                <ToggleButton value={GateDirection.ENTRY} sx={{ fontWeight: 700 }}>
                  {tScanner("direction.entry")}
                </ToggleButton>
                <ToggleButton value={GateDirection.EXIT} sx={{ fontWeight: 700 }}>
                  {tScanner("direction.exit")}
                </ToggleButton>
              </ToggleButtonGroup>

              {isNative ? (
                <NativeScanner
                  key={scannerKey}
                  onDetect={handleWebDetect}
                  onFailure={handleFailure}
                  onRestart={clearResult}
                />
              ) : (
                <WebCameraScanner
                  key={scannerKey}
                  onDetect={handleWebDetect}
                  onFailure={handleFailure}
                  onRestart={clearResult}
                />
              )}
            </Stack>
          </MotionBox>

          <AnimatePresence mode="popLayout">
            {result ? (
              <motion.div
                key={`${result.status}-${result.message}-${result.ticket?.id ?? "local"}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <ScanResultCard
                  guestLoading={userInfoLoading}
                  onNextScan={startNextScan}
                  result={result}
                  seatLoading={fullSeatInfoLoading}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Stack>
      </Box>
    </Box>
  );
}
