"use client";

import { useEffect } from "react";
import { hapticCritical } from "./haptics";

/**
 * Triggers a ONE-SHOT haptic exactly when the critical phase begins.
 *
 * @param rotationSeconds total lifetime
 * @param criticalThresholdSeconds when critical phase starts
 * @param cycleKey changes whenever a new token/nonce cycle begins
 */
export function useCriticalPhaseHaptic(
  rotationSeconds: number,
  criticalThresholdSeconds: number,
  cycleKey: number
) {
  useEffect(() => {
    const delayMs = Math.max(
      (rotationSeconds - criticalThresholdSeconds) * 1000,
      0
    );

    const t = setTimeout(() => {
      hapticCritical();
    }, delayMs);

    return () => clearTimeout(t);
  }, [rotationSeconds, criticalThresholdSeconds, cycleKey]);
}
