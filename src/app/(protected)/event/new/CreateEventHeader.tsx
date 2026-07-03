import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import {
  alpha,
  Box,
  LinearProgress,
  MobileStepper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

interface CreateEventHeaderProps {
  activeStep: number;
  progress: number;
}

export default function CreateEventHeader({ activeStep, progress }: CreateEventHeaderProps) {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  const stepTitles = [
    t("steps.basics"),
    t("steps.address"),
    t("steps.settings"),
    t("steps.visibility"),
    t("steps.experience"),
    t("steps.children"),
    t("steps.summary"),
  ];
  const currentStepTitle =
    activeStep >= 0 && activeStep <= CreateEventWizardStep.SUMMARY
      ? stepTitles[activeStep]
      : t("success.title");

  return (
    <Stack spacing={1}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Stack>
          <Typography
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 700,
              letterSpacing: 0,
              color: theme.palette.text.primary,
              overflowWrap: "anywhere",
            }}
          >
            {t("meta.title")}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: theme.palette.text.secondary,
            }}
          >
            {t("meta.subtitle")}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: 999,
            background: alpha(theme.palette.primary.main, 0.08),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
            alignItems: "center",
            maxWidth: "100%",
          }}
        >
          <ChecklistRoundedIcon color="primary" />
          <Typography
            sx={{
              fontWeight: 700,
              overflowWrap: "anywhere",
            }}
          >
            {currentStepTitle}
          </Typography>
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
        }}
      />

      <MobileStepper
        variant="text"
        steps={stepTitles.length}
        position="static"
        activeStep={activeStep}
        nextButton={<Box />}
        backButton={<Box />}
        sx={{
          px: 0,
          background: "transparent",
        }}
      />
    </Stack>
  );
}
