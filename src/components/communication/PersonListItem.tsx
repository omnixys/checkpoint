"use client";

import { Avatar, alpha, Badge, Box, Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";

const ItemButton = styled("button")<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 12,
  background: selected
    ? theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.15s",
  "&:hover": {
    background: theme.palette.mode === "dark" ? alpha("#FFFFFF", 0.06) : alpha("#000000", 0.04),
  },
}));

const OnlineDot = styled("span")<{ online: boolean }>(({ theme, online }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: online ? theme.palette.success.main : alpha("#FFFFFF", 0.2),
  border: `2px solid ${theme.palette.background.paper}`,
  position: "absolute",
  bottom: 0,
  right: 0,
}));

const NameText = styled(Typography)({
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.3,
});

const PreviewText = styled(Typography)(({ theme }) => ({
  fontSize: 11,
  color: theme.palette.text.secondary,
  lineHeight: 1.3,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: 180,
}));

export interface PersonData {
  id: string;
  name: string;
  avatar?: string;
  roles?: string[];
  isOnline?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageAt?: string;
  channels?: string[];
  phoneNumber?: string | undefined;
}

interface Props {
  person: PersonData;
  selected: boolean;
  onClick: (id: string) => void;
}

export function PersonListItem({ person, selected, onClick }: Props) {
  const handleClick = useCallback(() => onClick(person.id), [onClick, person.id]);

  const initials = person.name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <ItemButton selected={selected} onClick={handleClick} type="button">
      <Badge
        badgeContent={person.unreadCount && person.unreadCount > 0 ? person.unreadCount : undefined}
        color="error"
        overlap="circular"
        slotProps={{
          badge: {
            sx: {
              fontSize: 10,
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={person.avatar}
            sx={{
              width: 36,
              height: 36,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <OnlineDot online={person.isOnline ?? false} />
        </Box>
      </Badge>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <NameText>{person.name}</NameText>
          {person.roles?.map((r) => (
            <Chip
              key={r}
              label={r}
              size="small"
              sx={{ height: 16, fontSize: 9, fontWeight: 600 }}
            />
          ))}
        </Box>
        {person.lastMessage && <PreviewText>{person.lastMessage}</PreviewText>}
      </Box>
    </ItemButton>
  );
}
