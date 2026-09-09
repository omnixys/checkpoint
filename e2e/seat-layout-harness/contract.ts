import type {
  LayoutDocument,
  LayoutNode,
} from "../../src/components/seat/seatMapCanvas/core/document";

export interface HarnessSnapshot {
  document: LayoutDocument | null;
  selectedIds: string[];
  pending: boolean;
  error: string | null;
  requests: { kind: LayoutNode["kind"]; input: { id: string; x: number; y: number } }[];
}
declare global {
  interface Window {
    seatHarness: {
      snapshot(): HarnessSnapshot;
      setEvent(eventId: string): void;
      setEditing(editing: boolean): void;
      setOutcome(outcome: "success" | "failure" | "defer"): void;
      settle(fail?: boolean): void;
      refetch(): void;
    };
  }
}
