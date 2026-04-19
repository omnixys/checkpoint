"use client";

export type MockChat = {
  id: string;
  chatId: string;
  name: string;
  lastMessage: string;
  avatar: string;
  unread: number;
};

export function useMockChats(): { chats: MockChat[]; loading: boolean } {
  return {
    loading: false,
    chats: [
      {
        id: "1",
        chatId: "chat_1",
        name: "John Doe",
        lastMessage: "Hey, are we still on for tonight?",
        avatar: "https://i.pravatar.cc/150?img=1",
        unread: 2,
      },
      {
        id: "2",
        chatId: "chat_2",
        name: "Omnixys Support",
        lastMessage: "Your ticket has been updated.",
        avatar: "https://i.pravatar.cc/150?img=2",
        unread: 0,
      },
    ],
  };
}
