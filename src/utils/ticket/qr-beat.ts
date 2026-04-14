import type { HTMLMotionProps } from "framer-motion";

/**
 * QR beat animation config for the rotating QR lifecycle.
 *
 * Important:
 * - Return type is aligned with motion.div props
 * - ease must be a Framer Motion literal, not a generic string
 */
export function qrBeatAnimation(
  rotationSeconds: number,
): Pick<HTMLMotionProps<"div">, "animate" | "transition"> {
  const duration = Math.max(rotationSeconds, 3);

  return {
    animate: {
      scale: [1, 1.035, 1],
      opacity: [1, 0.96, 1],
    },
    transition: {
      duration,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };
}
