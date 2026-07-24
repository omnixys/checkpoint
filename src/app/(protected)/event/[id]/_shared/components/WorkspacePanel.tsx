"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  panelKey: string;
  children: ReactNode;
}

const MotionDiv = motion.div;

export function WorkspacePanel({ panelKey, children }: Props) {
  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={panelKey}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.18 }}
        style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {children}
      </MotionDiv>
    </AnimatePresence>
  );
}
