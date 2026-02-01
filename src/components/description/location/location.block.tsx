"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { visionDepth } from "@/components/description/motion";
import { locationSx } from "./location.style";
import { LocationBlockProps } from "./location.types";

export default function LocationBlock(props: LocationBlockProps) {
  const { title, address, image, mapEmbedUrl, isEditing, onClickEdit } = props;

  return (
    <motion.div variants={visionDepth} initial="initial" animate="animate">
      <Box sx={{ position: "relative" }}>
        {isEditing && (
          <IconButton sx={locationSx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        <Box sx={locationSx.root}>
          {/* Image */}
          {image && (
            <Box sx={locationSx.imgBox}>
              <img src={image} style={locationSx.img} />
            </Box>
          )}

          {/* Info */}
          <Box sx={locationSx.right}>
            {title && (
              <Typography variant="h5" fontWeight={600}>
                {title}
              </Typography>
            )}

            <Typography sx={{ opacity: 0.9 }}>{address}</Typography>

            {mapEmbedUrl && (
              <iframe src={mapEmbedUrl} style={locationSx.map} loading="lazy" />
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
