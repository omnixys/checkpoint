"use client";

import { useCallback } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import AddressStep from "@/checkpoint/app/(protected)/create/components/step/AddressStep";
import BasicsStep from "@/checkpoint/app/(protected)/create/components/step/BasicsStep";
import ChildrenStep from "@/checkpoint/app/(protected)/create/components/step/ChildrenStep";
import ExperienceStep from "@/checkpoint/app/(protected)/create/components/step/ExperienceStep";
import SettingsStep from "@/checkpoint/app/(protected)/create/components/step/SettingsStep";
import SuccessStep from "@/checkpoint/app/(protected)/create/components/step/SuccessStep";
import SummaryStep from "@/checkpoint/app/(protected)/create/components/step/SummaryStep";
import VisibilityStep from "@/checkpoint/app/(protected)/create/components/step/VisibilityStep";

import CreateEventActionBar from "@/checkpoint/app/(protected)/create/CreateEventActionBar";
import CreateEventHeader from "@/checkpoint/app/(protected)/create/CreateEventHeader";

import { useCreateEventWizard } from "@/checkpoint/app/(protected)/create/hooks/useCreateEventWizard";
import { scrollToFirstError } from "@/checkpoint/app/(protected)/create/hooks/useScrollToError";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/create/types/event/event-wizard.type";

import { useCreateEvent } from "@/checkpoint/app/(protected)/create/context/CreateEventContext";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function CreateEventWizard() {
  const theme = useTheme();
  const t = useTypedTranslations("create");

  /**
   * -------------------------------------------------------------
   * Wizard State
   * -------------------------------------------------------------
   */
  const {
    activeStep,
    nextStep,
    previousStep,
    progress,
    draft,
    updateDraft,
    addChild,
    removeChild,
    updateChild,
    goTo,
  } = useCreateEventWizard();

  /**
   * -------------------------------------------------------------
   * GLOBAL FORM (aus Context!)
   * -------------------------------------------------------------
   */
  const { form } = useCreateEvent();

  /**
   * -------------------------------------------------------------
   * Navigation Logic
   * -------------------------------------------------------------
   */
  const handleNext = useCallback(() => {
    const result = form.validate();

    if (!result.valid) {
      scrollToFirstError(form.errors);
      return;
    }

    nextStep();
  }, [form, nextStep]);

  /**
   * -------------------------------------------------------------
   * Step Renderer
   * -------------------------------------------------------------
   */
  const renderStep = () => {
    switch (activeStep) {
      case CreateEventWizardStep.BASICS:
        return <BasicsStep />;

      case CreateEventWizardStep.ADDRESS:
        return <AddressStep draft={draft} onChange={updateDraft} />;

      case CreateEventWizardStep.SETTINGS:
        return <SettingsStep draft={draft} onChange={updateDraft} />;

      case CreateEventWizardStep.VISIBILITY:
        return <VisibilityStep draft={draft} onChange={updateDraft} />;

      case CreateEventWizardStep.EXPERIENCE:
        return <ExperienceStep draft={draft} onChange={updateDraft} />;

      case CreateEventWizardStep.CHILDREN:
        return (
          <ChildrenStep
            draft={draft}
            addChild={addChild}
            removeChild={removeChild}
            updateChild={updateChild}
          />
        );

      case CreateEventWizardStep.SUMMARY:
        return <SummaryStep draft={draft} onEdit={goTo} />;

      case CreateEventWizardStep.SUCCESS:
        return <SuccessStep />;

      default:
        return null;
    }
  };

  const isSuccess = activeStep === CreateEventWizardStep.SUCCESS;

  /**
   * -------------------------------------------------------------
   * Render
   * -------------------------------------------------------------
   */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 0,
        background: theme.palette.background.default,
      }}
    >
      <Stack
        spacing={4}
        sx={{
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            mx: "auto",
            py: 4,
          }}
        >
          {/* HEADER */}
          {!isSuccess && (
            <CreateEventHeader activeStep={activeStep} progress={progress} />
          )}

          {/* STEP CONTENT */}
          <AnimatePresence mode="wait">
            <Box
              key={activeStep}
              component={motion.div}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              sx={{
                pt: 10,
              }}
            >
              {renderStep()}
            </Box>
          </AnimatePresence>

          {/* ACTION BAR */}
          {!isSuccess && (
            <CreateEventActionBar
              previousStep={previousStep}
              nextStep={handleNext}
              activeStep={activeStep}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
