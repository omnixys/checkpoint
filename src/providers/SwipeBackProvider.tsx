"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

export default function SwipeBackProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const startXRef = React.useRef(0);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 120], [1, 0.5]);
  const scale = useTransform(x, [0, 120], [1, 0.98]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = e.touches[0]?.clientX ?? 0;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentX = e.touches[0]?.clientX ?? 0;
    const delta = currentX - startXRef.current;

    if (startXRef.current < 32 && delta > 0) {
      x.set(delta);
    }
  };

  const onTouchEnd = () => {
    if (x.get() > 80) {
      router.back();
    }

    x.set(0);
    startXRef.current = 0;
  };

  // 🔥 CRITICAL: SSR-safe fallback
  if (!mounted) {
    return <div style={{ height: "100%", width: "100%" }}>{children}</div>;
  }

  return (
    <motion.div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        x,
        opacity,
        scale,
        height: "100%",
        width: "100%",
        touchAction: "pan-y",
      }}
    >
      {children}
    </motion.div>
  );
}
