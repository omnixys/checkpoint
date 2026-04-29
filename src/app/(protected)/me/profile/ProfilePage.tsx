"use client";

import {
  MeQuery,
  MeQueryVariables,
  MeDocument,
  UpdateMyProfileMutation,
  UpdateMyProfileMutationVariables,
  UpdateMyProfileDocument,
} from "@/checkpoint/generated/graphql";
import useMeMutation from "@/checkpoint/hooks/user/useMeMutation";
import useMeQuery from "@/checkpoint/hooks/user/useMeQuery";
import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Button, Card, CardContent, Snackbar, Stack, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileClientPage() {
  const router = useRouter();

  const { mePage, mePageLoading } = useMeQuery({
    loadMePage: true,
  });
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
    if (mePage) {
      setForm({
        username: mePage.username,
        firstName: mePage.personalInfo?.firstName ?? "",
        lastName: mePage.personalInfo?.lastName ?? "",
        email: mePage.personalInfo?.email ?? "",
      });
    }
  }, [mePage]);

  const {updateProfileLoading, updateProfile} = useMeMutation();

  const update = async () => {
                    const { data, error } = await updateProfile({
                      variables: { input: form },
                    });
    
    const payload = data?.updateMyProfile;
    
          if (!payload?.ok) {
            setFeedback({
              type: "error",
              message: payload?.message || "Profile update failed",
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
    
    if (error) {
            setFeedback({
              type: "error",
              message: error.message ?? "Profile update failed",
            });
    }

  }

  /* ------------------------------------------------------------
   * Loading guard
   * ------------------------------------------------------------ */
  if (mePageLoading) {
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
              disabled={updateProfileLoading}
              onClick={update}
            >
              {updateProfileLoading ? "Saving…" : "Save Changes"}
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
