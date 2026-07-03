import { Button, Stack, useTheme } from "@mui/material";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface CreateEventActionBarProps {
  previousStep: () => void;
  onNext: () => void | Promise<void>;
  onSubmit?: () => Promise<void>;

  activeStep: number;

  disableNext?: boolean;
  isSubmitting?: boolean;
}

export default function CreateEventActionBar({
  previousStep,
  activeStep,
  onNext,
  onSubmit,
  disableNext = false,
  isSubmitting = false,
}: CreateEventActionBarProps) {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  const isLastStep = activeStep === CreateEventWizardStep.SUMMARY;

  return (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={{ xs: 1.5, sm: 0 }}
      sx={{
        justifyContent: "space-between",
        alignItems: "stretch",
        mt: 4,
        pt: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* BACK */}
      <Button
        onClick={previousStep}
        disabled={activeStep === 0 || isSubmitting}
        sx={{
          textTransform: "none",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {t("actions.back")}
      </Button>

      {/* NEXT / SUBMIT */}
      <Button
        variant="contained"
        onClick={isLastStep ? onSubmit : onNext} // 💎 sauber getrennt
        disabled={disableNext || isSubmitting}
        sx={{
          textTransform: "none",
          borderRadius: 3,
          px: 3,
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {isLastStep ? t("actions.create") : t("actions.next")}
      </Button>
    </Stack>
  );
}
