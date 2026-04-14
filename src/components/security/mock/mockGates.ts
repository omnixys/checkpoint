import { GateTrendType } from "@/checkpoint/types/security.typa";

export const mockGates: {
  id: string;
  name: string;
  scans: number;
  warnings: number;
  trend: GateTrendType;
}[] = [
  {
    id: "gate-1",
    name: "Main Entrance",
    scans: 412,
    warnings: 8,
    trend: "medium",
  },
  {
    id: "gate-2",
    name: "West Gate",
    scans: 260,
    warnings: 1,
    trend: "low",
  },
  {
    id: "gate-3",
    name: "VIP Gate",
    scans: 114,
    warnings: 4,
    trend: "high",
  },
];
