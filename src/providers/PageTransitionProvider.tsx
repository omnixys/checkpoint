"use client";

import { AnimatePresence, cubicBezier, motion, useIsPresent } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { JSX } from "react";

/* ------------------------------------------------------------
 * Route → Animation Mapping
 * ------------------------------------------------------------ */
function getAnimationType(path: string): "card" | "push" {
  if (
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/unlock")
  ) {
    return "card";
  }
  return "push";
}

/* ------------------------------------------------------------
 * Deluxe Animation Variants
 * ------------------------------------------------------------ */
const deluxeVariants = {
  /* ------------------------------------------------------------
   * IOS PUSH – (with parallax, depth, ease & shadow)
   * ------------------------------------------------------------ */
  push: {
    initial: {
      opacity: 0,
      x: 40,
      scale: 0.985,
      filter: "blur(6px)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
    },
    exit: {
      opacity: 0,
      x: -35,
      scale: 0.98,
      filter: "blur(4px)",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    transition: {
      duration: 0.45,
      ease: cubicBezier(0.17, 0.84, 0.44, 1),
    },
  },

  /* ------------------------------------------------------------
   * CARD – Login/Register: iOS modal sheet
   * ------------------------------------------------------------ */
  card: {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.96,
      filter: "blur(4px)",
      borderRadius: "36px",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      borderRadius: "28px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    },
    exit: {
      opacity: 0,
      y: -40,
      scale: 0.97,
      filter: "blur(6px)",
      borderRadius: "36px",
    },
    transition: {
      duration: 0.42,
      ease: cubicBezier(0.25, 0.9, 0.3, 1),
    },
  },
};

/* ------------------------------------------------------------
 * PageTransitionProvider
 * ------------------------------------------------------------ */
export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const type = getAnimationType(pathname);
  const anim = deluxeVariants[type];

  // Increases quality of exit animations
  const isPresent = useIsPresent();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={pathname}
        initial={anim.initial}
        animate={anim.animate}
        exit={anim.exit}
        transition={anim.transition}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          willChange: "transform, opacity, filter",
        }}
      >
        {children}

        {/* Smooth fade gradient on exit (very Apple style) */}
        {!isPresent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to left, rgba(0,0,0,0.2), transparent)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
