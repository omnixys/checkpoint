import { Transition, Variants } from "framer-motion";

export const visionMotion: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 180,
  mass: 0.9,
};

export const visionFade2 = {
  initial: { opacity: 0, y: 28, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: visionMotion,
};

export const visionDepth = {
  initial: { opacity: 0, scale: 0.94, y: 20, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: visionMotion,
  },
};

export const visionDepthMotion = {
  initial: { opacity: 0, y: 30, rotateX: 0.6 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  whileHover: {
    scale: 1.02,
    rotateX: 1.5,
    rotateY: -1,
    transition: { duration: 0.4 },
  },
};

export const visionFade: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const spotlightHover: Variants = {
  initial: { opacity: 1, background: "transparent" },
  animate: { opacity: 1 },
  whileHover: {
    background:
      "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.10), transparent 60%)",
    transition: { duration: 0.25 },
  },
};

export const ambientLift = {
  initial: { boxShadow: "0 0 0 rgba(0,0,0,0)" },
  whileHover: {
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    transition: { duration: 0.35 },
  },
};

export const glassLayer = {
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.25)",
};

export const bloomHover = {
  whileHover: {
    filter: "brightness(1.12) saturate(1.05)",
    transition: { duration: 0.25 },
  },
};

export const scrollParallax = {
  initial: { y: 0 },
  animate: (i: number) => ({
    y: [0, 10, 0],
    transition: {
      duration: 4 + i,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

export const microButton = {
  whileTap: { scale: 0.96 },
  whileHover: { scale: 1.04 },
  transition: { type: "spring", stiffness: 380, damping: 26 },
};
