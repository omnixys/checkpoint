import { Stack, Divider, Box, TextField, InputAdornment, MenuItem, Select } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client/react";
import { MY_NOTIFICATIONS } from "@/graphql/notification/notification.query";
import MailListItem from "./MailListItem";
import SelectionActionBar from "./SelectionActionBar";
import { useMailSelection } from "./useMailSelection";
import { Notification } from "@/types/notification/notification.type";
import { MARK_AS_READ_BULK, MARK_AS_UN_READ_BULK, ARCHIVE_BULK, DELETE_NOTIFICATION_BULK } from "@/graphql/notification/notification.mutation";
import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function MailListPane({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  }) {
  type StatusFilter = "all" | "read" | "unread" | "archived" | "unarchived";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const { data } = useQuery(MY_NOTIFICATIONS);
  const [markAsReadBulk] = useMutation(MARK_AS_READ_BULK);
  const [markAsUnreadBulk] = useMutation(MARK_AS_UN_READ_BULK);
  const [archiveBulk] = useMutation(ARCHIVE_BULK);
  const [deleteBulk] = useMutation(DELETE_NOTIFICATION_BULK);

  
  const notifications = data?.myNotifications ?? [];

  const ids = notifications.map((n: Notification) => n.id);
  const selection = useMailSelection(ids);

  const filtered = notifications.filter((n: Notification) => {
    switch (statusFilter) {
      case "read":
        if (!n.read) return false;
        break;

      case "unread":
        if (n.read) return false;
        break;

      case "archived":
        if (n.status !== "ARCHIVED") return false;
        break;

      case "unarchived":
        if (n.status === "ARCHIVED") return false;
        break;
    }

    if (search) {
      const q = search.toLowerCase();
      if (
        !n.renderedTitle.toLowerCase().includes(q) &&
        !n.renderedBody.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    return true;
  });



  


  return (
    <Stack sx={{ borderRight: 1, borderColor: "divider" }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(20,20,20,0.85)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Stack spacing={1}>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            }
            sx={{
              maxWidth: 180,
              borderRadius: 999,
              fontSize: 13,
            }}
          >
            <MenuItem value="inbox">Inbox</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="archived">Archive</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </Stack>
      </Box>

      {selection.hasSelection && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(30,30,30,0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SelectionActionBar
            count={selection.count}
            onMarkRead={() =>
              markAsReadBulk({
                variables: { notificationIds: selection.selectedIds },
              })
            }
            onMarkUnread={() =>
              markAsUnreadBulk({
                variables: { notificationIds: selection.selectedIds },
              })
            }
            onArchive={() =>
              archiveBulk({
                variables: { notificationIds: selection.selectedIds },
              })
            }
            onDelete={() =>
              deleteBulk({
                variables: { notificationIds: selection.selectedIds },
              })
            }
            onClear={selection.clear}
          />
        </Box>
      )}

      {filtered.map((n: Notification) => (
        <MailListItem
          key={n.id}
          notification={n}
          selected={n.id === selectedId}
          checked={selection.isSelected(n.id)}
          onCheck={() => selection.toggle(n.id)}
          onOpen={() => onSelect(n.id)}
        />
      ))}

      <Divider />
    </Stack>
  );
}
