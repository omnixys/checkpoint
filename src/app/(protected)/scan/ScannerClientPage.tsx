"use client";
import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import ScanContent from "@/checkpoint/components/scan/ScanContent";

export default function ScannerClientPage() {
  return (
    <ActiveEventGuard>
      <RouteGuard featureId="scanner">
        <ScanContent />
      </RouteGuard>
    </ActiveEventGuard>
  );
}
