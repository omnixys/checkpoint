"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UPDATE_MY_PROFILE } from "@/components/../graphql/authentication/auth.mutation";
import { ME } from "@/graphql/user/user-query.graphql";

import {
  UpdateMyProfileRequest,
  UpdateMyProfileResult,
} from "@/types/authentication/auth-graphql.type";
import { UpdateMyProfileInput } from "@/types/authentication/auth-input.type";
import { MeResult } from "@/types/user/user-graphql.type";

export default function ProfilePage() {
  const router = useRouter();

  /* ------------------------------------------------------------
   * Load current user
   * ------------------------------------------------------------ */
  const { data, loading: meLoading } = useQuery<MeResult>(ME);

  /* ------------------------------------------------------------
   * Form state
   * ------------------------------------------------------------ */
  const [form, setForm] = useState<UpdateMyProfileInput>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  /* ------------------------------------------------------------
   * Feedback state
   * ------------------------------------------------------------ */
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ------------------------------------------------------------
   * Sync form once ME is loaded
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (data?.me) {
      setForm({
        username: data.me.username,
        firstName: data.me.firstName ?? "",
        lastName: data.me.lastName ?? "",
        email: data.me.email ?? "",
      });
    }
  }, [data]);

  /* ------------------------------------------------------------
   * Mutation
   * ------------------------------------------------------------ */
  const [updateProfile, { loading: saving }] = useMutation<
    UpdateMyProfileResult,
    UpdateMyProfileRequest
  >(UPDATE_MY_PROFILE, {
    onCompleted(result) {
      const payload = result.updateMyProfile;

      if (!payload.ok) {
        setFeedback({
          type: "error",
          message: payload.message || "Profile update failed",
        });
        return;
      }

      setFeedback({
        type: "success",
        message: payload.message || "Profile updated successfully",
      });

      // Redirect after short confirmation
      setTimeout(() => {
        router.push("/me");
      }, 1500);
    },

    onError(error) {
      setFeedback({
        type: "error",
        message: error.message ?? "Profile update failed",
      });
    },

    refetchQueries: [ME],
  });

  /* ------------------------------------------------------------
   * Loading guard
   * ------------------------------------------------------------ */
  if (meLoading) {
    return null;
  }

  /* ------------------------------------------------------------
   * Render
   * ------------------------------------------------------------ */
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Button
              variant="contained"
              disabled={saving}
              onClick={() =>
                updateProfile({
                  variables: { input: form },
                })
              }
            >
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback(null)}
      >
        <Alert severity={feedback?.type}>{feedback?.message}</Alert>
      </Snackbar>
    </>
  );
}
