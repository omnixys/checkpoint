"use client";
import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import ScanContent from "@/checkpoint/components/scan/ScanContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <ScanContent />
    </ActiveEventGuard>
  );
}
