"use client";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { AnimatePresence, motion } from "framer-motion";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type ScannerState = "IDLE" | "SCANNING" | "VERIFYING" | "RESULT";
type Verdict = "success" | "error" | null;
type FinalVerdict = Exclude<Verdict, null>;

interface Props {
  onDetect: (qrText: string) => Promise<boolean>;
  onRestart?: (() => void) | undefined;
}

interface LastScan {
  value: string;
  detectedAt: number;
}

type TorchConstraintSet = MediaTrackConstraintSet & {
  torch?: boolean;
};

declare global {
  interface BarcodeDetectorOptions {
    formats?: string[];
  }

  interface DetectedBarcode {
    rawValue: string;
  }

  interface BarcodeDetector {
    detect(
      source: HTMLVideoElement | HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    ): Promise<DetectedBarcode[]>;
  }

  interface BarcodeDetectorConstructor {
    new (options?: BarcodeDetectorOptions): BarcodeDetector;
    getSupportedFormats(): Promise<string[]>;
  }

  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
    webkitAudioContext?: typeof AudioContext;
  }

  interface MediaTrackCapabilities {
    torch?: boolean;
  }
}

const MotionBox = motion.create(Box);

const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: { ideal: "environment" },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};

const DETECTION_INTERVAL_MS = 110;
const DUPLICATE_GUARD_MS = 1200;
const SCAN_REGION_RATIO = 0.68;
const MAX_SCAN_CANVAS_SIZE = 720;

function isSafariBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function canUseNativeBarcodeDetector() {
  return (
    typeof window !== "undefined" &&
    typeof window.BarcodeDetector !== "undefined" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices !== "undefined"
  );
}

async function createNativeQrDetector() {
  const BarcodeDetectorCtor = window.BarcodeDetector;
  if (!BarcodeDetectorCtor) {
    return null;
  }

  const formats = await BarcodeDetectorCtor.getSupportedFormats();
  if (!formats.includes("qr_code")) {
    return null;
  }

  return new BarcodeDetectorCtor({ formats: ["qr_code"] });
}

function isTorchAvailable(capabilities: MediaTrackCapabilities | undefined) {
  return (
    typeof capabilities !== "undefined" &&
    "torch" in capabilities &&
    typeof capabilities.torch === "boolean" &&
    capabilities.torch
  );
}

function getAttachedStream(video: HTMLVideoElement | null) {
  if (!video) {
    return null;
  }

  return video.srcObject instanceof MediaStream ? video.srcObject : null;
}

function getLiveVideoTrack(stream: MediaStream | null) {
  if (!stream) {
    return null;
  }

  const tracks = stream.getVideoTracks();
  return tracks.find((track) => track.readyState === "live") ?? tracks[0] ?? null;
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {
      // A track may already be ended by ZXing controls when both cleanup paths converge.
    }
  });
}

function drawScanRegion(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    return null;
  }

  const sourceSize = Math.floor(Math.min(video.videoWidth, video.videoHeight) * SCAN_REGION_RATIO);
  const sourceX = Math.floor((video.videoWidth - sourceSize) / 2);
  const sourceY = Math.floor((video.videoHeight - sourceSize) / 2);
  const targetSize = Math.min(sourceSize, MAX_SCAN_CANVAS_SIZE);
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  canvas.width = targetSize;
  canvas.height = targetSize;
  context.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, targetSize, targetSize);

  return canvas;
}

