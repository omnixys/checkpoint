// components/event-description/gallery/gallery.block.tsx
"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { ambientLift, bloomHover, visionDepth, visionFade } from "@/components/description/motion";
import { useGalleryLogic } from "./gallery.logic";
import { gallerySx } from "./gallery.style";
import { GalleryBlockProps } from "./gallery.types";

export default function GalleryBlock(props: GalleryBlockProps) {
  const { images, aspectRatio = "16:9", isEditing, onClickEdit } = props;
  const { count } = useGalleryLogic(images ?? []);

  return (
    <motion.div variants={visionFade} initial="initial" animate="animate">
      <Box sx={{ position: "relative" }}>
        {isEditing && (
          <IconButton sx={gallerySx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        <Box sx={gallerySx.root}>
          {images &&
            images.map((img, i) => (
              <motion.div
                key={i}
                variants={visionDepth}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover="whileHover"
              >
                <motion.div variants={ambientLift}>
                  <motion.div variants={bloomHover}>
                    <Box
                      sx={{
                        ...gallerySx.imageWrapper,
                        paddingTop:
                          aspectRatio === "16:9"
                            ? "56.25%"
                            : aspectRatio === "3:4"
                            ? "133%"
                            : "100%",
                      }}
                    >
                      <img src={img} style={gallerySx.img} />
                    </Box>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
        </Box>
      </Box>
    </motion.div>
  );
}
