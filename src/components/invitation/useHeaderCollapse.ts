"use client";

import { useEffect, useState } from "react";

/**
 * Controls header collapse behavior based on scroll
 *
 * - Auto collapses when user scrolls down
 * - Expands when user scrolls up
 */
export function useHeaderCollapse() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [lastY, setLastY] = useState<number>(0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;

      if (currentY > lastY && currentY > 80) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }

      setLastY(currentY);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return {
    collapsed,
    setCollapsed,
  };
}
