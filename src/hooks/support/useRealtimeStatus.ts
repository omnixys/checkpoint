"use client";

import { useSyncExternalStore } from "react";
import {
  getRealtimeStatus,
  type RealtimeStatus,
  subscribeRealtimeStatus,
} from "@/checkpoint/lib/apollo/ws-link";

export function useRealtimeStatus(): RealtimeStatus {
  return useSyncExternalStore(subscribeRealtimeStatus, getRealtimeStatus, () => "offline");
}

export function realtimeStatusLabel(status: RealtimeStatus): string {
  switch (status) {
    case "connected":
      return "Live";
    case "connecting":
      return "Verbindung wird hergestellt";
    case "reconnecting":
      return "Verbindung wird wiederhergestellt";
    case "offline":
      return "Offline";
  }
}
