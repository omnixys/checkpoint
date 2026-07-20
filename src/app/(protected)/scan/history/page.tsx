"use client";

import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import ScanHistoryContent from "@/checkpoint/components/scan/history/ScanHistoryContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <RouteGuard featureId="scan-history">
        <ScanHistoryContent />
      </RouteGuard>
    </ActiveEventGuard>
  );
}
