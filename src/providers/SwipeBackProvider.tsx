"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function SwipeBackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Swipe tracking
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 120], [1, 0.5]);
  const scale = useTransform(x, [0, 120], [1, 0.98]);

  let startX = 0;

  function onTouchStart(e: React.TouchEvent) {
    startX = e.touches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientX - startX;

    // Only right-swipe and only from screen edge (< 32px)
    if (startX < 32 && delta > 0) {
      x.set(delta);
    }
  }

  function onTouchEnd() {
    if (x.get() > 80) {
      router.back();
    }
    x.set(0); // Reset
  }

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
