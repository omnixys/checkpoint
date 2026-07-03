"use client";

import { Box, useTheme } from "@mui/material";
import { BrowserMultiFormatReader, type IScannerControls } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import type { ScanResult } from "@/checkpoint/types/scan.type";
import ScanResultCard from "./ScanResultCard";

/* ---------------------------------------------------------------------
 * VisionOS Scanner Frame with ZXing WebRTC
 * ------------------------------------------------------------------- */
export default function ScannerFrame() {
  const theme = useTheme();
  const { activeEventId } = useActiveEvent();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const mountedRef = useRef<boolean>(false);
  const lockedRef = useRef<boolean>(false);
  const unlockTimeoutRef = useRef<number | null>(null);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [locked, setLocked] = useState<boolean>(false);

  const clearUnlockTimeout = useCallback(() => {
    if (unlockTimeoutRef.current !== null) {
      window.clearTimeout(unlockTimeoutRef.current);
      unlockTimeoutRef.current = null;
    }
  }, []);

  const stopScanner = useCallback(() => {
    clearUnlockTimeout();

    controlsRef.current?.stop();
    controlsRef.current = null;

    if (videoRef.current) {
      const mediaStream = videoRef.current.srcObject;
      if (mediaStream instanceof MediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    readerRef.current = null;
    lockedRef.current = false;
  }, [clearUnlockTimeout]);

  const handleScan = useCallback(
    async (qr: string) => {
      if (lockedRef.current) {
        return;
      }
      if (!activeEventId) {
        return;
      }

      lockedRef.current = true;
      setLocked(true);

      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCode: qr,
            eventId: activeEventId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Scan request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as ScanResult;

        if (!mountedRef.current) {
          return;
        }
        setResult(payload);
      } catch (_error) {
        if (!mountedRef.current) {
          return;
        }

        setResult({
          status: "ERROR",
          message: "Scan fehlgeschlagen",
          deviceMatched: false,
          valid: false,
        });
      } finally {
        if (mountedRef.current) {
          clearUnlockTimeout();

          unlockTimeoutRef.current = window.setTimeout(() => {
            lockedRef.current = false;
            setLocked(false);
          }, 1500);
        }
      }
    },
    [activeEventId, clearUnlockTimeout],
  );

  useEffect(() => {
    mountedRef.current = true;

    const startScanner = async () => {
      if (!videoRef.current) {
        return;
      }

      try {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (decodeResult, error) => {
            if (!mountedRef.current) {
              return;
            }
            if (lockedRef.current) {
              return;
            }

            if (decodeResult?.getText()) {
              void handleScan(decodeResult.getText());
              return;
            }

            if (error && !(error instanceof NotFoundException)) {
              return;
            }
          },
        );

        controlsRef.current = controls;
      } catch (_error) {
        if (!mountedRef.current) {
          return;
        }

        setResult({
          status: "ERROR",
          message: "Kamera konnte nicht gestartet werden",
          deviceMatched: false,
          valid: false,
        });
      }
    };

    void startScanner();

    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [handleScan, stopScanner]);

  return (
    <Box sx={{ position: "relative" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        style={{
          borderRadius: 24,
          overflow: "hidden",
          backdropFilter: "blur(28px)",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 16px 64px ${theme.palette.divider}`,
        }}
      >
        <video
          ref={videoRef}
          muted={true}
          playsInline={true}
          autoPlay={true}
          style={{
            width: "80vw",
            maxWidth: 480,
            height: "auto",
            display: "block",
            objectFit: "cover",
            opacity: locked ? 0.92 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
      </motion.div>

      {result ? (
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 420,
          }}
        >
          <ScanResultCard result={result} />
        </Box>
      ) : null}
    </Box>
  );
}
