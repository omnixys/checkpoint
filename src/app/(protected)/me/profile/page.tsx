"use client";

import {
  MeQuery,
  MeQueryVariables,
  MeDocument,
  UpdateMyProfileMutation,
  UpdateMyProfileMutationVariables,
  UpdateMyProfileDocument,
} from "@/checkpoint/generated/graphql";
import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Button, Card, CardContent, Snackbar, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();

  /* ------------------------------------------------------------
   * Load current user
   * ------------------------------------------------------------ */
  const { data, loading: meLoading } = useQuery<MeQuery, MeQueryVariables>(MeDocument);

  /* ------------------------------------------------------------
   * Form state
   * ------------------------------------------------------------ */
  const [form, setForm] = useState<{
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  }>({
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
        firstName: data.me.personalInfo?.firstName ?? "",
        lastName: data.me.personalInfo?.lastName ?? "",
        email: data.me.personalInfo?.email ?? "",
      });
    }
  }, [data]);

  /* ------------------------------------------------------------
   * Mutation
   * ------------------------------------------------------------ */
  const [updateProfile, { loading: saving }] = useMutation<
    UpdateMyProfileMutation,
    UpdateMyProfileMutationVariables
  >(UpdateMyProfileDocument, {
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

    refetchQueries: [MeDocument],
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

      <Snackbar open={!!feedback} autoHideDuration={3000} onClose={() => setFeedback(null)}>
        <Alert severity={feedback?.type}>{feedback?.message}</Alert>
      </Snackbar>
    </>
  );
}
