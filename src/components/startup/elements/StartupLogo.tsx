"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { resolveLogoPath } from "@/checkpoint/components/startup/config/logo.utils";
import { startupConfig } from "@/checkpoint/components/startup/config/startup.config";
import type { OmnixysColorScheme } from "@/checkpoint/themes/paletteTypes";

interface Props {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  scheme: OmnixysColorScheme;
}

export function StartupLogo({ tiltX, tiltY, scheme }: Props) {
  const logoX = useTransform(tiltX, (v) => v * 0.3);
  const logoY = useTransform(tiltY, (v) => v * 0.3);

  return (
    <motion.img
      src={resolveLogoPath(scheme)}
      alt="omnixys"
      initial={{
        opacity: 0,
        scale: 0.7,
        filter: "blur(8px)",
        rotateZ: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        rotateZ: [0, 0.5, -0.3, 0],
      }}
      transition={{
        duration: 1.3,
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        zIndex: 50,
        x: logoX,
        y: logoY,
        width: startupConfig.logo.size,
        transformStyle: "preserve-3d",
        perspective: 1200,
        rotateX: useTransform(tiltY, (v) => v * 0.9),
        rotateY: useTransform(tiltX, (v) => v * -0.9),
        rotateZ: useTransform(tiltX, (v) => v * 0.15),
        filter: "drop-shadow(0 0 25px rgba(255,255,255,0.35))",
      }}
    />
  );
}
