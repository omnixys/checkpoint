"use client";

import React, { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideProps {
  step: number;
  children: JSX.Element;
}

export function SlideTransition({ step, children }: SlideProps): JSX.Element {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1.0], // iOS spring-ish curve
        }}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
