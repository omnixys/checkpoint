"use client";

import { Capacitor } from "@capacitor/core";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import NativeScanner from "@/checkpoint/components/scan/NativeScanner";
import ScanResultCard from "@/checkpoint/components/scan/ScanResultCard";
import StatusHeader from "@/checkpoint/components/scan/StatusHeader";
import WebCameraScanner from "@/checkpoint/components/scan/WebCameraScanner";
import type { ScanPayload, ScanVerdict } from "@/checkpoint/generated/graphql";
import { useScanTicket } from "@/checkpoint/hooks/scan/useScanTicket";
import useSeatQuery from "@/checkpoint/hooks/seat/useSeatQuery";
import useUserQuery from "@/checkpoint/hooks/user/useUserQuery";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { ScanResult } from "@/checkpoint/types/scan.type";

const MotionBox = motion.create(Box);

function mapReason(verdict: ScanVerdict): ScanResult["reason"] {
  switch (verdict) {
    case "OK":
      return "OK";
    case "REVOKED":
      return "TICKET_REVOKED";
    case "DEVICE_MISMATCH":
      return "DEVICE_MISMATCH";
    default:
      return "INVALID_QR";
  }
}

function buildScanResult(
  payload: ScanPayload,
  guest: ScanResult["guest"],
  seat: NonNullable<ScanResult["seat"]> | null | undefined,
): ScanResult {
  const valid = payload.verdict === "OK";
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
    status: valid ? "SUCCESS" : "ERROR",
    message: payload.message,
    valid,
    deviceMatched: payload.verdict !== "DEVICE_MISMATCH",
    reason: mapReason(payload.verdict),
    ticket: payload.ticket,
    ...(guest ? { guest } : {}),
    ...(seat ? { seat } : {}),
    ...(device ? { device } : {}),
  };
}

function buildInvalidResult(message: string): ScanResult {
  return {
    status: "ERROR",
    message,
    valid: false,
    deviceMatched: false,
    reason: "INVALID_QR",
  };
}

export default function ScanContent() {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");
  const scanTicket = useScanTicket();
  const [scanPayload, setScanPayload] = useState<ScanPayload | null>(null);
  const [fallbackResult, setFallbackResult] = useState<ScanResult | null>(null);

  const scannedTicket = scanPayload?.ticket;

  const { fullSeatInfo } = useSeatQuery({
    seatId: scannedTicket?.seatId,
    loadFullSeatInfo: Boolean(scannedTicket?.seatId),
  });

  const { userInfo } = useUserQuery({
    userId: scannedTicket?.guestProfileId,
    loadUserName: Boolean(scannedTicket?.guestProfileId),
  });

  const result = useMemo(() => {
    if (scanPayload) {
      return buildScanResult(scanPayload, userInfo, fullSeatInfo);
    }

    return fallbackResult;
  }, [fallbackResult, fullSeatInfo, scanPayload, userInfo]);

  const clearResult = useCallback(() => {
    setScanPayload(null);
    setFallbackResult(null);
  }, []);

  const handleWebDetect = useCallback(
    async (qrText: string) => {
      clearResult();

      try {
        const payload = await scanTicket(qrText);

        if (!payload) {
          setFallbackResult(buildInvalidResult(tScanner("invalidQr")));
          return false;
        }

        setScanPayload(payload);
        return payload.verdict === "OK";
      } catch {
        setFallbackResult(buildInvalidResult(tScanner("scanFailed")));
        return false;
      }
    },
    [clearResult, scanTicket, tScanner],
  );

  const isNative = Capacitor.isNativePlatform();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
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
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={2.5} sx={{ width: "100%", maxWidth: theme.spacing(64) }}>
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

              {isNative ? (
                <NativeScanner onDetect={handleWebDetect} onRestart={clearResult} />
              ) : (
                <WebCameraScanner onDetect={handleWebDetect} onRestart={clearResult} />
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
                <ScanResultCard result={result} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Stack>
      </Box>
    </Box>
  );
}
