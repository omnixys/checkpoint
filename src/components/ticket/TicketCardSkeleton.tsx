import { Box, Stack } from "@mui/material";

export default function TicketCardSkeleton() {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            width: 120,
            height: 28,
            bgcolor: "rgba(255,255,255,0.08)",
            borderRadius: 2,
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: 320,
            bgcolor: "rgba(255,255,255,0.06)",
            borderRadius: 3,
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: 44,
            bgcolor: "rgba(255,255,255,0.08)",
            borderRadius: 3,
          }}
        />
      </Stack>
    </Box>
  );
}
