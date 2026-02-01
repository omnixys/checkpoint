"use client";

import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { JSX, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NavItem } from "../navigation.config";
import { isActiveNavItem } from "./navigation.util";


type Props = {
  items: NavItem[];
  eventId: string | undefined;
};

export function MobileNavCarousel({ items, eventId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  /* Auto-scroll to active item */
  useEffect(() => {
    if (!emblaApi) return;

    const index = items.findIndex((i) =>
      isActiveNavItem(
        pathname,
        i.path,
        items.map((i) => i.path)
      )
    );
    if (index >= 0) emblaApi.scrollTo(index);
  }, [pathname, emblaApi, items]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(20,20,20,0.75)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Box ref={emblaRef} sx={{ overflow: "hidden" }}>
        <Box sx={{ display: "flex" }}>
          {items.map((item) => {
            const active = isActiveNavItem(pathname, item.path, items.map(i => i.path));

            return (
              <Box
                key={item.path}
                onClick={() => !item.disabled && router.push("/checkpoint/" + item.path)}
                sx={{
                  flex: "0 0 25%", // 👈 max 4 sichtbar
                  py: 1,
                  position: "relative",
                  opacity: item.disabled ? 0.4 : 1,
                }}
              >
                {/* VisionOS Pill */}
                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: 2,
                    transform: "translateX(-50%)",
                    width: 22,
                    height: 3,
                    borderRadius: 999,
                    backgroundColor: "primary.main",
                    opacity: active ? 1 : 0,
                    scaleX: active ? 1 : 0,
                    transition:
                      "opacity 200ms ease, transform 260ms cubic-bezier(.4,0,.2,1)",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.4,
                    color: active ? "primary.main" : "text.secondary",
                    transition: "color 0.25s ease",
                  }}
                >
                  {/* Icon Pulse */}
                  <motion.div
                    key={active ? "active" : "inactive"}
                    initial={{ scale: 1 }}
                    animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {item.icon}
                  </motion.div>

                  <Typography
                    fontSize={11}
                    fontWeight={active ? 700 : 500}
                    noWrap
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}
