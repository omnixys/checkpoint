"use client";

import { motion } from "framer-motion";
import type * as React from "react";

interface AnimatedIconProps {
  children: React.ReactNode;
}

export default function AnimatedIcon({ children }: AnimatedIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}
