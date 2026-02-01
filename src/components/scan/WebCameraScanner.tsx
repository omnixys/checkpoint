"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { BrowserQRCodeReader } from "@zxing/browser";

/* ---------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */
type ScannerState = "IDLE" | "SCANNING" | "VERIFYING" | "RESULT";
type Verdict = "success" | "error" | null;

type Props = {
  onDetect: (qrText: string) => Promise<boolean>;
};

/* ---------------------------------------------------------------------------
 * BarcodeDetector typings
 * ------------------------------------------------------------------------- */
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
  interface MediaTrackCapabilities {
    torch?: boolean;
  }
}

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */
function playBeep(type: "success" | "error") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = type === "success" ? 880 : 220;
    gain.gain.value = 0.15;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    /* ignore */
  }
}

/* ---------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */
export default function WebCameraScanner({ onDetect }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const scanningRef = useRef(true);
  const zxingRef = useRef<BrowserQRCodeReader | null>(null);

  const [state, setState] = useState<ScannerState>("IDLE");
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [loading, setLoading] = useState(true);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportsNativeBarcode =
    typeof window !== "undefined" &&
    "BarcodeDetector" in window &&
    !!navigator.mediaDevices;

  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  /* -----------------------------------------------------------------------
   * Stop everything
   * --------------------------------------------------------------------- */
  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;


    zxingRef.current = null;

    streamRef.current?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {}
    });

    streamRef.current = null;
    scanningRef.current = false;
  };

  /* -----------------------------------------------------------------------
   * Start scanner
   * --------------------------------------------------------------------- */
  useEffect(() => {
    let active = true;

    async function start() {
      try {
        setState("SCANNING");

        const video = videoRef.current;
        if (!video) throw new Error("Video missing");

        /* --------------------------------------------------------------
         * Safari / Fallback → ZXing
         * ------------------------------------------------------------ */
        if (!supportsNativeBarcode) {
          zxingRef.current = new BrowserQRCodeReader();

          await zxingRef.current.decodeFromVideoDevice(
            undefined,
            video,
            async (result) => {
              if (!result || !active) return;

              stop();
              setState("VERIFYING");

              const ok = await onDetect(result.getText());
              setVerdict(ok ? "success" : "error");
              playBeep(ok ? "success" : "error");
              setState("RESULT");
            }
          );

          return;
        }

        /* --------------------------------------------------------------
         * Chromium → BarcodeDetector
         * ------------------------------------------------------------ */
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (!active) return;

        streamRef.current = stream;
        video.srcObject = stream;
        await video.play();

        const track = stream.getVideoTracks()[0];
        const caps = track.getCapabilities?.();
        setTorchSupported(!!caps?.torch && !isSafari);

        const formats = await window.BarcodeDetector!.getSupportedFormats();
        const detector = new window.BarcodeDetector({
          formats: formats.includes("qr_code") ? ["qr_code"] : undefined,
        });

        scanningRef.current = true;

        const loop = async () => {
          if (!scanningRef.current || !active) return;

          try {
            const result = await detector.detect(video);
            if (result.length > 0) {
              stop();
              setState("VERIFYING");

              const ok = await onDetect(result[0].rawValue);
              setVerdict(ok ? "success" : "error");
              playBeep(ok ? "success" : "error");
              setState("RESULT");
              return;
            }
          } catch {}

          rafRef.current = requestAnimationFrame(loop);
        };

        loop();
      } catch {
        setError("Kamera konnte nicht gestartet werden.");
      } finally {
        setLoading(false);
      }
    }

    start();
    return () => {
      active = false;
      stop();
    };
  }, [onDetect, supportsNativeBarcode, isSafari]);

  /* -----------------------------------------------------------------------
   * Torch toggle
   * --------------------------------------------------------------------- */
  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn }],
      });
      setTorchOn((v) => !v);
    } catch {
      setTorchOn(false);
    }
  };

  /* -----------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------- */
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const overlayColor =
    verdict === "success"
      ? "rgba(0,255,140,0.35)"
      : verdict === "error"
      ? "rgba(255,60,60,0.35)"
      : "rgba(255,255,255,0.15)";

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {loading && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      <video ref={videoRef} playsInline muted style={{ width: "100%" }} />

      {/* VisionOS-style overlay */}
      <Box
        sx={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          backdropFilter: isSafari ? "none" : "blur(6px)",
          backgroundColor: overlayColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: 3,
            border: "3px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          }}
        />
      </Box>

      {torchSupported && state === "SCANNING" && (
        <Tooltip title={torchOn ? "Licht aus" : "Licht an"}>
          <IconButton
            onClick={toggleTorch}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            {torchOn ? <FlashOffIcon /> : <FlashOnIcon />}
          </IconButton>
        </Tooltip>
      )}

      {state === "VERIFYING" && (
        <Typography
          sx={{
            position: "absolute",
            bottom: 16,
            width: "100%",
            textAlign: "center",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Überprüfe Ticket …
        </Typography>
      )}
    </Box>
  );
}
