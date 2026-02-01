"use client";

import { Edit } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { quoteSx } from "./quote.style";
import { QuoteBlockProps } from "./quote.types";

export default function QuoteBlock(props: QuoteBlockProps) {
  const { quote, author, isEditing, onClickEdit } = props;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box sx={{ position: "relative" }}>
        {isEditing && (
          <IconButton sx={quoteSx.editButton} onClick={onClickEdit}>
            <Edit />
          </IconButton>
        )}

        <Box sx={quoteSx.root}>
          <Typography sx={quoteSx.quote}>"{quote}"</Typography>
          {author && <Typography sx={quoteSx.author}>– {author}</Typography>}
        </Box>
      </Box>
    </motion.div>
  );
}
