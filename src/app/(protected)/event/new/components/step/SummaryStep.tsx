"use client";

import { Masonry } from "@mui/lab";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useCreateEvent } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import type { CreateEventDraft } from "@/checkpoint/app/(protected)/event/new/types/event/event-draft.type";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { formatEnum } from "@/checkpoint/i18n/format-enum";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { formatChildEventDateRange } from "@/checkpoint/utils/date-utils";

interface Props {
  draft: CreateEventDraft;
  onEdit: (step: CreateEventWizardStep) => void;
}

export default function SummaryStep({ draft, onEdit }: Props) {
  const _theme = useTheme();
  const t = useTypedTranslations("create");

  const { form } = useCreateEvent();
  const errors = form.errors;

  /**
   *
   * -------------------------------------------------------------
   * Section Error Mapping
   * -------------------------------------------------------------
   */
  const hasError = (prefix: string) => Object.keys(errors).some((k) => k.startsWith(prefix));

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Masonry columns={{ xs: 1, md: 2 }} spacing={2}>
        <Section
          title={t("summary.basics")}
          error={hasError("name") || hasError("startsAt") || hasError("endsAt")}
          onClick={() => onEdit(CreateEventWizardStep.BASICS)}
        >
          <Item label={t("basics.name")} value={draft.name} />
          <Item label={t("basics.startsAt")} value={draft.startsAt ?? null} />
          <Item label={t("basics.endsAt")} value={draft.endsAt ?? null} />
        </Section>

        <Section
          title={t("summary.address")}
          error={hasError("address")}
          onClick={() => onEdit(CreateEventWizardStep.ADDRESS)}
        >
          {draft.address ? (
            <>
              <Item
                label={t("address.street")}
                value={`${draft.address.street ?? ""} ${draft.address.houseNumber ?? ""}`}
              />
              <Item
                label={t("address.city")}
                value={`${draft.address.postalCode ?? ""} ${draft.address.city ?? ""}`}
              />
              <Item label={t("address.country")} value={draft.address.country} />
            </>
          ) : (
            <MutedText>{t("summary.noAddress")}</MutedText>
          )}
        </Section>

        <Section
          title={t("summary.settings")}
          error={hasError("settings")}
          onClick={() => onEdit(CreateEventWizardStep.SETTINGS)}
        >
          <Item label={t("settings.maxSeats")} value={String(draft.settings.maxSeats)} />
          <Item label={t("settings.rotateSeconds")} value={String(draft.settings.rotateSeconds)} />
        </Section>

        <Section
          title={t("summary.visibility")}
          error={hasError("settings.allowPublic")}
          onClick={() => onEdit(CreateEventWizardStep.VISIBILITY)}
        >
          <BooleanItem label={t("visibility.isPublic")} value={draft.settings.isPublic} />
          <BooleanItem
            label={t("visibility.allowPublicRsvp")}
            value={draft.settings.allowPublicRsvp}
          />
        </Section>

        <Section
          title={t("summary.experience")}
          error={hasError("settings.category")}
          onClick={() => onEdit(CreateEventWizardStep.EXPERIENCE)}
        >
          <Item
            label={t("experience.category")}
            value={
              draft.settings.category
                ? formatEnum(t, "experience.categories", draft.settings.category)
                : null
            }
          />
        </Section>

        <Section
          title={t("summary.children")}
          error={hasError("children")}
          onClick={() => onEdit(CreateEventWizardStep.CHILDREN)}
        >
          {(draft.children?.length ?? 0) > 0 ? (
            draft.children.map((child) => {
              const date = formatChildEventDateRange(child.startsAt, child.endsAt, "de-DE", t);

              return (
                <Box key={child.id}>
                  <Typography>{child.name}</Typography>
                  {date && <Typography>{date}</Typography>}
                </Box>
              );
            })
          ) : (
            <MutedText>{t("summary.noChildren")}</MutedText>
          )}
        </Section>
      </Masonry>
    </Box>
  );
}

/* ---------------- Section ---------------- */

function Section({
  title,
  children,
  onClick,
  error,
}: {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  error?: boolean;
}) {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      sx={{
        p: 3,
        borderRadius: 4,
        border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
        cursor: "pointer",
        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
        },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>

        {error && <Chip size="small" color="error" label={t("common.incomplete")} />}
      </Stack>

      <Stack spacing={1}>{children}</Stack>
    </Box>
  );
}

/* ---------------- Items ---------------- */

function Item({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
}

function BooleanItem({ label, value }: { label: string; value: boolean }) {
  const t = useTypedTranslations("create");

  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography color="text.secondary">{label}</Typography>
      <Chip
        size="small"
        color={value ? "success" : "default"}
        variant={value ? "filled" : "outlined"}
        label={value ? t("common.enabled") : t("common.disabled")}
      />
    </Stack>
  );
}

function MutedText({ children }: { children: React.ReactNode }) {
  return <Typography color="text.secondary">{children}</Typography>;
}
