"use client";

import { useCreateEvent } from "../context/CreateEventContext";

/**
 * -------------------------------------------------------------
 * Deep setter
 * -------------------------------------------------------------
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function setDeep(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  const last = keys.pop()!;

  let target = obj;
  for (const key of keys) {
    const next = target[key];
    if (!isRecord(next)) {
      target[key] = {};
    }
    target = target[key] as Record<string, unknown>;
  }

  target[last] = value;
}

function hasTargetValue(value: unknown): value is { target: { value: unknown } } {
  return isRecord(value) && isRecord(value.target) && Object.hasOwn(value.target, "value");
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
    if (value.trim() === "") {
      return "";
    }

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
    .reduce<unknown>((acc, key) => (isRecord(acc) ? acc[key] : undefined), draft);

  /**
   * -------------------------------------------------------------
   * Setter
   * -------------------------------------------------------------
   */
  const setValue = (val: unknown) => {
    const next = structuredClone(draft);

    setDeep(next as unknown as Record<string, unknown>, path, val);

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

    onChange: (e: unknown) => {
      const val = hasTargetValue(e) ? e.target.value : e;
      const normalized = normalizeValue(val);
      setValue(normalized);
    },

    onBlur: () => form.validateField(path),
  };
}
