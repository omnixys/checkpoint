"use client";

import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import MySeatContent from "@/checkpoint/components/mySeat/MySeatContent";
import { JSX } from "react";

/**
 * Guest-facing page that shows the assigned seat
 * for the currently active event.
 *
 * Event context is resolved via ActiveEventProvider.
 */
export default function MySeatPage(): JSX.Element {
  return (
    <ActiveEventGuard>
      <MySeatContent />
    </ActiveEventGuard>
  );
}
