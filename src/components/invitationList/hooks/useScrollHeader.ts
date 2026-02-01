import { useState, useEffect } from "react";

export function useScrollHeader(scrollRef: React.RefObject<HTMLElement>) {
  const [lastY, setLastY] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [glassOpacity, setGlassOpacity] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      const y = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;

      // progress bar
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);

      // glass
      setGlassOpacity(Math.min(Math.max(y / 160, 0), 1));

      // collapse
      setCollapsed(y > 40);

      if (y > lastY + 1) setVisible(false);
      else if (y < lastY - 1) setVisible(true);


      setLastY(y);
    }

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [lastY, scrollRef]);

  return { collapsed, visible, progress, glassOpacity };
}
