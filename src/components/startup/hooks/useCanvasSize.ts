"use client";

import { useEffect, useState } from "react";

/**
 * Tracks viewport size for WebGL canvas.
 */
export function useCanvasSize() {
  const [size, setSize] = useState({ w: 1, h: 1 });

  useEffect(() => {
    const update = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