function playScanTone(audioContextRef: RefObject<AudioContext | null>, verdict: FinalVerdict) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextCtor) {
    return;
  }

  try {
    const existingContext = audioContextRef.current;
    const context =
      existingContext && existingContext.state !== "closed"
        ? existingContext
        : new AudioContextCtor();

    audioContextRef.current = context;

    if (context.state === "suspended") {
      void context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const duration = verdict === "success" ? 0.12 : 0.18;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(verdict === "success" ? 980 : 220, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(verdict === "success" ? 0.16 : 0.13, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  } catch {
    // Browser autoplay and device policies vary; scan flow must not depend on audio.
  }
}

function pulseDevice(verdict: FinalVerdict) {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }

  navigator.vibrate(verdict === "success" ? [18, 32, 18] : [46, 36, 46]);
}

export default function WebCameraScanner({ onDetect, onRestart }: Props) {
  const theme = useTheme();
  const tScanner = useTypedTranslations("scanner");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const rafRef = useRef<number | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeRef = useRef<boolean>(false);
  const scanningRef = useRef<boolean>(false);
  const processingRef = useRef<boolean>(false);
  const pausedByVisibilityRef = useRef<boolean>(false);
  const sessionIdRef = useRef<number>(0);
  const lastScanRef = useRef<LastScan | null>(null);
  const lastDetectionAtRef = useRef<number>(0);
  const onDetectRef = useRef<Props["onDetect"]>(onDetect);
  const onRestartRef = useRef<Props["onRestart"]>(onRestart);
  const stateRef = useRef<ScannerState>("IDLE");

  const [state, setState] = useState<ScannerState>("IDLE");
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [isSafari, setIsSafari] = useState<boolean>(false);

  const setScannerState = useCallback((nextState: ScannerState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const isCurrentSession = useCallback(
    (sessionId: number) =>
      activeRef.current && sessionIdRef.current === sessionId && !pausedByVisibilityRef.current,
    [],
  );

  const stopScannerResources = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    try {
      controlsRef.current?.stop();
    } catch {
      // ZXing may have already disposed its stream after a detection callback.
    }

    controlsRef.current = null;

    const attachedStream = streamRef.current ?? getAttachedStream(videoRef.current);
    stopStream(attachedStream);
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute("src");
    }

    scanningRef.current = false;

    if (activeRef.current) {
      setTorchOn(false);
      setTorchSupported(false);
    }
  }, []);

  const updateTorchSupport = useCallback(() => {
    const stream = streamRef.current ?? getAttachedStream(videoRef.current);
    const track = getLiveVideoTrack(stream);
    const supported = !isSafariBrowser() && isTorchAvailable(track?.getCapabilities?.());

    setTorchSupported(supported);
    if (!supported) {
      setTorchOn(false);
    }
  }, []);

  const getDetectionSource = useCallback((video: HTMLVideoElement) => {
    const canvas = scanCanvasRef.current ?? document.createElement("canvas");
    scanCanvasRef.current = canvas;

    return drawScanRegion(video, canvas) ?? video;
  }, []);

  const playFeedback = useCallback((nextVerdict: FinalVerdict) => {
    playScanTone(audioContextRef, nextVerdict);
    pulseDevice(nextVerdict);
  }, []);

  const handleDetected = useCallback(
    async (rawValue: string, sessionId: number) => {
      const qrText = rawValue.trim();
      if (!qrText || !isCurrentSession(sessionId)) {
        return;
      }
      if (!scanningRef.current || processingRef.current) {
        return;
      }

      const now = Date.now();
      const lastScan = lastScanRef.current;
      if (lastScan?.value === qrText && now - lastScan.detectedAt < DUPLICATE_GUARD_MS) {
        return;
      }

      lastScanRef.current = { value: qrText, detectedAt: now };

      // ZXing can emit repeated callbacks before controls.stop() settles.
      processingRef.current = true;
      scanningRef.current = false;

      stopScannerResources();
      setLoading(false);
      setCameraError(false);
      setVerdict(null);
      setScannerState("VERIFYING");

      try {
        const ok = await onDetectRef.current(qrText);
        if (!activeRef.current) {
          return;
        }

        const nextVerdict: FinalVerdict = ok ? "success" : "error";
        setVerdict(nextVerdict);
        playFeedback(nextVerdict);
        setScannerState("RESULT");
      } catch {
        if (!activeRef.current) {
          return;
        }

        setVerdict("error");
        playFeedback("error");
        setScannerState("RESULT");
      } finally {
        processingRef.current = false;
      }
    },
    [isCurrentSession, playFeedback, setScannerState, stopScannerResources],
  );

  const runBarcodeDetectorLoop = useCallback(
    (detector: BarcodeDetector, sessionId: number) => {
      const loop = async () => {
        if (!isCurrentSession(sessionId) || !scanningRef.current || processingRef.current) {
          rafRef.current = null;
          return;
        }

        const video = videoRef.current;
        if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        const now = performance.now();
        if (now - lastDetectionAtRef.current < DETECTION_INTERVAL_MS) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        lastDetectionAtRef.current = now;

        try {
          const detections = await detector.detect(getDetectionSource(video));
          const rawValue = detections.find((detection) => detection.rawValue)?.rawValue;

          if (rawValue) {
            await handleDetected(rawValue, sessionId);
            return;
          }
        } catch {
          // Individual frames can fail while the video is warming up; the next frame can still scan.
        }

        if (isCurrentSession(sessionId) && scanningRef.current && !processingRef.current) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(loop);
    },
    [getDetectionSource, handleDetected, isCurrentSession],
  );

  const startBarcodeDetectorScanner = useCallback(
    async (sessionId: number, detector: BarcodeDetector) => {
      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element missing.");
      }

      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      if (!isCurrentSession(sessionId)) {
        stopStream(stream);
        return;
      }

      streamRef.current = stream;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;

      await video.play();

      if (!isCurrentSession(sessionId)) {
        stopStream(stream);
        return;
      }

      scanningRef.current = true;
      updateTorchSupport();
      setLoading(false);
      setCameraError(false);
      setScannerState("SCANNING");
      runBarcodeDetectorLoop(detector, sessionId);
    },
    [isCurrentSession, runBarcodeDetectorLoop, setScannerState, updateTorchSupport],
  );

  const startZxingScanner = useCallback(
    async (sessionId: number) => {
      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element missing.");
      }

      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        video,
        (result, _error, callbackControls) => {
          if (!isCurrentSession(sessionId)) {
            return;
          }

          controlsRef.current = controlsRef.current ?? callbackControls;

          const text = result?.getText();
          if (text) {
            void handleDetected(text, sessionId);
          }
        },
      );

      if (
        !isCurrentSession(sessionId) ||
        processingRef.current ||
        stateRef.current !== "SCANNING"
      ) {
        controls.stop();
        return;
      }

      controlsRef.current = controls;
      streamRef.current = getAttachedStream(video);
      scanningRef.current = true;
      updateTorchSupport();
      setLoading(false);
      setCameraError(false);
      setScannerState("SCANNING");
    },
    [handleDetected, isCurrentSession, setScannerState, updateTorchSupport],
  );

  const startScanner = useCallback(async () => {
    const sessionId = sessionIdRef.current + 1;
    sessionIdRef.current = sessionId;
    processingRef.current = false;
    scanningRef.current = true;
    lastDetectionAtRef.current = 0;

    const hidden = typeof document !== "undefined" && document.visibilityState === "hidden";
    if (hidden) {
      pausedByVisibilityRef.current = true;
      scanningRef.current = false;
      setPaused(true);
      setLoading(false);
      setScannerState("IDLE");
      return;
    }

    pausedByVisibilityRef.current = false;
    setPaused(false);
    setIsSafari(isSafariBrowser());
    setCameraError(false);
    setVerdict(null);
    setLoading(true);
    setScannerState("SCANNING");

    try {
      if (canUseNativeBarcodeDetector()) {
        let detector: BarcodeDetector | null = null;

        try {
          detector = await createNativeQrDetector();
        } catch {
          detector = null;
        }

        if (detector && isCurrentSession(sessionId)) {
          await startBarcodeDetectorScanner(sessionId, detector);
          return;
        }
      }

      if (isCurrentSession(sessionId)) {
        await startZxingScanner(sessionId);
      }
    } catch {
      if (!activeRef.current || sessionIdRef.current !== sessionId) {
        return;
      }

      stopScannerResources();
      processingRef.current = false;
      scanningRef.current = false;
      setLoading(false);
      setScannerState("IDLE");
      setCameraError(true);
    }
  }, [
    isCurrentSession,
    setScannerState,
    startBarcodeDetectorScanner,
    startZxingScanner,
    stopScannerResources,
  ]);

  const restartScanner = useCallback(() => {
    stopScannerResources();

    processingRef.current = false;
    scanningRef.current = true;
    lastScanRef.current = null;
    lastDetectionAtRef.current = 0;
    pausedByVisibilityRef.current = false;

    setPaused(false);
    setVerdict(null);
    setCameraError(false);
    setLoading(true);
    setScannerState("SCANNING");
    onRestartRef.current?.();

    void startScanner();
  }, [setScannerState, startScanner, stopScannerResources]);

  const toggleTorch = useCallback(async () => {
    if (!torchSupported || stateRef.current !== "SCANNING" || processingRef.current) {
      return;
    }

    const stream = streamRef.current ?? getAttachedStream(videoRef.current);
    const track = getLiveVideoTrack(stream);
    const capabilities = track?.getCapabilities?.();

    if (!track || !isTorchAvailable(capabilities)) {
      setTorchOn(false);
      setTorchSupported(false);
      return;
    }

    const nextTorchState = !torchOn;

    try {
      await track.applyConstraints({
        advanced: [{ torch: nextTorchState } as TorchConstraintSet],
      });
      setTorchOn(nextTorchState);
      return;
    } catch {
      // Some Chromium builds expose torch only through ZXing's experimental controls.
    }

    try {
      if (!controlsRef.current?.switchTorch) {
        throw new Error("Torch controls unavailable.");
      }

      await controlsRef.current.switchTorch(nextTorchState);
      setTorchOn(nextTorchState);
    } catch {
      setTorchOn(false);
      setTorchSupported(false);
    }
  }, [torchOn, torchSupported]);

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    onRestartRef.current = onRestart;
  }, [onRestart]);

  useEffect(() => {
    activeRef.current = true;
    void startScanner();

    return () => {
      activeRef.current = false;
      sessionIdRef.current += 1;
      stopScannerResources();

      const audioContext = audioContextRef.current;
      audioContextRef.current = null;

      if (audioContext && audioContext.state !== "closed") {
        void audioContext.close().catch(() => undefined);
      }
    };
  }, [startScanner, stopScannerResources]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (stateRef.current === "SCANNING" || stateRef.current === "IDLE") {
          pausedByVisibilityRef.current = true;
          sessionIdRef.current += 1;
          stopScannerResources();
          setPaused(true);
          setLoading(false);
        }

        return;
      }

      if (pausedByVisibilityRef.current) {
        restartScanner();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [restartScanner, stopScannerResources]);

  const feedbackColor =
    verdict === "success"
      ? theme.palette.success.main
      : verdict === "error"
        ? theme.palette.error.main
        : state === "VERIFYING"
          ? theme.palette.primary.main
          : theme.palette.primary.main;

  const statusColor = cameraError
    ? theme.palette.error.main
    : paused
      ? theme.palette.warning.main
      : state === "VERIFYING"
        ? theme.palette.primary.main
        : verdict === "success"
          ? theme.palette.success.main
          : verdict === "error"
            ? theme.palette.error.main
            : theme.palette.primary.main;
  const statusText = cameraError
    ? tScanner("cameraUnavailable")
    : paused
      ? tScanner("paused")
      : state === "VERIFYING"
        ? tScanner("verifying")
        : state === "RESULT"
          ? verdict === "success"
            ? tScanner("success")
            : tScanner("error")
          : tScanner("scanning");

  const blurFilter = isSafari ? "none" : "blur(18px) saturate(160%)";
  const glassOverlay = {
    pointerEvents: "none",
    position: "absolute",
    backdropFilter: blurFilter,
    WebkitBackdropFilter: blurFilter,
    background: `linear-gradient(145deg, ${alpha(theme.palette.background.default, 0.78)}, ${alpha(
      theme.palette.primary.main,
      0.18,
    )}, ${alpha(theme.palette.secondary.main, 0.14)})`,
  } as const;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: theme.spacing(58),
        mx: "auto",
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          "--scan-size": `clamp(${theme.spacing(24)}, 64vw, ${theme.spacing(32)})`,
          position: "relative",
          minHeight: { xs: "min(72dvh, 368px)", sm: theme.spacing(54) },
          aspectRatio: "4 / 5",
          overflow: "hidden",
          borderRadius: 4,
          border: 1,
          borderColor: alpha(theme.palette.divider, 0.7),
          background: `radial-gradient(circle at top, ${alpha(
            theme.palette.primary.main,
            0.22,
          )}, ${alpha(theme.palette.background.default, 0)} 42%), linear-gradient(160deg, ${alpha(
            theme.palette.background.default,
            0.96,
          )}, ${alpha(theme.palette.background.paper, 0.84)})`,
          boxShadow: `
            0 ${theme.spacing(3)} ${theme.spacing(8)} ${alpha(
              theme.palette.common.black,
              theme.palette.mode === "dark" ? 0.48 : 0.16,
            )},
            inset 0 1px 0 ${alpha(theme.palette.common.white, 0.12)}
          `,
          isolation: "isolate",
        }}
      >
        <Box
          ref={videoRef}
          component="video"
          autoPlay={true}
          muted={true}
          playsInline={true}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            backgroundColor: theme.palette.common.black,
            opacity: loading || paused ? 0.72 : 1,
            transition: theme.transitions.create("opacity", {
              duration: theme.transitions.duration.shorter,
            }),
          }}
        />

        <Box
          sx={{
            ...glassOverlay,
            top: 0,
            left: 0,
            right: 0,
            height: "calc(50% - var(--scan-size) / 2)",
          }}
        />
        <Box
          sx={{
            ...glassOverlay,
            bottom: 0,
            left: 0,
            right: 0,
            height: "calc(50% - var(--scan-size) / 2)",
          }}
        />
        <Box
          sx={{
            ...glassOverlay,
            top: "calc(50% - var(--scan-size) / 2)",
            bottom: "calc(50% - var(--scan-size) / 2)",
            left: 0,
            width: "calc(50% - var(--scan-size) / 2)",
          }}
        />
        <Box
          sx={{
            ...glassOverlay,
            top: "calc(50% - var(--scan-size) / 2)",
            right: 0,
            bottom: "calc(50% - var(--scan-size) / 2)",
            width: "calc(50% - var(--scan-size) / 2)",
          }}
        />

        <AnimatePresence>
          {verdict ? (
            <MotionBox
              key={verdict}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: 1,
                scale: verdict === "success" ? [1, 1.02, 1] : [1, 0.99, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              sx={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at center, ${alpha(
                  feedbackColor,
                  verdict === "success" ? 0.34 : 0.28,
                )}, ${alpha(feedbackColor, 0.1)} 44%, ${alpha(
                  theme.palette.background.default,
                  0.16,
                )} 100%)`,
                boxShadow: `inset 0 0 ${theme.spacing(10)} ${alpha(feedbackColor, 0.46)}`,
                zIndex: 1,
              }}
            />
          ) : null}
        </AnimatePresence>

        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "var(--scan-size)",
            height: "var(--scan-size)",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <MotionBox
            animate={
              state === "RESULT"
                ? {
                    scale: verdict === "success" ? [1, 1.035, 1] : [1, 0.985, 1],
                  }
                : { scale: [1, 1.015, 1], opacity: [0.9, 1, 0.9] }
            }
            transition={{
              duration: state === "RESULT" ? 0.5 : 2.4,
              repeat: state === "SCANNING" && !paused ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 4,
              border: 1,
              borderColor: alpha(statusColor, state === "SCANNING" ? 0.82 : 0.96),
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.common.white,
                0.08,
              )}, ${alpha(theme.palette.background.paper, 0.03)})`,
              boxShadow: `
                0 0 ${theme.spacing(4)} ${alpha(statusColor, 0.36)},
                inset 0 0 ${theme.spacing(3)} ${alpha(theme.palette.common.white, 0.08)}
              `,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: theme.spacing(1),
                left: theme.spacing(1),
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderTop: 2,
                borderLeft: 2,
                borderColor: statusColor,
                borderTopLeftRadius: 3,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: theme.spacing(1),
                right: theme.spacing(1),
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderTop: 2,
                borderRight: 2,
                borderColor: statusColor,
                borderTopRightRadius: 3,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: theme.spacing(1),
                bottom: theme.spacing(1),
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderRight: 2,
                borderBottom: 2,
                borderColor: statusColor,
                borderBottomRightRadius: 3,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: theme.spacing(1),
                left: theme.spacing(1),
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderBottom: 2,
                borderLeft: 2,
                borderColor: statusColor,
                borderBottomLeftRadius: 3,
              }}
            />
          </MotionBox>
        </Box>

        {torchSupported && state === "SCANNING" && !paused ? (
          <Tooltip title={torchOn ? tScanner("torchOffTooltip") : tScanner("torchOnTooltip")}>
            <MotionBox
              whileTap={{ scale: 0.92 }}
              animate={{ scale: torchOn ? 1.04 : 1 }}
              sx={{
                position: "absolute",
                top: theme.spacing(2),
                right: theme.spacing(2),
                zIndex: 4,
              }}
            >
              <IconButton
                aria-label={torchOn ? tScanner("torchOff") : tScanner("torchOn")}
                onClick={toggleTorch}
                sx={{
                  width: theme.spacing(6),
                  height: theme.spacing(6),
                  color: torchOn ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  backgroundColor: torchOn
                    ? alpha(theme.palette.primary.main, 0.84)
                    : alpha(theme.palette.background.paper, 0.58),
                  backdropFilter: blurFilter,
                  WebkitBackdropFilter: blurFilter,
                  border: 1,
                  borderColor: torchOn
                    ? alpha(theme.palette.primary.light, 0.72)
                    : alpha(theme.palette.divider, 0.65),
                  boxShadow: `0 ${theme.spacing(1.5)} ${theme.spacing(4)} ${alpha(
                    torchOn ? theme.palette.primary.main : theme.palette.common.black,
                    torchOn ? 0.34 : 0.22,
                  )}`,
                  "&:hover": {
                    backgroundColor: torchOn
                      ? alpha(theme.palette.primary.main, 0.92)
                      : alpha(theme.palette.background.paper, 0.72),
                  },
                }}
              >
                {torchOn ? (
                  <FlashOffIcon
                    sx={{
                      width: theme.spacing(2.6),
                      height: theme.spacing(2.6),
                    }}
                  />
                ) : (
                  <FlashOnIcon
                    sx={{
                      width: theme.spacing(2.6),
                      height: theme.spacing(2.6),
                    }}
                  />
                )}
              </IconButton>
            </MotionBox>
          </Tooltip>
        ) : null}

        <MotionBox
          layout={true}
          sx={{
            position: "absolute",
            left: theme.spacing(2),
            right: theme.spacing(2),
            bottom: theme.spacing(2),
            zIndex: 4,
            p: 1.25,
            borderRadius: 3,
            border: 1,
            borderColor: alpha(theme.palette.divider, 0.62),
            backgroundColor: alpha(theme.palette.background.paper, 0.64),
            backdropFilter: blurFilter,
            WebkitBackdropFilter: blurFilter,
            boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(4)} ${alpha(
              theme.palette.common.black,
              theme.palette.mode === "dark" ? 0.28 : 0.12,
            )}`,
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", minWidth: 0 }}>
            <Box
              sx={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                color: statusColor,
                backgroundColor: alpha(statusColor, 0.12),
              }}
            >
              {state === "VERIFYING" || loading ? (
                <CircularProgress size={theme.spacing(2.2)} sx={{ color: statusColor }} />
              ) : state === "RESULT" && verdict === "success" ? (
                <CheckCircleRoundedIcon
                  sx={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }}
                />
              ) : state === "RESULT" && verdict === "error" ? (
                <ErrorRoundedIcon sx={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }} />
              ) : (
                <QrCodeScannerIcon sx={{ width: theme.spacing(2.4), height: theme.spacing(2.4) }} />
              )}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  lineHeight: 1.25,
                }}
              >
                {statusText}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  display: "block",
                  lineHeight: 1.2,
                }}
              >
                {state === "VERIFYING"
                  ? tScanner("wait")
                  : state === "RESULT"
                    ? verdict === "success"
                      ? tScanner("granted")
                      : tScanner("failed")
                    : tScanner("scannerLabel")}
              </Typography>
            </Box>
          </Stack>
        </MotionBox>

        <AnimatePresence>
          {state === "RESULT" ? (
            <MotionBox
              key="result-actions"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              sx={{
                position: "absolute",
                left: theme.spacing(2),
                right: theme.spacing(2),
                top: theme.spacing(2),
                zIndex: 5,
                p: 2,
                borderRadius: 3,
                border: 1,
                borderColor: alpha(feedbackColor, 0.42),
                backgroundColor: alpha(theme.palette.background.paper, 0.68),
                backdropFilter: blurFilter,
                WebkitBackdropFilter: blurFilter,
                boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(6)} ${alpha(
                  feedbackColor,
                  0.24,
                )}`,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <Box
                  sx={{
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    color: feedbackColor,
                    backgroundColor: alpha(feedbackColor, 0.14),
                    flexShrink: 0,
                  }}
                >
                  {verdict === "success" ? (
                    <CheckCircleRoundedIcon
                      sx={{ width: theme.spacing(3), height: theme.spacing(3) }}
                    />
                  ) : (
                    <ErrorRoundedIcon sx={{ width: theme.spacing(3), height: theme.spacing(3) }} />
                  )}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {statusText}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: "block",
                      lineHeight: 1.2,
                    }}
                  >
                    {verdict === "success" ? tScanner("ready") : tScanner("scanAgain")}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<ReplayIcon />}
                  onClick={restartScanner}
                  sx={{
                    flexShrink: 0,
                    minWidth: { xs: "100%", sm: theme.spacing(13) },
                    borderRadius: 999,
                    boxShadow: `0 ${theme.spacing(1)} ${theme.spacing(3)} ${alpha(
                      theme.palette.primary.main,
                      0.28,
                    )}`,
                  }}
                >
                  {tScanner("scanAgain")}
                </Button>
              </Stack>
            </MotionBox>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {cameraError ? (
            <MotionBox
              key="camera-error"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              sx={{
                position: "absolute",
                inset: theme.spacing(2),
                zIndex: 6,
                display: "grid",
                placeItems: "center",
                p: 3,
                borderRadius: 3,
                border: 1,
                borderColor: alpha(theme.palette.error.main, 0.34),
                backgroundColor: alpha(theme.palette.background.paper, 0.72),
                backdropFilter: blurFilter,
                WebkitBackdropFilter: blurFilter,
              }}
            >
              <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", width: "100%" }}>
                <Box
                  sx={{
                    width: theme.spacing(6),
                    height: theme.spacing(6),
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    color: theme.palette.error.main,
                    backgroundColor: alpha(theme.palette.error.main, 0.12),
                  }}
                >
                  <ErrorRoundedIcon sx={{ width: theme.spacing(3), height: theme.spacing(3) }} />
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                  {tScanner("cameraStartFailed")}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={restartScanner}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  {tScanner("retry")}
                </Button>
              </Stack>
            </MotionBox>
          ) : null}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );
}
