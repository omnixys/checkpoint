"use client";

import { useActiveEvent } from "@/providers/ActiveEventProvider";
import { ScanResult } from "@/types/scan/scan.type";
import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import jsQR from "jsqr";
import { useCallback, useEffect, useRef, useState } from "react";
import ScanResultCard from "./ScanResultCard";

/* ---------------------------------------------------------------------
 * VisionOS Scanner Frame with WebRTC
 * ------------------------------------------------------------------- */
export default function ScannerFrame() {
  const theme = useTheme();
  const { activeEventId } = useActiveEvent();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [locked, setLocked] = useState(false); // temporary lock after scan

  /* ---------------------------------------------------------
   * Initialize WebRTC camera
   * ------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      if (!videoRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    })();
  }, []);

  /* ---------------------------------------------------------
   * Continuous scanning loop
   * ------------------------------------------------------- */
  const scanLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    if (locked) return; // Prevent spam-scanning

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = video.videoWidth;
    const h = video.videoHeight;

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(video, 0, 0, w, h);

    const imageData = ctx.getImageData(0, 0, w, h);
    const code = jsQR(imageData.data, w, h);

    if (code?.data) {
      handleScan(code.data);
    }

    requestAnimationFrame(scanLoop);
  }, [locked]);

  /* ---------------------------------------------------------
   * Start scanning
   * ------------------------------------------------------- */
  useEffect(() => {
    requestAnimationFrame(scanLoop);
  }, [scanLoop]);

  /* ---------------------------------------------------------
   * Handle QR result
   * ------------------------------------------------------- */
  const handleScan = async (qr: string) => {
    setLocked(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({
          qrCode: qr,
          eventId: activeEventId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json();
      setResult(json);
    } catch (e) {
      setResult({
        status: "ERROR",
        message: "Scan fehlgeschlagen",
      });
    }

    setTimeout(() => {
      setLocked(false);
    }, 1500);
  };

  /* ---------------------------------------------------------
   * UI
   * ------------------------------------------------------- */
  return (
    <Box sx={{ position: "relative" }}>
      {/* Scanner Frame */}
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
          style={{
            width: "80vw",
            maxWidth: 480,
            height: "auto",
            display: "block",
          }}
        />

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </motion.div>

      {/* Result card overlay */}
      {result && (
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
      )}
    </Box>
  );
}
