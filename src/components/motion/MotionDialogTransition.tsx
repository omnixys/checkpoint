"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

type MotionDialogTransitionProps = {
  children?: React.ReactNode;
  in?: boolean;
  onEnter?: () => void;
  onExited?: () => void;
};

/**
 * Framer Motion transition adapter for MUI Dialog.
 *
 * Important:
 * - MUI passes transition lifecycle props like `in`, `onEnter`, and `onExited`
 * - These props must never be forwarded to the DOM
 * - We map the open/close state to Framer Motion animation state manually
 */
export const MotionDialogTransition = forwardRef<
  HTMLDivElement,
  MotionDialogTransitionProps
>(function MotionDialogTransition(props, ref) {
  const { children, in: inProp = false, onEnter, onExited } = props;

  /**
   * Notify MUI that the enter phase has started.
   * This keeps the transition contract compatible enough for Dialog usage.
   */
  const handleAnimationStart = () => {
    if (inProp) {
      onEnter?.();
    }
  };

  /**
   * Notify MUI when the exit animation is done.
   */
  const handleAnimationComplete = () => {
    if (!inProp) {
      onExited?.();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={
        inProp
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.85, y: 20 }
      }
      transition={{ type: "spring", stiffness: 140, damping: 16 }}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      style={{ width: "100%" }}
    >
      {children}
    </motion.div>
  );
});
