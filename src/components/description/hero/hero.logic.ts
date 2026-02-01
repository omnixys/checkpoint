// components/event-description/hero/hero.logic.ts
"use client";

import { useMotionValue, useTransform } from "framer-motion";
import { useCallback } from "react";

export function useHeroLogic() {
  // Device + Mouse Parallax
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useTransform(tiltY, [-20, 20], [6, -6]);
  const rotateY = useTransform(tiltX, [-20, 20], [-6, 6]);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    tiltX.set(x);
    tiltY.set(y);
  }, []);

  return { rotateX, rotateY, handleMouse };
}
