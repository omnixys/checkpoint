import { useEffect, useState } from "react";

/**
 * Tracks import progress from backend (polling fallback)
 *
 * WHY:
 * - Works without subscriptions initially
 * - Can be upgraded to GraphQL subscription later
 */
export function useImportProgress(uploadId: string | null) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!uploadId) {
      return;
    }

    let active = true;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/import-progress?uploadId=${uploadId}`);
        const json = await res.json();

        if (!active) {
          return;
        }

        setProgress(json.progress);

        if (json.progress >= 100) {
          clearInterval(interval);
        }
      } catch {
        // silent fail → do not break UX
      }
    }, 800);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [uploadId]);

  return progress;
}
