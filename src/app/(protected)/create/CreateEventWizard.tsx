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
import { useMutation } from "@/checkpoint/hooks/core/useMutation";
import { CreateEventDocument, CreateEventMutation, CreateEventMutationVariables } from "@/checkpoint/generated/graphql";
import { mapEvent } from "@/checkpoint/app/(protected)/create/types/event/event-draft.type";
import { useUploadMedia } from "@/checkpoint/hooks/common/useUploadMedia";

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
    goTo,
  } = useCreateEventWizard();

  const { draft } =
    useCreateEvent();
  
    

  /**
   * -------------------------------------------------------------
   * GLOBAL FORM (aus Context!)
   * -------------------------------------------------------------
   */
  const { form } = useCreateEvent();

  const [create] = useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument)

  const handleCreateEvent = useCallback(async (): Promise<void> => {
  const input = mapEvent(draft);

  const result = await create({
    variables: { input },
  });

    const eventId = result.data?.createEvent.id;
    const { upload, loading } = useUploadMedia(eventId ?? '');
    
      const handleUpload = async (
        file: File | undefined,
        setter: (val: string) => void,
      ) => {
        if (!file) return;

        /**
         * Immediate preview (UX)
         */
        const preview = URL.createObjectURL(file);
        setter(preview);

        try {
          /**
           * REAL upload
           */
          const result = await upload(file);

          /**
           * Replace preview with CDN URL
           */
          setter(result.url);
        } catch (err) {
          console.error("Upload failed", err);
        }
      };
}, [draft, create]);

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
        return <AddressStep />;

      case CreateEventWizardStep.SETTINGS:
        return <SettingsStep />;

      case CreateEventWizardStep.VISIBILITY:
        return <VisibilityStep  />;

      case CreateEventWizardStep.EXPERIENCE:
        return <ExperienceStep />;

      case CreateEventWizardStep.CHILDREN:
        return (
          <ChildrenStep />
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
              activeStep={activeStep}
              onNext={nextStep}
              onSubmit={handleCreateEvent}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
