import type { Transition } from "framer-motion";

export const easeOut = [0.25, 0.1, 0.25, 1] as const;

export const shellEntry = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22 },
} as const;

export const panelSlide = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
  transition: { duration: 0.18 },
} as const;

export const emptyStateEntry = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.2 },
} as const;

export const sidebarCardStagger = (index: number) =>
  ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, delay: index * 0.03 },
  }) as const;

export const sidebarCardHover = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.997 },
  transition: { duration: 0.16 } as Transition,
};

export const tabHover = {
  whileHover: { y: -1 },
  whileTap: { scale: 0.995 },
  transition: { duration: 0.16 } as Transition,
};

export const activeIndicator = {
  initial: { opacity: 0, scale: 0.7 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.7 },
  transition: { duration: 0.16 },
} as const;

export const messageBubbleStagger = (index: number, fromAgent: boolean) =>
  ({
    initial: { opacity: 0, x: fromAgent ? 12 : -12, y: 4 },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.18, delay: index * 0.03 },
  }) as const;

export const emailCardEntry = (index: number) =>
  ({
    initial: { opacity: 0, y: 12, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.2, delay: index * 0.03 },
  }) as const;

export const mobileBack = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.18 },
} as const;
