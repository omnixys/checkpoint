import { useState } from "react";
import type { AppError } from "@/checkpoint/errors/app-error";
import { useMutationError } from "@/checkpoint/hooks/error/useMutationError";

/**
 * Local mutation handler
 *
 * Why:
 * - Prevent duplicated mutation handling logic
 * - Provide consistent UX feedback (loading, error, success)
 * - Required for enterprise UX standards
 */
export function useMutationHandler() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appError, setAppError] = useState<AppError | null>(null);
  const handleMutationError = useMutationError();

  const execute = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAppError(null);

    try {
      const result = await fn();
      setSuccess(true);
      return result;
    } catch (err: unknown) {
      const normalized = handleMutationError(err);
      setAppError(normalized);
      setError(normalized.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setAppError(null);
  };

  return {
    execute,
    loading,
    error,
    success,
    appError,
    reset,
  };
}
