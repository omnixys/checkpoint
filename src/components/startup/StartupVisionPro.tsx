"use client";

import { Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { JSX, useRef, useState, type MutableRefObject } from "react";

import { useParallax } from "./hooks/useParallax";
import { useCanvasSize } from "./hooks/useCanvasSize";
import { useStartupEffects } from "./hooks/useStartupEffects";
import { useSpaceWarpShader } from "@/checkpoint/components/startup/hooks/useSpaceWarpShader";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";
import { StartupOrb } from "@/checkpoint/components/startup/elements/StartupOrb";
import { StartupLogo } from "@/checkpoint/components/startup/elements/StartupLogo";
import { omnixysPresets } from "@/checkpoint/themes/colors/omnixysPresets";

/**
 * StartupVisionPro
 *
 * Fullscreen startup splash animation with:
 * - WebGL shader background
 * - parallax interaction
 * - controlled lifecycle (mount → animate → unmount)
 */
export default function StartupVisionPro(): JSX.Element | null {
  const { scheme, mode } = useThemeMode();
  const theme = useTheme();

  /**
   * Resolve preset once → guarantees no undefined access
   */
  const preset = omnixysPresets[scheme] ?? omnixysPresets["original"];

  /**
   * Controls visibility lifecycle
   */
  const [visible, setVisible] = useState<boolean>(true);

  /**
   * Canvas reference
   */
  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement>(null);

  /**
   * Viewport size tracking
   */
  const canvasSize = useCanvasSize();

  /**
   * Parallax interaction
   */
  const { tiltX, tiltY } = useParallax(16);

  /**
   * Startup effects (audio + dismiss)
   */
  useStartupEffects(() => setVisible(false), 3500);

  /**
   * ✅ CORRECT PARAM ORDER + TYPES
   */
  useSpaceWarpShader(canvasRef, tiltX, tiltY, scheme, mode);

  /**
   * Hard unmount
   */
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,

        /**
         * ✅ THEME DRIVEN BACKGROUND
         */
        background: preset[mode].backgroundDefault,
      }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: preset[mode].backgroundDefault,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Orb */}
        <StartupOrb tiltX={tiltX} tiltY={tiltY} />

        {/* Logo */}
        <StartupLogo tiltX={tiltX} tiltY={tiltY} scheme={scheme} />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "26%",
            color: mode === "light" ? theme.palette.text.primary : theme.palette.text.secondary,
            width: "100%",
            textAlign: "center",
            fontSize: 39,
            letterSpacing: 0.5,
          }}
        >
          Powered by <strong>Omnixys</strong>
        </motion.div>
      </Box>
    </motion.div>
  );
}
