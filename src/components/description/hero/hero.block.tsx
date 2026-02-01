// components/event-description/hero/hero.block.tsx
"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { visionDepth } from "@/components/description/motion";
import { useHeroLogic } from "./hero.logic";
import { heroSx } from "./hero.style";
import { HeroBlockProps } from "./hero.types";

export default function HeroBlock(props: HeroBlockProps) {
  const {
    title,
    subtitle,
    backgroundImage,
    overlayOpacity = 0.32,
    height = "82vh",
    isEditing,
    onClickEdit,
  } = props;

  const { rotateX, rotateY, handleMouse } = useHeroLogic();

  return (
    <motion.div
      variants={visionDepth}
      initial="initial"
      animate="animate"
      onMouseMove={(e) => {
        e.currentTarget.style.setProperty("--x", e.nativeEvent.offsetX + "px");
        e.currentTarget.style.setProperty("--y", e.nativeEvent.offsetY + "px");
      }}
      whileHover="whileHover"
    >
      <Box sx={heroSx.root as any} onMouseMove={handleMouse}>
        {/* Background */}
        <Box sx={heroSx.bg(backgroundImage)} />

        {/* Overlay */}
        <Box sx={heroSx.overlay(undefined, overlayOpacity)} />

        {/* Edit Button */}
        {isEditing && (
          <IconButton sx={heroSx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        {/* Content */}
        <Box sx={heroSx.content}>
          <Typography variant="h2" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" mt={1} sx={{ opacity: 0.85 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}
