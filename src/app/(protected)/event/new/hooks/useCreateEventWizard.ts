"use client";

import { useCallback, useMemo, useState } from "react";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/event/new/types/event/event-wizard.type";

/**
 * -------------------------------------------------------------
 * Public API
 * -------------------------------------------------------------
 */
export interface UseCreateEventWizardProps {
  activeStep: CreateEventWizardStep;

  nextStep: () => void;
  previousStep: () => void;
  goTo: (step: CreateEventWizardStep) => void;

  progress: number;
}

/**
 * -------------------------------------------------------------
 * Hook
 * -------------------------------------------------------------
 */
export function useCreateEventWizard(): UseCreateEventWizardProps {
  const [activeStep, setActiveStep] = useState(CreateEventWizardStep.BASICS);

  /**
   * Navigation
   */
  const nextStep = useCallback(() => {
    setActiveStep((prev) =>
      prev < CreateEventWizardStep.SUCCESS ? ((prev + 1) as CreateEventWizardStep) : prev,
    );
  }, []);

  const previousStep = useCallback(() => {
    setActiveStep((prev) =>
      prev > CreateEventWizardStep.BASICS ? ((prev - 1) as CreateEventWizardStep) : prev,
    );
  }, []);

  const goTo = useCallback((target: CreateEventWizardStep) => {
    setActiveStep(target);
  }, []);

  /**
   * Progress
   */
  const progress = useMemo(() => {
    const Total = CreateEventWizardStep.SUMMARY + 1;
    const Current = Math.min(activeStep + 1, Total);
    return Math.round((Current / Total) * 100);
  }, [activeStep]);

  return {
    activeStep,
    nextStep,
    previousStep,
    goTo,
    progress,
  };
}
