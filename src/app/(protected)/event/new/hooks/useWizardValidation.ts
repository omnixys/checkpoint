"use client";

import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";
import { useCallback } from "react";
import { ZodSchema } from "zod";

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
