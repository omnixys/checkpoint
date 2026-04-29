"use client";

import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import MyQrContent from "@/checkpoint/components/qr/MyQrContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <MyQrContent />
    </ActiveEventGuard>
  );
}
