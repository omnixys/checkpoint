// components/event-description/text/text.block.tsx
"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { spotlightHover, visionFade } from "@/components/description/motion";
import { useTextLogic } from "./text.logic";
import { textSx } from "./text.style";
import { TextBlockProps } from "./text.types";

export default function TextBlock(props: TextBlockProps) {
  const { title, content, align = "left", isEditing, onClickEdit } = props;

  const { html } = useTextLogic(content ?? "");

  return (
    <motion.div
      variants={visionFade}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      onMouseMove={(e) => {
        e.currentTarget.style.setProperty("--x", e.nativeEvent.offsetX + "px");
        e.currentTarget.style.setProperty("--y", e.nativeEvent.offsetY + "px");
      }}
    >
      <motion.div variants={spotlightHover}>
        <Box sx={{ position: "relative" }}>
          {/* Edit */}
          {isEditing && (
            <IconButton sx={textSx.editButton} onClick={onClickEdit}>
              <Edit />
            </IconButton>
          )}

          <Box sx={textSx.root}>
            {title && (
              <Typography variant="h4" sx={textSx.title} fontWeight={600}>
                {title}
              </Typography>
            )}

            <Box
              sx={{
                ...textSx.content,
                textAlign: align,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}
