// MotionDialogTransition.tsx
"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

// IMPORTANT for MUI7: must forward the ref
export const MotionDialogTransition = forwardRef(
  function MotionDialogTransition(props: any, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        {...props}
      />
    );
  }
);
