"use client";

export type MockMessage = {
  id: string;
  body: string;
  direction: "INBOUND" | "OUTBOUND";
};

export function useMockMessages(chatId: string | null) {
  return {
    loading: false,
    messages: chatId
      ? [
          {
            id: "1",
            body: "Hello 👋",
            direction: "INBOUND",
          },
          {
            id: "2",
            body: "Hi, how can I help you?",
            direction: "OUTBOUND",
          },
        ]
      : [],
  };
}
