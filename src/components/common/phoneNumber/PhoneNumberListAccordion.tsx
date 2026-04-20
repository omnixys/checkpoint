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
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { PhoneNumberInput } from "@/checkpoint/generated/graphql";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

type Props = {
  values: PhoneNumberInput[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
};

export default function PhoneNumberListAccordion({ values, onAdd, onEdit, onRemove }: Props) {
  const t = useTypedTranslations("common");
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
          {t("phone.title", { count: values.length })}
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
                  {p.countryCode} {p.number || t("empty")}
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

          <Button onClick={onAdd} fullWidth>
            {t("phone.add")}
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
