"use client";

import {
  ChildEventDraft,
  CreateEventDraft,
} from "@/checkpoint/app/(protected)/create/types/event/event-draft.type";
import { CreateEventWizardStep } from "@/checkpoint/app/(protected)/create/types/event/event-wizard.type";
import { useCallback, useMemo, useReducer, useState } from "react";

/**
 * -------------------------------------------------------------
 * Public API
 * -------------------------------------------------------------
 */
export type UseCreateEventWizardProps = {
  activeStep: CreateEventWizardStep;
  draft: CreateEventDraft;

  nextStep: () => void;
  previousStep: () => void;
  goTo: (step: CreateEventWizardStep) => void;

  progress: number;

  updateDraft: (patch: Partial<CreateEventDraft>) => void;
  updateSettings: (patch: Partial<CreateEventDraft["settings"]>) => void;

  addChild: () => void;
  removeChild: (index: number) => void;
  updateChild: (
    index: number,
    updater: (child: ChildEventDraft) => ChildEventDraft,
  ) => void;
};

/**
 * -------------------------------------------------------------
 * Factory
 * -------------------------------------------------------------
 */
const createInitialSettings = (): CreateEventDraft["settings"] => ({
  allowReEntry: true,
  rotateSeconds: 300,
  maxSeats: 50,
  allowPublicRsvp: true,
  allowPublicPlusOne: true,
  allowPublicRsvpWebsite: false,
  publicRsvpWebsite: "",
  isActive: true,
  isPublic: false,
  coverImageUrl: "",
  logoUrl: "",
  dressCode: "",
  description: "",
  descriptionLong: "",
  startsAt: "",
  endsAt: "",
  category: "",
});

const createInitialEventDraft = (): CreateEventDraft => ({
  name: "",
  children: [],
  settings: createInitialSettings(),
});

/**
 * 👉 WICHTIG: ChildEventDraft ist FLAT (kein settings, kein children)
 */
export const createEmptyChildEvent = (): ChildEventDraft => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  startsAt: "",
  endsAt: "",
  maxSeats: 0,
  parentId: '',
  category: ''
});

/**
 * -------------------------------------------------------------
 * Reducer
 * -------------------------------------------------------------
 */
type Action =
  | { type: "UPDATE_DRAFT"; patch: Partial<CreateEventDraft> }
  | { type: "UPDATE_SETTINGS"; patch: Partial<CreateEventDraft["settings"]> }
  | { type: "ADD_CHILD" }
  | { type: "REMOVE_CHILD"; index: number }
  | {
      type: "UPDATE_CHILD";
      index: number;
      updater: (child: ChildEventDraft) => ChildEventDraft;
    };

function reducer(state: CreateEventDraft, action: Action): CreateEventDraft {
  switch (action.type) {
    case "UPDATE_DRAFT": {
      return {
        ...state,
        ...action.patch,
        settings: action.patch.settings
          ? {
              ...state.settings,
              ...action.patch.settings,
            }
          : state.settings,
        children:
          action.patch.children !== undefined
            ? action.patch.children
            : (state.children ?? []),
      };
    }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.patch,
        },
      };

    case "ADD_CHILD": {
      const current = state.children ?? [];
      return {
        ...state,
        children: [...current, createEmptyChildEvent()],
      };
    }

    case "REMOVE_CHILD": {
      const current = state.children ?? [];
      return {
        ...state,
        children: current.filter((_, i) => i !== action.index),
      };
    }

    case "UPDATE_CHILD": {
      const current = state.children ?? [];

      return {
        ...state,
        children: current.map((child, i) =>
          i === action.index
            ? action.updater({ ...child }) // ✅ defensive copy
            : child,
        ),
      };
    }

    default:
      return state;
  }
}

/**
 * -------------------------------------------------------------
 * Hook
 * -------------------------------------------------------------
 */
export function useCreateEventWizard(): UseCreateEventWizardProps {
  const [activeStep, setActiveStep] = useState(CreateEventWizardStep.SUMMARY);

  const [draft, dispatch] = useReducer(
    reducer,
    undefined,
    createInitialEventDraft,
  );

  /**
   * Navigation
   */
  const nextStep = useCallback(() => {
    setActiveStep((prev) =>
      prev < CreateEventWizardStep.SUCCESS
        ? ((prev + 1) as CreateEventWizardStep)
        : prev,
    );
  }, []);

  const previousStep = useCallback(() => {
    setActiveStep((prev) =>
      prev > CreateEventWizardStep.BASICS
        ? ((prev - 1) as CreateEventWizardStep)
        : prev,
    );
  }, []);

    const goTo = useCallback((target: CreateEventWizardStep) => {
      setActiveStep(target);
    }, []);

  /**
   * Progress
   */
  const progress = useMemo(() => {
    const TOTAL = CreateEventWizardStep.SUMMARY + 1;
    const CURRENT = Math.min(activeStep + 1, TOTAL);
    return Math.round((CURRENT / TOTAL) * 100);
  }, [activeStep]);

  /**
   * API
   */
  const updateDraft = useCallback((patch: Partial<CreateEventDraft>) => {
    dispatch({ type: "UPDATE_DRAFT", patch });
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<CreateEventDraft["settings"]>) => {
      dispatch({ type: "UPDATE_SETTINGS", patch });
    },
    [],
  );

  const addChild = useCallback(() => {
    dispatch({ type: "ADD_CHILD" });
  }, []);

  const removeChild = useCallback((index: number) => {
    dispatch({ type: "REMOVE_CHILD", index });
  }, []);

  const updateChild = useCallback(
    (index: number, updater: (child: ChildEventDraft) => ChildEventDraft) => {
      dispatch({ type: "UPDATE_CHILD", index, updater });
    },
    [],
  );

  return {
    activeStep,
    draft,
    nextStep,
    previousStep,
    goTo,
    progress,
    updateDraft,
    updateSettings,
    addChild,
    removeChild,
    updateChild,
  };
}
