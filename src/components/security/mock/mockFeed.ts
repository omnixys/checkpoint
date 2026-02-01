export const mockFeed = [
  {
    id: "f-1",
    name: "John Doe",
    seat: "A12",
    gate: "Main Entrance",
    verdict: "OK" as const,
    time: "14:03:22",
  },
  {
    id: "f-2",
    name: "Emily Carter",
    seat: "C05",
    gate: "West Gate",
    verdict: "WARNING" as const,
    time: "14:03:13",
  },
  {
    id: "f-3",
    name: "Unknown Guest",
    seat: "-",
    gate: "VIP Gate",
    verdict: "DENIED" as const,
    time: "14:03:01",
  },
  {
    id: "f-4",
    name: "Michael Lee",
    seat: "F11",
    gate: "Main Entrance",
    verdict: "OK" as const,
    time: "14:02:54",
  },
];
