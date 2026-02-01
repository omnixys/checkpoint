"use client";
import ActiveEventGuard from "@/components/guard/ActiveEventGuard";
import ScanContent from "@/components/scan/ScanContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <ScanContent />
    </ActiveEventGuard>
  );
}
