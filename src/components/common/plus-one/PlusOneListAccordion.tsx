"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { NormalizedPlusOne } from "@/checkpoint/types/event.type";

type Props = {
  values: NormalizedPlusOne[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function PlusOneListAccordion({ values, onAdd, onEdit, onRemove }: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("common");

  return (
    <Accordion
      defaultExpanded={true}
      disableGutters={true}
      sx={{
        background: alpha(theme.palette.background.paper, 0.46),
        border: "1px solid",
        borderColor: alpha(theme.palette.text.primary, 0.1),
        borderRadius: "18px !important",
        boxShadow: "none",
        overflow: "hidden",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {t("plusOne.title", { count: values.length })}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1.5}>
          {values.map((p, index) => (
            <Stack
              key={`${p.firstName}-${p.lastName}-${p.email ?? "no-email"}`}
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid",
                borderColor: alpha(theme.palette.text.primary, 0.08),
                p: 1.5,
                borderRadius: 2,
                transition: "background-color 200ms ease, border-color 200ms ease",
                "&:hover": {
                  background: alpha(theme.palette.primary.main, 0.06),
                  borderColor: alpha(theme.palette.primary.main, 0.24),
                },
              }}
            >
              <Stack>
                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {p.firstName || t("plusOne.guest")} {p.lastName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {p.email || t("plusOne.noEmail")}
                </Typography>
              </Stack>

              <Stack direction="row">
                <Tooltip title={t("edit")}>
                  <IconButton onClick={() => onEdit(index)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t("delete")}>
                  <IconButton onClick={() => onRemove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          ))}

          <Divider />

          <Button onClick={onAdd} fullWidth={true} variant="outlined">
            {t("plusOne.add")}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
