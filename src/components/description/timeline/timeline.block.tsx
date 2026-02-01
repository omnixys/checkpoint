"use client";

import { microButton, visionFade } from "@/components/description/motion";
import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { timelineSx } from "./timeline.style";
import { TimelineBlockProps } from "./timeline.types";

export default function TimelineBlock(props: TimelineBlockProps) {
  const { steps, isEditing, onClickEdit } = props;

  return (
    <motion.div variants={visionFade} initial="initial" animate="animate">
      <Box sx={{ position: "relative" }}>
        {isEditing && (
          <IconButton sx={timelineSx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        <Box sx={timelineSx.root}>
          <Box sx={timelineSx.line} />
          <motion.div
            variants={visionFade}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps &&
              steps.map((s, i) => (
                <motion.div
                  key={i}
                  variants={microButton}
                  whileHover="whileHover"
                  whileTap="whileTap"
                >
                  <Box key={i} sx={timelineSx.step}>
                    <Box sx={timelineSx.dot} />

                    <Typography variant="h6" fontWeight={600}>
                      {s.time} — {s.title}
                    </Typography>

                    {s.description && (
                      <Typography mt={1} sx={{ opacity: 0.8 }}>
                        {s.description}
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              ))}
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
