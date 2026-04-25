"use client";

import { useCreateEvent } from "../context/CreateEventContext";

/**
 * -------------------------------------------------------------
 * Deep setter
 * -------------------------------------------------------------
 */
function setDeep(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const last = keys.pop()!;

  const target = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);

  target[last] = value;
}

/**
 * -------------------------------------------------------------
 * Type inference helper
 * -------------------------------------------------------------
 */
function normalizeValue(value: unknown): unknown {
  /**
   * WHY:
   * - TextField returns string ALWAYS
   * - We must convert numeric strings → number
   * - Keep booleans untouched
   */

  if (typeof value === "string") {
    // empty stays empty (important for UX)
    if (value.trim() === "") return "";

    // detect numeric string
    const parsed = Number(value);

    if (!Number.isNaN(parsed)) {
      return parsed;
    }

    return value;
  }

  return value;
}

/**
 * -------------------------------------------------------------
 * Hook
 * -------------------------------------------------------------
 */
export function useField(path: string) {
  const { draft, form, patch } = useCreateEvent(); 

  /**
   * -------------------------------------------------------------
   * Value Resolver
   * -------------------------------------------------------------
   */
  const value = path
    .split(".")
    .reduce((acc: any, key) => acc?.[key], draft);

  /**
   * -------------------------------------------------------------
   * Setter
   * -------------------------------------------------------------
   */
  const setValue = (val: any) => {
    const next = structuredClone(draft);
    
    setDeep(next, path, val);

    patch(next); // ✅ FULL PATCH
  };

  /**
   * -------------------------------------------------------------
   * Zod Binding
   * -------------------------------------------------------------
   */
  const field = form.getFieldProps(path);

  /**
   * -------------------------------------------------------------
   * Return (MUI ready)
   * -------------------------------------------------------------
   */
  return {
    value: value ?? "",

    error: field.error,
    helperText: field.helperText,

    onChange: (e: any) => {
      const val = e?.target ? e.target.value : e;
     const normalized = normalizeValue(val);
    setValue(normalized);
    },

    onBlur: () => form.validateField(path),
  };
}
