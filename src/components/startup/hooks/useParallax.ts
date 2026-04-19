"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/**
 * Provides tilt values based on device orientation or mouse.
 */
export function useParallax(maxTilt = 18) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;

      const x = (gamma / 45) * maxTilt;
      const y = (beta / 45) * maxTilt;

      tiltX.set(x);
      tiltY.set(y);
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    function handleMouse(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * maxTilt * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * maxTilt * 2;

      tiltX.set(x);
      tiltY.set(y);
    }

    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return { tiltX, tiltY };
}
