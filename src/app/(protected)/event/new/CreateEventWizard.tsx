"use client";

import { useCallback, useState } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import AddressStep from "@/checkpoint/app/(protected)/event/new/components/step/AddressStep";
import BasicsStep from "@/checkpoint/app/(protected)/event/new/components/step/BasicsStep";
import ChildrenStep from "@/checkpoint/app/(protected)/event/new/components/step/ChildrenStep";
import ExperienceStep from "@/checkpoint/app/(protected)/event/new/components/step/ExperienceStep";
import SettingsStep from "@/checkpoint/app/(protected)/event/new/components/step/SettingsStep";
import SuccessStep from "@/checkpoint/app/(protected)/event/new/components/step/SuccessStep";
import SummaryStep from "@/checkpoint/app/(protected)/event/new/components/step/SummaryStep";
import VisibilityStep from "@/checkpoint/app/(protected)/event/new/components/step/VisibilityStep";

import CreateEventActionBar from "@/checkpoint/app/(protected)/event/new/CreateEventActionBar";
import CreateEventHeader from "@/checkpoint/app/(protected)/event/new/CreateEventHeader";

import { useCreateEventWizard } from "@/checkpoint/app/(protected)/event/new/hooks/useCreateEventWizard";
import { scrollToFirstError } from "@/checkpoint/app/(protected)/event/new/hooks/useScrollToError";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";

import { useCreateEvent } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { CreateEventDocument, CreateEventMutation, CreateEventMutationVariables } from "@/checkpoint/generated/graphql";
import { mapEvent } from "@/checkpoint/app/(protected)/event/new/types/event/event-draft.type";
import { useUploadMedia } from "@/checkpoint/hooks/common/useUploadMedia";
import { useMutation } from "@apollo/client/react";

export default function CreateEventWizard() {
  const theme = useTheme();
  const t = useTypedTranslations("create");
  const [eventId, setEventId] = useState<string | undefined>(undefined)

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

  const { upload } = useUploadMedia();
  const [create] = useMutation<CreateEventMutation, CreateEventMutationVariables>(CreateEventDocument)

  
const { uploads, clearUploads, patchSettings } = useCreateEvent();

  const handleCreateEvent2 = useCallback(async () => {
    /**
     * 1. VALIDATE
     */
    const result = form.validate();

    if (!result.valid) {
      scrollToFirstError(form.errors);
      return;
    }

    /**
     * 2. CREATE EVENT
     */
    const input = mapEvent(draft);

    const res = await create({
      variables: { input },
    });

    const newEventId = res.data?.createEvent.id;
    setEventId(newEventId)

    if (!newEventId) {
      throw new Error("Event creation failed");
    }

    /**
     * 3. UPLOAD FILES
     */
    for (const item of uploads) {
      await upload(newEventId, item.file, item.type);
    }

    /**
     * 4. CLEANUP
     */
    clearUploads();

    nextStep();
  }, [draft, uploads, create, upload, form, clearUploads]);

const handleCreateEvent = useCallback(async () => {
  const result = form.validate();

  if (!result.valid) {
    scrollToFirstError(form.errors);
    return;
  }

  /**
   * 1. CREATE EVENT
   */
  const res = await create({
    variables: { input: mapEvent(draft) },
  });

  const eventId = res.data?.createEvent.id;

  if (!eventId) {
    throw new Error("Event creation failed");
  }

  /**
   * 2. UPLOAD FILES
   */
  const uploaded: Record<string, string> = {};

  for (const item of uploads) {
    const result = await upload(eventId, item.file, item.type);
    uploaded[item.type] = result.url;
  }

  clearUploads();
  nextStep();
}, [draft, uploads, upload, create, form]);
  
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
