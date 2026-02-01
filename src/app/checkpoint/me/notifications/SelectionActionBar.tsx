import { Box, Stack, Typography, Button } from "@mui/material";

export default function SelectionActionBar({
  count,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDelete,
  onClear,
}) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(28,28,28,0.9)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left: selection info */}
      <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.9 }}>
        {count} selected
      </Typography>

      {/* Right: actions */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Button size="small" variant="text" onClick={onMarkRead}>
          Mark Read
        </Button>

        <Button size="small" variant="text" onClick={onMarkUnread}>
          Mark Unread
        </Button>

        <Button size="small" variant="text" onClick={onArchive}>
          Archive
        </Button>

        <Button size="small" variant="text" onClick={onDelete}>
          Delete
        </Button>

        {/* Separator */}
        <Box
          sx={{
            width: 1,
            height: 20,
            mx: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <Button
          size="small"
          variant="text"
          color="inherit"
          onClick={onClear}
          sx={{ opacity: 0.7 }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}
