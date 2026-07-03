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

import type { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface Props {
  values: PhoneNumberInput[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function PhoneNumberListAccordion({ values, onAdd, onEdit, onRemove }: Props) {
  const t = useTypedTranslations("common");
  const theme = useTheme();

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
          {t("phone.title", { count: values.length })}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={1.5}>
          {values.map((p, index) => (
            <Stack
              key={`${p.countryCode}-${p.number}-${p.type}`}
              direction={{ xs: "column", sm: "row" }}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
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
              <Stack sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                  }}
                >
                  {p.label || p.type}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {p.countryCode} {p.number || t("empty")}
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: { xs: "flex-end", sm: "initial" } }}>
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
            {t("phone.add")}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
