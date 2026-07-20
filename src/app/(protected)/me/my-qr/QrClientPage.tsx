"use client";

import ActiveEventGuard from "@/checkpoint/components/guard/ActiveEventGuard";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import MyQrContent from "@/checkpoint/components/qr/MyQrContent";

export default function Page() {
  return (
    <ActiveEventGuard>
      <RouteGuard featureId="my-ticket">
        <MyQrContent />
      </RouteGuard>
    </ActiveEventGuard>
  );
}
