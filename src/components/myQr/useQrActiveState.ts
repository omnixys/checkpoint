"use client";

import { useEffect, useState } from "react";

type Params = {
  /** Total lifetime in seconds */
  rotationSeconds: number;

  /** Changes whenever a new QR cycle starts */
  cycleKey: number;

  /** Disabled when revoked or not activated */
  enabled: boolean;

  /** Seconds before expiry where QR becomes inactive */
  inactiveBeforeExpirySeconds?: number; // default: 5
};

/**
 * Returns true while the QR is considered active.
 * Becomes false N seconds BEFORE expiration (default: last 5s).
 */
export function useQrActiveState({
  rotationSeconds,
  cycleKey,
  enabled,
  inactiveBeforeExpirySeconds = 15,
}: Params): boolean {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Hard disable
    if (!enabled || rotationSeconds <= 0) {
      setIsActive(false);
      return;
    }

    // If lifetime is shorter than the inactive window → never active
    if (rotationSeconds <= inactiveBeforeExpirySeconds) {
      setIsActive(false);
      return;
    }

    // Activate immediately
    setIsActive(true);

    const activeMs = (rotationSeconds - inactiveBeforeExpirySeconds) * 1000;

    const timeoutId = window.setTimeout(() => {
      setIsActive(false);
    }, activeMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [rotationSeconds, cycleKey, enabled, inactiveBeforeExpirySeconds]);

  return isActive;
}
