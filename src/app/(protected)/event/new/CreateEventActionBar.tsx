import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { Button, Stack, useTheme } from "@mui/material";

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
      direction="row"
      sx={{
        justifyContent: "space-between",
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
        }}
      >
        {isLastStep ? t("actions.create") : t("actions.next")}
      </Button>
    </Stack>
  );
}
