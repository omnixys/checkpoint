"use client";

import { useState } from "react";

export function useParallax(maxTilt: number = 10) {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  function handleMouse(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = (x - centerX) / centerX;
    const dy = (y - centerY) / centerY;

    setTiltX(dx * maxTilt);
    setTiltY(-dy * maxTilt);
  }

  function handleLeave() {
    setTiltX(0);
    setTiltY(0);
  }

  return { tiltX, tiltY, handleMouse, handleLeave };
}
