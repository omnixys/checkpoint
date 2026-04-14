import { useState } from "react";

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

  const execute = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await fn();
      setSuccess(true);
      return result;
    } catch (err: any) {
      setError(err?.message ?? "Unexpected error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    execute,
    loading,
    error,
    success,
    reset,
  };
}
