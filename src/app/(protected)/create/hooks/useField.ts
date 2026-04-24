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
 * Hook
 * -------------------------------------------------------------
 */
export function useField(path: string) {
  const { draft, form, patch } = useCreateEvent(); // ✅ FIX

  /**
   * -------------------------------------------------------------
   * Value Resolver
   * -------------------------------------------------------------
   */
  const value = path.split(".").reduce((acc: any, key) => acc?.[key], draft);

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
      setValue(val);
    },

    onBlur: () => form.validateField(path),
  };
}
