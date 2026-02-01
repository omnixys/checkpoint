"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ambientLift, bloomHover, visionDepth } from "@/components/description/motion";
import { teamSx } from "./team.style";
import { TeamBlockProps } from "./team.types";

export default function TeamBlock(props: TeamBlockProps) {
  const { members, isEditing, onClickEdit } = props;

  return (
    <motion.div variants={visionDepth} initial="initial" animate="animate">
      <Box sx={{ position: "relative" }}>
        {isEditing && (
          <IconButton sx={teamSx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        <Box sx={teamSx.root}>
          {members &&
            members.map((m, i) => (
              <motion.div variants={visionDepth} whileHover="whileHover">
                <motion.div variants={ambientLift}>
                  <motion.div variants={bloomHover}>
                    <Box sx={teamSx.card}>
                      {m.image && <img src={m.image} style={teamSx.avatar} />}

                      <Typography variant="h6" fontWeight={600}>
                        {m.name}
                      </Typography>

                      <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                        {m.role}
                      </Typography>

                      {m.bio && (
                        <Typography mt={1} sx={{ opacity: 0.8 }}>
                          {m.bio}
                        </Typography>
                      )}
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
