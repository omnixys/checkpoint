export const mockAlerts = [
  {
    id: "al-1",
    message: "Device mismatch detected at Main Entrance",
    severity: "warn" as const,
  },
  {
    id: "al-2",
    message: "Revoked ticket scanned at VIP Gate",
    severity: "critical" as const,
  },
  {
    id: "al-3",
    message: "Multiple rapid scans detected at West Gate",
    severity: "warn" as const,
  },
];
