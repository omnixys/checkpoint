"use client";

import ActiveEventGuard from "@/components/guard/ActiveEventGuard";
import ScanHistoryContent from "@/components/scan/history/ScanHistoryContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <ScanHistoryContent />
    </ActiveEventGuard>
  );
}
