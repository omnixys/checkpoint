"use client";

import React from "react";

export function useScrollHeader() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const lastY = React.useRef(0);

  React.useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;

      setCollapsed(y > 40);
      setVisible(y < lastY.current || y < 80);

      lastY.current = y;
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { collapsed, visible };
}
