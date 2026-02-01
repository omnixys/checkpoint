"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";

import { Haptics, ImpactStyle } from "@capacitor/haptics";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { ScanResult } from "@/types/scan/scan.type";
import { getDeviceHash } from "@/utils/device-hash";
import { getLogger } from "@/utils/logger";
import { playScanFeedback } from "@/utils/scan-feedback";
import {
  BarcodeFormat,
  // LensFacing, // optional
  BarcodeScanner as MLKitScanner,
  type ScanResult as MLKitScanResult,
} from "@capacitor-mlkit/barcode-scanning";
import { Capacitor } from "@capacitor/core";
import { useScanTicket } from "./hooks/useScanTicket";
import ScanResultCard from "./ScanResultCard";

/* ──────────────────────────────────────────────────────────────────────────────
   Zusätzliche DOM/Media-Typen (ohne any)
   ────────────────────────────────────────────────────────────────────────────── */
declare global {
  interface BarcodeDetectorOptions {
    formats?: string[];
  }
  interface DetectedBarcode {
    rawValue: string;
  }
  interface BarcodeDetector {
    detect(
      source:
        | HTMLVideoElement
        | HTMLImageElement
        | ImageBitmap
        | HTMLCanvasElement
    ): Promise<DetectedBarcode[]>;
  }
  interface BarcodeDetectorConstructor {
    new (options?: BarcodeDetectorOptions): BarcodeDetector;
    getSupportedFormats(): Promise<string[]>;
  }
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
  // Torch-Fähigkeit für Kameras
  interface MediaTrackCapabilities {
    torch?: boolean;
  }
}

export default function NativeScanner() {
  const logger = getLogger("NativeScanner");

  logger.debug("isNativePlatform", Capacitor.isNativePlatform());
  logger.debug("platform", Capacitor.getPlatform());

  const { activeEventId: eventId } = useActiveEvent();
  const scanTicket = useScanTicket();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const startScan = useCallback(async () => {
    if (!eventId) return;

    setResult(null);
    setLoading(true);

    try {
      await MLKitScanner.requestPermissions();

      const res: MLKitScanResult = await MLKitScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      setLoading(true);

      const token = res.barcodes?.[0]?.rawValue ?? "";

      await Haptics.impact({ style: ImpactStyle.Medium });

      const deviceHash = await getDeviceHash();

      const scanResult = await scanTicket(token, deviceHash, "MAIN_GATE");
      await playScanFeedback(scanResult);
      setResult(scanResult);
    } catch (e) {
      setResult({
        status: "ERROR",
        message: e instanceof Error ? e.message : "Scan fehlgeschlagen",
        valid: false,
        deviceMatched: false,
        reason: "INVALID_QR",
      });
      logger.error("Scan failed:", e);
    } finally {
      setLoading(false);
    }
  }, [eventId, scanTicket]);

  return (
    <Box>
      <Button
        variant="contained"
        size="large"
        onClick={startScan}
        disabled={loading}
        fullWidth
        sx={{ borderRadius: 3, mb: 2 }}
      >
        {loading ? <CircularProgress size={22} /> : "QR-Code scannen"}
      </Button>

      {result && <ScanResultCard result={result} />}
    </Box>
  );
}
