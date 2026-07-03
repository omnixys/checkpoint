"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { startupConfig } from "@/checkpoint/components/startup/config/startup.config";
import { useThemeMode } from "@/checkpoint/providers/ThemeModeProvider";
import { omnixysPresets } from "@/checkpoint/themes/colors/omnixysPresets";

/**
 * StartupOrb
 *
 * Fully theme-driven visual component.
 * No hardcoded colors or animation values.
 * Uses Omnixys presets + startupConfig only.
 */
interface Props {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}

export function StartupOrb({ tiltX, tiltY }: Props) {
  const { scheme, mode } = useThemeMode();

  const preset = omnixysPresets[scheme];
  const visual = preset.visual[mode];

  const orbX = useTransform(tiltX, (v) => v * startupConfig.motion.orbParallax);
  const orbY = useTransform(tiltY, (v) => v * startupConfig.motion.orbParallax);

  return (
    <motion.div
      initial={{
        scale: startupConfig.motion.orb.initialScale,
        opacity: startupConfig.motion.orb.initialOpacity,
        filter: `blur(${startupConfig.motion.orb.initialBlur}px)`,
      }}
      animate={{
        scale: startupConfig.motion.orb.finalScale,
        opacity: startupConfig.motion.orb.finalOpacity,
        filter: `blur(${startupConfig.motion.orb.finalBlur}px)`,
      }}
      transition={{
        duration: startupConfig.motion.orb.duration,
        ease: startupConfig.motion.orb.ease,
      }}
      style={{
        position: "absolute",
        width: startupConfig.orb.size,
        height: startupConfig.orb.size,
        borderRadius: "50%",

        /**
         * Fully theme-driven gradient
         */
        background: `radial-gradient(
          circle at ${startupConfig.orb.gradientPosition.x}% ${startupConfig.orb.gradientPosition.y}%,
          ${visual.gradient.orb[0]},
          ${visual.gradient.orb[1]},
          ${visual.gradient.orb[2]}
        )`,

        /**
         * Fully theme-driven glow
         */
        boxShadow: `
          0 0 ${startupConfig.orb.shadow.blur}px
          ${startupConfig.orb.shadow.spread}px
          ${visual.shadow.glow}
        `,

        x: orbX,
        y: orbY,
      }}
    />
  );
}
