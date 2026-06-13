"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import { type JSX, type MutableRefObject, useCallback, useRef, useState } from "react";
import { StartupLogo } from "@/checkpoint/components/startup/elements/StartupLogo";
import { StartupOrb } from "@/checkpoint/components/startup/elements/StartupOrb";
import { useSpaceWarpShader } from "@/checkpoint/components/startup/hooks/useSpaceWarpShader";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";
import { omnixysPresets } from "@/checkpoint/themes/colors/omnixysPresets";
import { useCanvasSize } from "./hooks/useCanvasSize";
import { useParallax } from "./hooks/useParallax";
import { useStartupEffects } from "./hooks/useStartupEffects";

const WEDDING_MONOGRAM = "C·R";

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
  const t = useTypedTranslations("rsvp");
  const reduceMotion = useReducedMotion();

  /**
   * Resolve preset once → guarantees no undefined access
   */
  const preset = omnixysPresets[scheme] ?? omnixysPresets.original;

  /**
   * Controls visibility lifecycle
   */
  const [visible, setVisible] = useState<boolean>(true);
  const handleStartupDone = useCallback(() => setVisible(false), []);

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
  useStartupEffects(handleStartupDone, 3500, !reduceMotion);

  /**
   * ✅ CORRECT PARAM ORDER + TYPES
   */
  useSpaceWarpShader(canvasRef, tiltX, tiltY, scheme, mode);

  /**
   * Hard unmount
   */
  if (reduceMotion || !visible) {
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
        zIndex: 999_999,

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

        {scheme === "wedding" ? (
          <Stack direction="column" sx={{ position: "relative", zIndex: 50, alignItems: "center" }}>
          <Typography
            component={motion.p}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            sx={{
              color: "primary.main",
              fontFamily: "var(--font-wedding-serif), Georgia, serif",
              fontSize: "clamp(2.5rem, 9vw, 5.5rem)",
              letterSpacing: "0.3em",
              ml: "0.3em",
              position: "relative",
              zIndex: 50,
            }}
          >
            {WEDDING_MONOGRAM}
          </Typography>

              {/* <Typography             
              component={motion.p}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            sx={{ 
              flexShrink: 0, 
              fontSize: "0.86rem", 
              fontWeight: 700, 
              ml: 1.5,
                            color: "primary.main",
              fontFamily: "var(--font-wedding-serif), Georgia, serif",
               }}>
                #CGR #HAPPELYEVERGYAMFI
              </Typography> */}
          </Stack>
        ) : (
          <StartupLogo tiltX={tiltX} tiltY={tiltY} scheme={scheme} />
        )}

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
          {scheme === "wedding" ? (
            <Stack 
            direction="column"
            >
            {t("public.preparing")}
                <Typography>
            #CGR #HAPPELYEVERGYAMFI
              </Typography>
            </Stack>

          ) : (
            <>
              Powered by <strong>Omnixys</strong>
            </>
          )}
        </motion.div>
      </Box>
    </motion.div>
  );
}
