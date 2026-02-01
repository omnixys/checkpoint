"use client";

import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useParallax } from "./useParallax";

export default function VisionStrip({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Smooth swipe inertia + snap-to-center
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.scrollSnapType = "x mandatory";
    el.style.scrollBehavior = "smooth";

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const down = (e: any) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const leave = () => (isDown = false);
    const up = () => (isDown = false);

    const move = (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // inertia multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", down);
    el.addEventListener("mouseleave", leave);
    el.addEventListener("mouseup", up);
    el.addEventListener("mousemove", move);

    return () => {
      el.removeEventListener("mousedown", down);
      el.removeEventListener("mouseleave", leave);
      el.removeEventListener("mouseup", up);
      el.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        gap: 3,
        px: 2,
        py: 2,
        scrollSnapType: "x mandatory",
        "&::-webkit-scrollbar": { display: "none" },
        position: "relative",
      }}
    >
      {children}
    </Box>
  );
}
