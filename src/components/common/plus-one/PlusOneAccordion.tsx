"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";

interface Props {
  value: NormalizedPlusOne;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function PlusOneAccordion({ value, index, onEdit, onRemove }: Props) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {value.firstName || "Guest"} {value.lastName}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">{value.email || "—"}</Typography>

          <Stack direction="row">
            <IconButton onClick={() => onEdit(index)}>
              <EditIcon />
            </IconButton>

            <IconButton onClick={() => onRemove(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
