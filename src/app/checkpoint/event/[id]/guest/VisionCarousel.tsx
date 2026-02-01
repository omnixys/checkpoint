"use client";

import React, { useEffect, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { EmblaOptionsType } from "embla-carousel";
import { motion } from "framer-motion";

type Axis = "x" | "y";

type VisionEmblaCarouselProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number;
  autoplay?: boolean;
  delay?: number;
  axis?: Axis;
  options?: EmblaOptionsType;
};

export function VisionEmblaCarousel<T>({
  items,
  renderItem,
  slidesPerView = 2,
  autoplay = true,
  delay = 3200,
  axis = "x",
  options,
}: VisionEmblaCarouselProps<T>) {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = React.useState(0);


  const plugins = useMemo(
    () =>
      autoplay
        ? [
            Autoplay({
              delay,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]
        : [],
    [autoplay, delay]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      axis,
      align: "start",
      ...options,
    },
    plugins
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    onSelect(); // initial
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);


  return (
    <Box
      ref={emblaRef}
      sx={{
        overflow: "hidden",
        touchAction: axis === "y" ? "pan-y" : "pan-x",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: axis === "y" ? "column" : "row",
        }}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <Box
              key={index}
              sx={{
                flex: axis === "x" ? `0 0 ${100 / slidesPerView}%` : "0 0 auto",
                px: axis === "x" ? 0.75 : 0,
                py: axis === "y" ? 0.75 : 0,
                willChange: "transform, opacity, box-shadow",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.035 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 0 rgba(0,0,0,0))"
                    : "none",
                }}
              >
                {/* 👇 dein renderItem bleibt unverändert */}
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    borderColor: isActive
                      ? theme.palette.primary.main
                      : "transparent",
                    borderWidth: 1,
                    borderStyle: "solid",
                    boxShadow: isActive
                      ? "0 8px 16px rgba(0,0,0,0.12)"
                      : "0 4px 8px rgba(0,0,0,0.08)",
                    transition: "box-shadow 0.3s, border-color 0.3s",
                  }}
                >
                  {renderItem(item, index)}
                </Box>
              </motion.div>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
