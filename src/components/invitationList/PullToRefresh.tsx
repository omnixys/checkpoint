"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function PullToRefresh({ children, onReload }) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, (v) => Math.min(v / 60, 1));

  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);

  const handlePointerDown = (e) => {
    startY.current = e.clientY;
  };

  const handlePointerMove = (e) => {
    if (refreshing) return;
    const diff = e.clientY - startY.current;
    if (diff > 0 && diff < 80) {
      y.set(diff);
    }
  };

  const handlePointerUp = async () => {
    if (y.get() > 65) {
      setRefreshing(true);
      await onReload();
      setTimeout(() => {
        y.set(0);
        setRefreshing(false);
      }, 400);
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
