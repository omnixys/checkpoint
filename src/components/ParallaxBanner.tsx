"use client";

import React, { useEffect, useRef } from "react";
import { useTheme, Box } from "@mui/material";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

/**
 * ParallaxBanner
 * - Desktop: subtle 3D depth effect following mouse/touch
 * - Mobile: static image (no parallax)
 * - Apple VisionOS inspired depth movement
 */
export default function ParallaxBanner({
  src,
  height = 240,
  intensity = 18, // 0 disables parallax
}: {
  src: string;
  height?: number;
  intensity?: number;
}) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for parallax offsets
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map raw values to transform movement
  const transformX = useTransform(x, [-1, 1], [-intensity, intensity]);
  const transformY = useTransform(y, [-1, 1], [-intensity, intensity]);

  /** Desktop parallax: mouse move handler */
  useEffect(() => {
    if (intensity === 0) return; // mobile mode

    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      // translate to [-1, 1]
      const normX = relX * 2 - 1;
      const normY = relY * 2 - 1;

      animate(x, normX, { type: "spring", stiffness: 120, damping: 20 });
      animate(y, normY, { type: "spring", stiffness: 120, damping: 20 });
    };

    el.addEventListener("mousemove", handleMove);
    return () => {
      el.removeEventListener("mousemove", handleMove);
    };
  }, [intensity]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: theme.shadows[4],
        background: theme.palette.background.default,
        // VisionOS layered border look
        "::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "24px",
          pointerEvents: "none",
          boxShadow: theme.shadows[6],
          opacity: 0.35,
        },
      }}
    >
      <motion.img
        src={src}
        alt="Event Banner"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "center",
          // Parallax transform only on desktop
          x: intensity > 0 ? transformX : 0,
          y: intensity > 0 ? transformY : 0,
          scale: intensity > 0 ? 1.05 : 1, // subtle zoom for depth
        }}
        draggable={false}
      />
    </Box>
  );
}
