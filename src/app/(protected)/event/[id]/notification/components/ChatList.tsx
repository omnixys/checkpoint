"use client";

import {
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { NotificationChannel } from "../types/notification-channel.enum";
import { useChannelChats } from "../hooks/useChannelChats";

type Props = {
  selectedChatId: string | null;
  onSelect: (chatId: string) => void;
  channel: NotificationChannel;
};

export function ChatList({ selectedChatId, onSelect, channel }: Props) {
  const { chats, loading } = useChannelChats(channel);

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
