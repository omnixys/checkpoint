"use client";

import type { JSX } from "react";
import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import MySeatContent from "@/checkpoint/components/mySeat/MySeatContent";

/**
 * Guest-facing page that shows the assigned seat
 * for the currently active event.
 *
 * Event context is resolved via ActiveEventProvider.
 */
export default function MySeatClientPage(): JSX.Element {
  return (
    <ActiveEventGuard>
      <MySeatContent />
    </ActiveEventGuard>
  );
}
