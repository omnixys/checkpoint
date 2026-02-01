import {
  Box,
  Checkbox,
  Stack,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import dayjs from "@/lib/dayjs";

export default function MailListItem({
  notification,
  selected,
  checked,
  onCheck,
  onOpen,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        cursor: "pointer",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        backgroundColor: selected
          ? alpha(theme.palette.primary.main, 0.12)
          : "transparent",
        "&:hover": {
          backgroundColor: alpha(theme.palette.action.hover, 0.6),
        },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 24,
            display: "flex",
            justifyContent: "center",
            mt: 0.4,
          }}
        >
          {checked || notification.read ? (
            <Checkbox
              size="small"
              checked={checked}
              onClick={(e) => e.stopPropagation()}
              onChange={onCheck}
            />
          ) : (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: notification.read ? "transparent" : "primary.main",
                mt: 0.9,
              }}
            />
          )}
        </Box>

        <Stack spacing={0.25} flex={1} minWidth={0} onClick={onOpen}>
          {/* Titel + Zeit */}
          <Stack direction="row" justifyContent="space-between">
            <Typography
              fontSize={14}
              fontWeight={notification.read ? 400 : 600}
              noWrap
            >
              {notification.renderedTitle}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 2, whiteSpace: "nowrap" }}
            >
              {dayjs(notification.createdAt).fromNow()}
            </Typography>
          </Stack>

          {/* Preview – NUR 1 Zeile */}
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ opacity: 0.65 }}
          >
            {notification.renderedBody}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
