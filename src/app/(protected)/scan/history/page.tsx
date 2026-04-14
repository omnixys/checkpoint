"use client";

import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import ScanHistoryContent from "@/checkpoint/components/scan/history/ScanHistoryContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <ScanHistoryContent />
    </ActiveEventGuard>
  );
}
