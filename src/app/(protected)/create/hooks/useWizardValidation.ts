"use client";

import { useCallback } from "react";
import { ZodSchema } from "zod";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/create/types/event/event-wizard.type";

type StepMap = Record<CreateEventWizardStep, ZodSchema<any>>;

export function useWizardValidation(
  stepSchemas: StepMap,
  validate: () => { valid: boolean; errors?: Record<string, string> },
) {
  const validateStep = useCallback(
    (step: CreateEventWizardStep) => {
      return validate();
    },
    [validate],
  );

  return {
    validateStep,
  };
}
