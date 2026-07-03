"use client";

import { useCallback, useState } from "react";

export type EventVariant = "A" | "B" | "C" | "D";

/**
 * Extracted variant state from UI component
 */
export function useEventVariant(defaultVariant: EventVariant = "C") {
  const [variant, setVariant] = useState<EventVariant>(defaultVariant);

  const changeVariant = useCallback((v: EventVariant) => {
    setVariant(v);
  }, []);

  return {
    variant,
    changeVariant,
  };
}
