"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onReload: () => Promise<void | any>;
};

export default function PullToRefresh({ children, onReload }: Props) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, (v) => Math.min(v / 60, 1));

  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);

  const startY = useRef(0);

  /**
   * Pointer Down → start dragging
   */
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left mouse button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startY.current = e.clientY;
    setDragging(true);
  };

  /**
   * Pointer Move → ONLY when dragging
   */
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || refreshing) return;

    const diff = e.clientY - startY.current;

    if (diff > 0 && diff < 80) {
      y.set(diff);
    }
  };

  /**
   * Pointer Up → release
   */
  const handlePointerUp = async () => {
    if (!dragging) return;

    setDragging(false);

    if (y.get() > 65) {
      setRefreshing(true);

      try {
        await onReload();
      } finally {
        setTimeout(() => {
          y.set(0);
          setRefreshing(false);
        }, 400);
      }
    } else {
      y.set(0);
    }
  };

  return (
    <motion.div
      style={{ y, touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <motion.div
        style={{
          height: refreshing ? 40 : 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity,
        }}
      >
        <motion.div
          animate={refreshing ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
          style={{ width: 22, height: 22 }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5"
              stroke="#007aff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {children}
    </motion.div>
  );
}
