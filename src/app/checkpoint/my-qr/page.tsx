"use client";

import ActiveEventGuard from "@/components/guard/ActiveEventGuard";
import MyQrContent from "@/components/myQr/MyQrContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <MyQrContent />
    </ActiveEventGuard>
  );
}
