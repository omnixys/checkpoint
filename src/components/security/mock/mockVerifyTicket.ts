export async function mockVerifyTicket(ticketId: string) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 400));

  if (ticketId === "A12") {
    return {
      verdict: "OK" as const,
      message: "Valid ticket. Seat A12.",
    };
  }

  if (ticketId === "VIP-007") {
    return {
      verdict: "WARNING" as const,
      message: "Ticket valid, but device mismatch detected.",
    };
  }

  return {
    verdict: "DENIED" as const,
    message: "Ticket not found or revoked.",
  };
}
