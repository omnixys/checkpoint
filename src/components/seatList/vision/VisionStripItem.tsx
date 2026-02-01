"use client";

import React from "react";
import { Box } from "@mui/material";
import { useParallax } from "./useParallax";

export default function VisionStripItem({
  width = 280,
  children,
}: {
  width?: number;
  children: React.ReactNode;
}) {
  const { tiltX, tiltY, handleMouse, handleLeave } = useParallax(8);

  return (
    <Box
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      sx={{
        flex: "0 0 auto",
        width,
        scrollSnapAlign: "center",

        transform: `perspective(1200px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`,
        transition: "transform 0.15s ease-out",

        // VisionOS Glow + Soft Shadow
        boxShadow: `
          0 12px 24px rgba(0,0,0,0.25),
          inset 0 0 20px rgba(255,255,255,0.03)
        `,

        borderRadius: "24px",
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.05)",

        "&:hover": {
          transform: `scale(1.03) perspective(1200px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`,
          boxShadow: `
            0 18px 36px rgba(0,0,0,0.35),
            inset 0 0 30px rgba(200,200,255,0.10)
          `,
        },
      }}
    >
      {children}
    </Box>
  );
}
