import { Box, Typography, Stack, Button } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_NOTIFICATION_BY_ID } from "@/graphql/notification/notification.query";
import dayjs from "@/lib/dayjs";
import { MARK_AS_UN_READ, ARCHIVE_NOTIFICATION, UN_ARCHIVE, DELETE_NOTIFICATION } from "@/graphql/notification/notification.mutation";
import { Notification } from "@/types/notification/notification.type";

export default function MailDetailPane({
  notificationId,
}: {
  notificationId: string | null;
}) {
  const { data } = useQuery(GET_NOTIFICATION_BY_ID, {
    skip: !notificationId,
    variables: { id: notificationId },
  });

  const [markUnread] = useMutation(MARK_AS_UN_READ);
  const [archive] = useMutation(ARCHIVE_NOTIFICATION);
  const [unarchive] = useMutation(UN_ARCHIVE);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);


  if (!notificationId) {
    return (
      <Box p={4} color="text.secondary">
        Select a notification
      </Box>
    );
  }

  const n: Notification = data?.notification;

  if (!n) return null;

  return (
    <Box p={4} sx={{ overflowY: "auto" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {n.read && (
          <Button
            size="small"
            variant="text"
            onClick={() => markUnread({ variables: { notificationId: n.id } })}
          >
            Mark Unread
          </Button>
        )}

        {n.status !== "ARCHIVED" ? (
          <Button
            size="small"
            variant="text"
            onClick={() => archive({ variables: { notificationId: n.id } })}
          >
            Archive
          </Button>
        ) : (
          <Button
            size="small"
            variant="text"
            onClick={() => unarchive({ variables: { notificationId: n.id } })}
          >
            Restore
          </Button>
        )}

      
          <Button
            size="small"
            variant="text"
            onClick={() => deleteNotification({ variables: { notificationId: n.id } })}
          >
            Delete
          </Button>
        

      </Stack>

      <Stack spacing={3} maxWidth={720}>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ letterSpacing: "-0.01em" }}
        >
          {n.renderedTitle}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {n.channel} · {n.priority} ·{" "}
          {dayjs(n.createdAt).format("DD.MM.YYYY HH:mm")}
        </Typography>

        <Box
          sx={{
            lineHeight: 1.7,
            fontSize: 15,
            color: "text.primary",
          }}
          dangerouslySetInnerHTML={{ __html: n.renderedBody }}
        />
      </Stack>
    </Box>
  );
}

