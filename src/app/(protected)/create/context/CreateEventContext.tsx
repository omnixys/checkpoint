"use client";

import React, { createContext, useContext, useReducer } from "react";
import { useZodForm } from "../hooks/useZodForm";
import { createEventWizardSchema } from "../validation/createEvent.schema";
import {
  ChildEventDraft,
  CreateEventDraft,
} from "@/checkpoint/app/(protected)/create/types/event/event-draft.type";

/**
 * -------------------------------------------------------------
 * State
 * -------------------------------------------------------------
 */
type State = {
  draft: CreateEventDraft;
};

/**
 * -------------------------------------------------------------
 * Actions
 * -------------------------------------------------------------
 */
type Action =
  | { type: "PATCH"; patch: Partial<CreateEventDraft> }
  | { type: "PATCH_SETTINGS"; patch: Partial<CreateEventDraft["settings"]> }
  | { type: "ADD_CHILD" }
  | { type: "REMOVE_CHILD"; index: number }
  | { type: "UPDATE_CHILD"; index: number; patch: Partial<ChildEventDraft> };

/**
 * -------------------------------------------------------------
 * Initial State
 * -------------------------------------------------------------
 */
const initialState: State = {
  draft: {
    name: "",
    settings: {
      allowReEntry: true,
      rotateSeconds: 300,
      maxSeats: 50,
      allowPublicRsvp: true,
      allowPublicPlusOne: true,
      allowPublicRsvpWebsite: false,
      isActive: true,
      isPublic: false,
  publicRsvpWebsite: '',
  coverImageUrl: '',
  logoUrl: '',
      dressCode: '',
      description: '',
  // descriptionLong: '',
  startsAt: null,
  endsAt: null,
  category: 'GENERAL'
    },
    children: [],
  },
};

/**
 * -------------------------------------------------------------
 * Reducer
 * -------------------------------------------------------------
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PATCH":
      return {
        ...state,
        draft: action.patch as CreateEventDraft, // 💎 FULL REPLACE
      };

    case "PATCH_SETTINGS":
      return {
        ...state,
        draft: {
          ...state.draft,
          settings: {
            ...state.draft.settings,
            ...action.patch,
          },
        },
      };

    case "ADD_CHILD":
      return {
        ...state,
        draft: {
          ...state.draft,
          children: [
            ...state.draft.children,
            {
              id: crypto.randomUUID(),
              name: "",
              category: 'GENERAL',
            },
          ],
        },
      };

    case "REMOVE_CHILD":
      return {
        ...state,
        draft: {
          ...state.draft,
          children: state.draft.children.filter((_, i) => i !== action.index),
        },
      };

    case "UPDATE_CHILD":
      return {
        ...state,
        draft: {
          ...state.draft,
          children: state.draft.children.map((c, i) =>
            i === action.index ? { ...c, ...action.patch } : c,
          ),
        },
      };

    default:
      return state;
  }
}

/**
 * -------------------------------------------------------------
 * Context Type
 * -------------------------------------------------------------
 */
type CreateEventContextType = {
  draft: CreateEventDraft;

  form: ReturnType<typeof useZodForm>;

  patch: (p: Partial<CreateEventDraft>) => void;
  patchSettings: (p: Partial<CreateEventDraft["settings"]>) => void;

  addChild: () => void;
  removeChild: (i: number) => void;
  updateChild: (i: number, p: Partial<ChildEventDraft>) => void;
};

/**
 * -------------------------------------------------------------
 * Context
 * -------------------------------------------------------------
 */
const Context = createContext<CreateEventContextType | null>(null);

/**
 * -------------------------------------------------------------
 * Provider
 * -------------------------------------------------------------
 */
export function CreateEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * ✅ FORM (NO MEMO!)
   */
  const form = useZodForm({
    schema: createEventWizardSchema,
    getValues: () => state.draft,
  });

  /**
   * 🚨 KEIN useMemo → verhindert stale form refs
   */
  const value: CreateEventContextType = {
    draft: state.draft,

    form,

    patch: (p) => dispatch({ type: "PATCH", patch: p }),

    patchSettings: (p) => dispatch({ type: "PATCH_SETTINGS", patch: p }),

    addChild: () => dispatch({ type: "ADD_CHILD" }),

    removeChild: (i) => dispatch({ type: "REMOVE_CHILD", index: i }),

    updateChild: (i, p) =>
      dispatch({ type: "UPDATE_CHILD", index: i, patch: p }),
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

/**
 * -------------------------------------------------------------
 * Hook
 * -------------------------------------------------------------
 */
export function useCreateEvent() {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("useCreateEvent must be used inside CreateEventProvider");
  }

  return ctx;
}
