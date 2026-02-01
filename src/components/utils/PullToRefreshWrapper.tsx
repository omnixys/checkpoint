"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
  onRefresh: () => void;
};

export default function PullToRefreshWrapper({ children, onRefresh }: Props) {
  const y = useMotionValue(0);
  const stretch = useTransform(y, [0, 80], [0, 20]);

  let startY = 0;

  const onTouchStart = (e: React.TouchEvent) => {
    startY = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) y.set(diff / 2);
  };

  const onTouchEnd = () => {
    if (y.get() > 50) onRefresh();
    y.set(0);
  };

  return (
    <motion.div
      style={{ y: stretch }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Box>{children}</Box>
    </motion.div>
  );
}
