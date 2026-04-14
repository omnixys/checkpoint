"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
  Button,
  IconButton,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { PhoneNumberInput } from "@/checkpoint/generated/graphql";

type Props = {
  values: PhoneNumberInput[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function PhoneNumberListAccordion({ values, onAdd, onEdit, onRemove }: Props) {
  const theme = useTheme();

  return (
    <Accordion
      defaultExpanded
      sx={{
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(14px)",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          Telefonnummern ({values.length})
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1.5}>
          {values.map((p, index) => (
            <Stack
              key={index}
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.2,
                borderRadius: 2,
                "&:hover": {
                  background: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              <Stack>
                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {p.label || p.type}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {p.countryCode} {p.number || "—"}
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconButton onClick={() => onEdit(index)}>
                  <EditIcon />
                </IconButton>

                <IconButton onClick={() => onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          ))}

          <Divider />

          <Button onClick={onAdd} fullWidth>
            + Telefonnummer hinzufügen
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
