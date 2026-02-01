"use client";

import { getLogger } from "@/components/../utils/logger";
import { useEffect, useState } from "react";

/* ----------------------------------------------------------------------------
 * Hook controlling Back-to-Top FAB visibility
 * Appears after user scrolls > 300px
 * -------------------------------------------------------------------------- */
export function useScrollTopButton() {
  const logger = getLogger("useScrollTopButton");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      logger.debug("Scroll Y:", y);
      setVisible(y > 300);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { visible };
}
