"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { env } from "@/checkpoint/lib/env";
import { BackButtonBase } from "./back-button-base";

export interface BackToEventDetailButtonProps {
  label?: string;
}

/**
 * Domain wrapper for event detail navigation.
 *
 * Responsibilities:
 * - Resolve route params
 * - Build domain-specific URL
 *
 * No UI logic inside.
 */
export function BackToEventDetailButton({
  label = "Zurück zur Veranstaltung",
}: BackToEventDetailButtonProps) {
  const params = useParams();

  const href = useMemo(() => {
    const id = params?.id;

    if (!id || typeof id !== "string") {
      /**
       * Fail fast: this should never happen in a valid route context.
       * Prevents silent broken navigation.
       */
      throw new Error("BackToEventDetailButton: Missing or invalid event id");
    }

    return `${env.CHECKPOINT_BASE_PATH}event/${id}`;
  }, [params]);

  return <BackButtonBase href={href} label={label} />;
}
