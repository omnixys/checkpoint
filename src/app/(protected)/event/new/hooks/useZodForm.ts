"use client";

import { useCallback, useMemo, useState } from "react";
import { infer as zInfer, ZodTypeAny } from "zod";

/**
 * -------------------------------------------------------------
 * Types
 * -------------------------------------------------------------
 */

export type ValidationErrors = Record<string, string>;

export type ValidationResult<T> =
  | {
      valid: true;
      data: T;
      errors: ValidationErrors;
    }
  | {
      valid: false;
      data: null;
      errors: ValidationErrors;
    };

export type UseZodFormOptions<TSchema extends ZodTypeAny> = {
  schema: TSchema;
  getValues: () => unknown;
};

export type FieldProps = {
  error: boolean;
  helperText: string;
  slotProps: {
    htmlInput: {
      "data-field": string;
    };
  };
};

export type UseZodFormReturn<TSchema extends ZodTypeAny> = {
  errors: ValidationErrors;
  hasErrors: boolean;

  validate: () => ValidationResult<zInfer<TSchema>>;

  validateField: (path: string) => string | null;
  clearFieldError: (path: string) => void;
  clearErrors: () => void;
  getFieldProps: (path: string) => FieldProps;
};

/**
 * -------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------
 */

function normalizePath(path: (string | number | symbol)[]): string {
  return path.map(String).join(".");
}

function mapZodErrors(error: unknown): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray((error as any).issues)
  ) {
    for (const issue of (error as any).issues) {
      const key = normalizePath(issue.path ?? []);

      if (key) {
        errors[key] = issue.message;
      } else {
        errors.__root = issue.message;
      }
    }
  }

  return errors;
}

/**
 * -------------------------------------------------------------
 * Hook
 * -------------------------------------------------------------
 */

export function useZodForm<TSchema extends ZodTypeAny>({
  schema,
  getValues,
}: UseZodFormOptions<TSchema>): UseZodFormReturn<TSchema> {
  /**
   * 🚨 HARD GUARD (dein aktueller Crash Fix)
   */
  if (!schema || typeof schema.safeParse !== "function") {
    throw new Error(
      "useZodForm: invalid schema (undefined or not a Zod schema). Check import or circular dependency.",
    );
  }

  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * -------------------------------------------------------------
   * Validate whole form
   * -------------------------------------------------------------
   */
  const validate = useCallback((): ValidationResult<zInfer<TSchema>> => {
    const values = getValues();
    const result = schema.safeParse(values);

    if (result.success) {
      setErrors({});
      return {
        valid: true,
        data: result.data,
        errors: {},
      };
    }

    const mapped = mapZodErrors(result.error);
    setErrors(mapped);

    return {
      valid: false,
      data: null,
      errors: mapped,
    };
  }, [schema, getValues]);

  /**
   * -------------------------------------------------------------
   * Validate single field
   * -------------------------------------------------------------
   */
  const validateField = useCallback(
    (path: string): string | null => {
      const values = getValues();
      const result = schema.safeParse(values);

      if (result.success) {
        setErrors((current) => {
          const next = { ...current };
          delete next[path];
          return next;
        });

        return null;
      }

      const mapped = mapZodErrors(result.error);
      const message = mapped[path] ?? null;

      setErrors((current) => {
        const next = { ...current };

        if (message) {
          next[path] = message;
        } else {
          delete next[path];
        }

        return next;
      });

      return message;
    },
    [schema, getValues],
  );

  /**
   * -------------------------------------------------------------
   * Clear helpers
   * -------------------------------------------------------------
   */
  const clearFieldError = useCallback((path: string): void => {
    setErrors((current) => {
      const next = { ...current };
      delete next[path];
      return next;
    });
  }, []);

  const clearErrors = useCallback((): void => {
    setErrors({});
  }, []);

  /**
   * -------------------------------------------------------------
   * Field binding (MUI ready)
   * -------------------------------------------------------------
   */
  const getFieldProps = useCallback(
    (path: string): FieldProps => ({
      error: Boolean(errors[path]),
      helperText: errors[path] ?? "",
      slotProps: {
        htmlInput: {
          "data-field": path,
        },
      },
    }),
    [errors],
  );

  /**
   * -------------------------------------------------------------
   * Derived state
   * -------------------------------------------------------------
   */
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  return {
    errors,
    hasErrors,
    validate,
    validateField,
    clearFieldError,
    clearErrors,
    getFieldProps,
  };
}
