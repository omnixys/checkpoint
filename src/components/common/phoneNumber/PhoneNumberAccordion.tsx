"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";

interface Props {
  value: PhoneNumberInput;
  index: number;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

export default function PhoneNumberAccordion({ value, index, onRemove, onEdit }: Props) {
  const theme = useTheme();

  return (
    <Accordion
      sx={{
        background: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: "blur(10px)",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {value.label || "Phone"}
          </Typography>

          <Typography color="text.secondary">
            {value.countryCode} {value.number}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2">{value.type}</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => onEdit(index)}>✏️</IconButton>

            <IconButton onClick={() => onRemove(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
