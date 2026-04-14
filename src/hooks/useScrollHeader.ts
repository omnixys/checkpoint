"use client";

import { useEffect, useRef, useState } from "react";

export type UseScrollHeaderOptions = {
  scrollRef?: React.RefObject<HTMLElement | null>;
  collapseThreshold?: number;
  visibilityThreshold?: number;
  glassThreshold?: number;
};

export type ScrollHeaderState = {
  collapsed: boolean;
  visible: boolean;
  progress: number;
  glassOpacity: number;
};

/**
 * Enterprise-grade scroll header hook.
 *
 * Features:
 * - Supports window OR custom scroll container
 * - Minimal re-renders
 * - No event re-binding
 * - Fully configurable thresholds
 */
export function useScrollHeader(options: UseScrollHeaderOptions = {}): ScrollHeaderState {
  const {
    scrollRef,
    collapseThreshold = 40,
    visibilityThreshold = 80,
    glassThreshold = 160,
  } = options;

  const lastY = useRef(0);

  const [state, setState] = useState<ScrollHeaderState>({
    collapsed: false,
    visible: true,
    progress: 0,
    glassOpacity: 0,
  });

  useEffect(() => {
    const target = scrollRef?.current ?? window;

    if (!target) return;

    const getScrollY = () => {
      if (target === window) return window.scrollY;

      const el = target as HTMLElement;
      return el.scrollTop;
    };

    const getMaxScroll = () => {
      if (target === window) {
        const doc = document.documentElement;
        return doc.scrollHeight - window.innerHeight;
      }

      const el = target as HTMLElement;
      return el.scrollHeight - el.clientHeight;
    };

    function handleScroll() {
      const y = getScrollY();
      const max = getMaxScroll();

      const next: ScrollHeaderState = {
        collapsed: y > collapseThreshold,
        visible: y < lastY.current || y < visibilityThreshold,
        progress: max > 0 ? Math.min(y / max, 1) : 0,
        glassOpacity: Math.min(Math.max(y / glassThreshold, 0), 1),
      };

      lastY.current = y;

      // prevent unnecessary re-renders
      setState((prev) => {
        if (
          prev.collapsed === next.collapsed &&
          prev.visible === next.visible &&
          prev.progress === next.progress &&
          prev.glassOpacity === next.glassOpacity
        ) {
          return prev;
        }
        return next;
      });
    }

    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, collapseThreshold, visibilityThreshold, glassThreshold]);

  return state;
}
