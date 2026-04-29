"use client";

import { EventSelectionNode } from "@/checkpoint/hooks/events/useEventSelection";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  Chip,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { useMemo } from "react";

type Props = {
  rootEventId: string;
  rootEventName: string;
  children: EventSelectionNode[];
  isRootSelected: boolean;
  isChildSelected: (childId: string) => boolean;
  onToggleRoot: () => void;
  onToggleChild: (childId: string) => void;
};

export default function EventParticipationField({
  rootEventName,
  children,
  isRootSelected,
  isChildSelected,
  onToggleRoot,
  onToggleChild,
}: Props) {
  const theme = useTheme();
  const t = useTypedTranslations("rsvp");

  const selectedChildren = useMemo(() => {
    return children.filter((c) => isChildSelected(c.id));
  }, [children, isChildSelected]);

  const selectedCount = selectedChildren.length;
  const allSelected = selectedCount === children.length && children.length > 0;

  const isIndeterminate = selectedCount > 0 && selectedCount < children.length;

  /* --------------------------------------------------------------- */
  /* EMPTY STATE (nur root event)                                    */
  /* --------------------------------------------------------------- */

  if (children.length === 0) {
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">{t("public.participationConfirm")}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <FormControlLabel
            control={<Checkbox checked={isRootSelected} onChange={onToggleRoot} />}
            label={rootEventName}
          />
        </AccordionDetails>
      </Accordion>
    );
  }

  /* --------------------------------------------------------------- */
  /* NORMAL STATE                                                    */
  /* --------------------------------------------------------------- */

  return (
    <Accordion
      defaultExpanded
      sx={{
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: "blur(14px)",
        borderRadius: 0,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          spacing={1}
          sx={{
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {t("public.participation")}
          </Typography>

          {/* Selection Summary */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {isRootSelected ? (
              <Chip label={t("public.allEvents")} color="primary" size="small" />
            ) : selectedChildren.length > 0 ? (
              selectedChildren
                .slice(0, 2)
                .map((c) => <Chip key={c.id} label={c.name} size="small" />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t("public.noSelection")}
              </Typography>
            )}

            {selectedChildren.length > 2 && (
              <Chip label={`+${selectedChildren.length - 2}`} size="small" />
            )}
          </Box>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          {/* ROOT */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(theme.palette.primary.main, 0.06),
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRootSelected || allSelected}
                  indeterminate={isIndeterminate}
                  onChange={onToggleRoot}
                />
              }
              label={
                <Typography sx={{ fontWeight: 500 }}>
                  {t("public.rootWithAll", { name: rootEventName })}
                </Typography>
              }
            />
          </Box>

          {/* CHILDREN */}
          <FormGroup>
            <Stack spacing={0.5}>
              {children.map((child) => {
                const checked = isChildSelected(child.id);

                return (
                  <Box
                    key={child.id}
                    sx={{
                      borderRadius: 2,
                      px: 1,
                      py: 0.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        background: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox checked={checked} onChange={() => onToggleChild(child.id)} />
                      }
                      label={child.name}
                    />
                  </Box>
                );
              })}
            </Stack>
          </FormGroup>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
