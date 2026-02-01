// src/components/myQr/qr-beat.ts

export function qrBeatAnimation(rotationSeconds: number) {
  const duration = Math.max(rotationSeconds, 3); // safety floor

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
