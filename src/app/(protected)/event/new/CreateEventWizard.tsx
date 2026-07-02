"use client";

import { useMutation } from "@apollo/client/react";
import { Box, Stack, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import CreateEventActionBar from "@/checkpoint/app/(protected)/event/new/CreateEventActionBar";
import CreateEventHeader from "@/checkpoint/app/(protected)/event/new/CreateEventHeader";
import AddressStep from "@/checkpoint/app/(protected)/event/new/components/step/AddressStep";
import BasicsStep from "@/checkpoint/app/(protected)/event/new/components/step/BasicsStep";
import ChildrenStep from "@/checkpoint/app/(protected)/event/new/components/step/ChildrenStep";
import ExperienceStep from "@/checkpoint/app/(protected)/event/new/components/step/ExperienceStep";
import SettingsStep from "@/checkpoint/app/(protected)/event/new/components/step/SettingsStep";
import SuccessStep from "@/checkpoint/app/(protected)/event/new/components/step/SuccessStep";
import SummaryStep from "@/checkpoint/app/(protected)/event/new/components/step/SummaryStep";
import VisibilityStep from "@/checkpoint/app/(protected)/event/new/components/step/VisibilityStep";
import { useCreateEvent } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import { useCreateEventWizard } from "@/checkpoint/app/(protected)/event/new/hooks/useCreateEventWizard";
import { scrollToFirstError } from "@/checkpoint/app/(protected)/event/new/hooks/useScrollToError";
import { mapEvent } from "@/checkpoint/app/(protected)/event/new/types/event/event-draft.type";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { AppError, ErrorCode } from "@/checkpoint/errors/app-error";
import {
  CreateEventDocument,
  type CreateEventMutation,
  type CreateEventMutationVariables,
} from "@/checkpoint/generated/graphql";
import { useUploadMedia } from "@/checkpoint/hooks/common/useUploadMedia";
import { useMutationError } from "@/checkpoint/hooks/error";

export default function CreateEventWizard() {
  const theme = useTheme();
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  /**
   * -------------------------------------------------------------
   * Wizard State
   * -------------------------------------------------------------
   */
  const { activeStep, nextStep, previousStep, progress, goTo } = useCreateEventWizard();

  const { draft } = useCreateEvent();

  /**
   * -------------------------------------------------------------
   * GLOBAL FORM (aus Context!)
   * -------------------------------------------------------------
   */
  const { form } = useCreateEvent();

  const { upload } = useUploadMedia();
  const [create] = useMutation<CreateEventMutation, CreateEventMutationVariables>(
    CreateEventDocument,
  );

  const { uploads, clearUploads } = useCreateEvent();
  const handleMutationError = useMutationError({ operationName: "CreateEvent" });

  const handleCreateEvent = useCallback(async () => {
    const result = form.validate();

    if (!result.valid) {
      scrollToFirstError(form.errors);
      return;
    }

    /**
     * 1. CREATE EVENT
     */
    try {
      const res = await create({
        variables: { input: mapEvent(draft) },
      });

      const createdEventId = res.data?.createEvent.id;

      if (!createdEventId) {
        throw new AppError({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: "Event creation response was incomplete",
          operationName: "CreateEvent",
        });
      }

      setEventId(createdEventId);
      for (const item of uploads) {
        await upload(createdEventId, item.file, item.type);
      }

      clearUploads();
      nextStep();
    } catch (error) {
      handleMutationError(error);
    }
  }, [clearUploads, create, draft, form, handleMutationError, nextStep, upload, uploads]);

  const handleNext = useCallback(() => {
    const result = form.validate();

    if (!result.valid) {
      scrollToFirstError(form.errors);
      return;
    }

    nextStep();
  }, [form, nextStep]);

  const renderStep = () => {
    switch (activeStep) {
      case CreateEventWizardStep.BASICS:
        return <BasicsStep />;

      case CreateEventWizardStep.ADDRESS:
        return <AddressStep />;

      case CreateEventWizardStep.SETTINGS:
        return <SettingsStep />;

      case CreateEventWizardStep.VISIBILITY:
        return <VisibilityStep />;

      case CreateEventWizardStep.EXPERIENCE:
        return <ExperienceStep />;

      case CreateEventWizardStep.CHILDREN:
        return <ChildrenStep />;

      case CreateEventWizardStep.SUMMARY:
        return <SummaryStep draft={draft} onEdit={goTo} />;

      case CreateEventWizardStep.SUCCESS:
        return <SuccessStep eventId={eventId} />;

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
        minHeight: "100dvh",
        px: { xs: 1.5, sm: 2 },
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
            py: { xs: 2, sm: 4 },
          }}
        >
          {/* HEADER */}
          {!isSuccess && <CreateEventHeader activeStep={activeStep} progress={progress} />}

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
                pt: { xs: 6, sm: 10 },
                minWidth: 0,
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
              onNext={handleNext}
              onSubmit={handleCreateEvent}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
