// components/event-description/features/features.block.tsx
"use client";

import { FeaturesProps } from "@/components/../types/event/event.type";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ambientLift, visionDepth } from "@/components/description/motion";
import { useFeaturesLogic } from "./features.logic";
import { featuresSx } from "./features.style";

export default function FeaturesBlock(props: FeaturesProps) {
  const { items, isEditing, onClickEdit } = props;

  useFeaturesLogic(items ?? []);

  return (
    <motion.div
      variants={visionDepth}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      //onMouseMove={spotlightHover}
    >
      <motion.div variants={ambientLift}>
        <Box sx={{ position: "relative" }}>
          {isEditing && (
            <IconButton sx={featuresSx.editButton} onClick={onClickEdit}>
              <Edit />
            </IconButton>
          )}

          <Box sx={featuresSx.root}>
            {items &&
              items.map((item, i) => (
                <motion.div
                  key={i}
                  variants={visionDepth}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <Box sx={featuresSx.card}>
                    <Box
                      className="material-symbols-rounded"
                      sx={featuresSx.icon}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                    {item.description && (
                      <Typography mt={1} sx={{ opacity: 0.8 }}>
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              ))}
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}
