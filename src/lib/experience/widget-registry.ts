export type WidgetId =
  | "ticket-qr"
  | "guest-stats"
  | "scanner-quick"
  | "security-status"
  | "support-queue"
  | "quick-actions"
  | "event-meta"
  | "scan-activity";

export interface WidgetDefinition {
  id: WidgetId;
  label: string;
  description: string;
  width: 1 | 2 | 3;
}

const WIDGET_REGISTRY: Record<WidgetId, WidgetDefinition> = {
  "ticket-qr": {
    id: "ticket-qr",
    label: "My Ticket",
    description: "Your QR access pass for check-in",
    width: 1,
  },
  "guest-stats": {
    id: "guest-stats",
    label: "Guest Stats",
    description: "Check-in and presence overview",
    width: 2,
  },
  "scanner-quick": {
    id: "scanner-quick",
    label: "Scanner",
    description: "Launch QR scanner for check-in",
    width: 1,
  },
  "security-status": {
    id: "security-status",
    label: "Security Status",
    description: "Gate status, alerts, and entry monitoring",
    width: 2,
  },
  "support-queue": {
    id: "support-queue",
    label: "Support Queue",
    description: "Unassigned guest conversations",
    width: 1,
  },
  "quick-actions": {
    id: "quick-actions",
    label: "Quick Actions",
    description: "Frequently used features",
    width: 3,
  },
  "event-meta": {
    id: "event-meta",
    label: "Event Info",
    description: "Event name, date, and location summary",
    width: 1,
  },
  "scan-activity": {
    id: "scan-activity",
    label: "Scan Activity",
    description: "Recent check-in and scan activity",
    width: 2,
  },
};

export function getWidget(id: WidgetId): WidgetDefinition | undefined {
  return WIDGET_REGISTRY[id];
}

export function getWidgets(ids: WidgetId[]): WidgetDefinition[] {
  return ids.map((id) => WIDGET_REGISTRY[id]).filter(Boolean);
}
