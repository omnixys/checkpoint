"use client";

import {
  ChildEventDraft,
  CreateEventDraft,
} from "@/checkpoint/app/(protected)/event/new/types/event/event-draft.type";
import React, { createContext, useContext, useReducer } from "react";
import { useZodForm } from "../hooks/useZodForm";
import { createEventWizardSchema } from "../validation/createEvent.schema";
import { MediaType } from "@/checkpoint/generated/graphql";

/**
 * -------------------------------------------------------------
 * Upload File Type
 * -------------------------------------------------------------
 */
export type PendingUpload = {
  id: string;
  file: File;
  type: "cover" | "logo";
};

type UploadItem = {
  file: File;
  type: MediaType;
};

/**
 * -------------------------------------------------------------
 * State
 * -------------------------------------------------------------
 */
type State = {
  draft: CreateEventDraft;
  uploads: UploadItem[];
  uploads2: PendingUpload[];
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
  | { type: "UPDATE_CHILD"; index: number; patch: Partial<ChildEventDraft> }
  | { type: "ADD_UPLOAD_2"; upload2: PendingUpload }
  | { type: "CLEAR_UPLOADS_2" }
  | { type: "ADD_UPLOAD"; item: UploadItem }
  | { type: "CLEAR_UPLOADS" };

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
      publicRsvpWebsite: "",
      dressCode: "",
      description: "sdf",
      // descriptionLong: '',
      startsAt: null,
      endsAt: null,
      category: "GENERAL",

      logoUrl: "",
      coverImageUrl: "",
    },
    children: [],
  },
  uploads: [],
  uploads2: [],
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
        draft: {
          ...state.draft,
          ...action.patch,
        },
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
              category: "GENERAL",
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

    case "ADD_UPLOAD_2":
      return {
        ...state,
        uploads2: [...state.uploads2, action.upload2],
      };

    case "CLEAR_UPLOADS_2":
      return {
        ...state,
        uploads2: [],
      };

    case "ADD_UPLOAD":
      return {
        ...state,
        uploads: [...state.uploads, action.item],
      };

    case "CLEAR_UPLOADS":
      return {
        ...state,
        uploads: [],
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
  uploads: UploadItem[];
  uploads2: PendingUpload[];

  form: ReturnType<typeof useZodForm>;

  patch: (p: Partial<CreateEventDraft>) => void;
  patchSettings: (p: Partial<CreateEventDraft["settings"]>) => void;

  addChild: () => void;
  removeChild: (i: number) => void;
  updateChild: (i: number, p: Partial<ChildEventDraft>) => void;

  addUpload: (file: File, type: UploadItem["type"]) => void;
  addUpload2: (file: File, type: "cover" | "logo") => void;
  clearUploads: () => void;
  clearUploads2: () => void;
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
export function CreateEventProvider({ children }: { children: React.ReactNode }) {
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
    uploads2: state.uploads2,

    form,

    patch: (p) => dispatch({ type: "PATCH", patch: p }),

    patchSettings: (p) => dispatch({ type: "PATCH_SETTINGS", patch: p }),

    addChild: () => dispatch({ type: "ADD_CHILD" }),

    removeChild: (i) => dispatch({ type: "REMOVE_CHILD", index: i }),

    updateChild: (i, p) => dispatch({ type: "UPDATE_CHILD", index: i, patch: p }),

    addUpload2: (file, type) =>
      dispatch({
        type: "ADD_UPLOAD_2",
        upload2: {
          id: crypto.randomUUID(),
          file,
          type,
        },
      }),
    clearUploads2: () => dispatch({ type: "CLEAR_UPLOADS_2" }),

    uploads: state.uploads,
    addUpload: (file, type) => dispatch({ type: "ADD_UPLOAD", item: { file, type } }),
    clearUploads: () => dispatch({ type: "CLEAR_UPLOADS" }),
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
