"use client";

import { FAQProps } from "@/components/../types/event/event.type";
import { Edit, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { microButton, visionFade } from "@/components/description/motion";
import { faqSx } from "./faq.style";

export default function FAQBlock(props: FAQProps) {
  const { items, isEditing, onClickEdit } = props;

  return (
    <motion.div variants={visionFade} whileHover="whileHover">
      <motion.div variants={microButton}>
        <Box sx={{ position: "relative" }}>
          {isEditing && (
            <IconButton sx={faqSx.editButton} onClick={onClickEdit}>
              <Edit />
            </IconButton>
          )}

          <Box sx={faqSx.root}>
            {items &&
              items.map((item, i) => (
                <Accordion key={i}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight={600}>{item.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ opacity: 0.85 }}>
                      {item.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
}
