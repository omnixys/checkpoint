"use client";

import {
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useChats } from "../hooks/useChats";

type Props = {
  selectedChatId: string | null;
  onSelect: (chatId: string) => void;
};

export function ChatList({ selectedChatId, onSelect }: Props) {
  const { chats, loading } = useChats();

  if (loading) return <CircularProgress />;

  return (
    <List>
      {chats.map((chat) => (
        <ListItemButton
          key={chat.id}
          selected={chat.chatId === selectedChatId}
          onClick={() => onSelect(chat.chatId)}
        >
          <ListItemText primary={chat.name} secondary={chat.chatId} />
        </ListItemButton>
      ))}
    </List>
  );
}
