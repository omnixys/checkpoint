"use client";

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  BarcodeFormat,
  BarcodeScanner as MlKitScanner,
  type ScanResult as MlKitScanResult,
} from "@capacitor-mlkit/barcode-scanning";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import { Box, Button, CircularProgress, Stack, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { getLogger } from "@/checkpoint/utils/logger";

type Props = {
  onDetect: (qrText: string) => Promise<boolean>;
  onRestart?: (() => void) | undefined;
};

const MotionBox = motion.create(Box);
const logger = getLogger("NativeScanner");

async function playNativeFeedback(ok: boolean) {
  try {
    await Haptics.impact({ style: ok ? ImpactStyle.Medium : ImpactStyle.Heavy });
  } catch {
    // Native haptic availability depends on hardware and permissions.
  }
}

export default function NativeScanner({ onDetect, onRestart }: Props) {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");
  const { activeEventId: eventId } = useActiveEvent();
  const [loading, setLoading] = useState(false);

  const startScan = useCallback(async () => {
    if (!eventId || loading) return;

    onRestart?.();
    setLoading(true);

    try {
      await MlKitScanner.requestPermissions();

      const result: MlKitScanResult = await MlKitScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      const token = result.barcodes?.[0]?.rawValue?.trim() ?? "";
      const ok = await onDetect(token);

      await playNativeFeedback(ok);
    } catch (error) {
      logger.error("Native scan failed:", error);
      await playNativeFeedback(false);
    } finally {
      setLoading(false);
    }
  }, [eventId, loading, onDetect, onRestart]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      sx={{
        p: 1.25,
        borderRadius: 4,
        border: 1,
        borderColor: alpha(theme.palette.divider, 0.72),
        background: `linear-gradient(145deg, ${alpha(
          theme.palette.background.paper,
          0.68,
        )}, ${alpha(theme.palette.primary.main, 0.1)})`,
        backdropFilter: "blur(24px) saturate(150%)",
        WebkitBackdropFilter: "blur(24px) saturate(150%)",
      }}
    >
      <Button
        variant="contained"
        size="large"
        onClick={startScan}
        disabled={loading || !eventId || !Capacitor.isNativePlatform()}
        fullWidth={true}
        startIcon={
          loading ? undefined : (
            <QrCodeScannerRoundedIcon
              sx={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }}
            />
          )
        }
        sx={{
          borderRadius: 3,
          minHeight: theme.spacing(6),
          fontWeight: 800,
          boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(4)} ${alpha(
            theme.palette.primary.main,
            0.3,
          )}`,
        }}
      >
        {loading ? (
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <CircularProgress size={theme.spacing(2.4)} color="inherit" />
            <Box component="span">{tScanner("verifying")}</Box>
          </Stack>
        ) : (
          tScanner("scanButton")
        )}
      </Button>
    </MotionBox>
  );
}
