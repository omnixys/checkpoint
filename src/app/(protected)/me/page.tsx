"use client";

import useMeQuery from "@/checkpoint/hooks/user/useMeQuery";
import { env } from "@/checkpoint/lib/env";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const basePath = env.CHECKPOINT_BASE_PATH;
export default function MePage() {
  const router = useRouter();

  const {mePage, mePageLoading} = useMeQuery({
    loadMePage: true
  });

  if (mePageLoading) return null;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My Space</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">
            {mePage?.personalInfo?.firstName} {mePage?.personalInfo?.lastName}
          </Typography>
          <Typography color="text.secondary">@{mePage?.username}</Typography>
          <Typography color="text.secondary">
            {mePage?.personalInfo?.email}
          </Typography>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Button
          variant="contained"
          onClick={() => router.push(`${basePath}me/profile`)}
        >
          Edit Profile
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push(`${basePath}me/security`)}
        >
          Security & Password
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push(`${basePath}me/notifications`)}
        >
          My Notifications
        </Button>
      </Stack>
    </Stack>
  );
}
