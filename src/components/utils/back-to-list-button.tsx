"use client";

import { BackButtonBase } from "./back-button-base";

export interface BackToListButtonProps {
  backTo: string;
  label?: string;
}

/**
 * Domain wrapper for "Back to List".
 *
 * Keeps routing decision outside UI layer.
 */
export function BackToListButton({ backTo, label = "Zurück zur Liste" }: BackToListButtonProps) {
  return <BackButtonBase href={backTo} label={label} />;
}
