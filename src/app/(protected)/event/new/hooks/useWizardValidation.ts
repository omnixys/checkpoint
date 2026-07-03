"use client";

import { useCallback } from "react";
import type { ZodSchema } from "zod";
import type { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";

type StepMap = Record<CreateEventWizardStep, ZodSchema<unknown>>;

export function useWizardValidation(
  _stepSchemas: StepMap,
  validate: () => { valid: boolean; errors?: Record<string, string> },
) {
  const validateStep = useCallback((_step: CreateEventWizardStep) => validate(), [validate]);

  return {
    validateStep,
  };
}
