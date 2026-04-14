"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";

/**
 * SwipeBackProvider
 *
 * Goals:
 * - Hydration-safe rendering
 * - Stable hook order
 * - Mobile swipe-back gesture from the left screen edge
 *
 * Important:
 * - Hooks must always be called in the same order
 * - We therefore initialize all hooks first
 * - Before mount, we render a plain wrapper to keep SSR and first client render identical
 */
export default function SwipeBackProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  /**
   * Tracks whether the component has mounted on the client.
   *
   * Why:
   * - Prevents hydration mismatch caused by Framer Motion markup/styles
   * - Ensures server HTML matches the first client render
   */
  const [mounted, setMounted] = React.useState(false);

  /**
   * Stores the initial touch X coordinate across renders.
   *
   * Why:
   * - A ref is stable and does not trigger re-renders
   * - Avoids incorrect gesture state during touch interaction
   */
  const startXRef = React.useRef(0);

  /**
   * Motion values must be created unconditionally.
   *
   * Why:
   * - React hooks must never be called conditionally
   * - This keeps hook order stable between renders
   */
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 120], [1, 0.5]);
  const scale = useTransform(x, [0, 120], [1, 0.98]);

  /**
   * Marks the component as mounted after hydration.
   */
  React.useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handles touch start and records the initial X position.
   */
  const onTouchStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0]?.clientX ?? 0;
  }, []);

  /**
   * Updates the swipe distance while the user moves the finger.
   *
   * Rules:
   * - Only allow right-swipe
   * - Only allow swipe starting from the left edge
   */
  const onTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const currentX = e.touches[0]?.clientX ?? 0;
      const delta = currentX - startXRef.current;

      if (startXRef.current < 32 && delta > 0) {
        x.set(delta);
      }
    },
    [x],
  );

  /**
   * Finishes the gesture.
   *
   * Behavior:
   * - If swipe passes threshold, navigate back
   * - Always reset motion value afterwards
   */
  const onTouchEnd = React.useCallback(() => {
    if (x.get() > 80) {
      router.back();
    }

    x.set(0);
    startXRef.current = 0;
  }, [router, x]);

  /**
   * Hydration-safe fallback.
   *
   * Why:
   * - Server render and first client render must match
   * - A plain div avoids Framer Motion SSR/client markup differences
   */
  if (!mounted) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          touchAction: "pan-y",
        }}
      >
        {children}
      </div>
    );
  }

  /**
   * After mount, enable motion-based interactions.
   */
  return (
    <motion.div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        x,
        opacity,
        scale,
        height: "100%",
        width: "100%",
        touchAction: "pan-y",
      }}
    >
      {children}
    </motion.div>
  );
}
