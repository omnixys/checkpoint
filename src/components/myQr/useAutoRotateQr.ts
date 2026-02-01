"use client";

import { useEffect, useRef } from "react";

type Params = {
  /** Lifetime in seconds */
  rotationSeconds: number;

  /** Disabled when ticket revoked or device not activated */
  enabled: boolean;

  /** Changes when a new QR cycle starts */
  cycleKey: number;

  /** Callback to rotate + regenerate token */
  onRotate: () => Promise<void>;
};

/**
 * Automatically rotates the QR when rotationSeconds expires.
 * - One timer per cycle
 * - Cleaned up on unmount / cycle change
 * - No drift
 */
export function useAutoRotateQr({
  rotationSeconds,
  enabled,
  cycleKey,
  onRotate,
}: Params) {
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const delayMs = Math.max(rotationSeconds * 1000, 500);

    const timer = setTimeout(async () => {
      if (inFlightRef.current) return;

      try {
        inFlightRef.current = true;
        await onRotate();
      } finally {
        inFlightRef.current = false;
      }
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [rotationSeconds, enabled, cycleKey, onRotate]);
}
