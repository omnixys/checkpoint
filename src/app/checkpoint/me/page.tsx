"use client";

import { ME } from "@/graphql/user/user-query.graphql";
import { MeResult } from "@//types/user/user-graphql.type";
import { useQuery } from "@apollo/client/react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function MePage() {
  const router = useRouter();

  const { data, loading } = useQuery<MeResult>(ME);

  if (loading) return null;

  const user = data?.me;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My Space</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6">
            {user?.personalInfo.firstName} {user?.personalInfo.lastName}
          </Typography>
          <Typography color="text.secondary">@{user?.username}</Typography>
          <Typography color="text.secondary">{user?.personalInfo.email}</Typography>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Button variant="contained" onClick={() => router.push("/me/profile")}>
          Edit Profile
        </Button>

        <Button variant="outlined" onClick={() => router.push("/me/security")}>
          Security & Password
        </Button>

        <Button
          variant="outlined"
          onClick={() => router.push("/me/notifications")}
        >
          My Notifications
        </Button>
      </Stack>
    </Stack>
  );
}
