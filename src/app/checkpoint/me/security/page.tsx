"use client";

import { CHANGE_MY_PASSWORD } from "@/graphql/authentication/auth.mutation";
import {
  ChangeMyPasswordRequest,
  ChangeMyPasswordResult,
} from "@/types/authentication/auth-graphql.type";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePasswordCard() {
  const router = useRouter();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [changePassword, { loading }] = useMutation<
    ChangeMyPasswordResult,
    ChangeMyPasswordRequest
  >(CHANGE_MY_PASSWORD, {
    onCompleted() {
      setFeedback({
        type: "success",
        message: "Password updated successfully",
      });

      // Clear sensitive fields
      setForm({ oldPassword: "", newPassword: "", confirm: "" });

      // Redirect after short delay
      setTimeout(() => {
        router.push("/me");
      }, 1000);
    },
    onError(error) {
      setFeedback({
        type: "error",
        message: error.message ?? "Password update failed",
      });
    },
  });

  const disabled =
    !form.oldPassword || !form.newPassword || form.newPassword !== form.confirm;

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h6">Change Password</Typography>

            <TextField
              label="Current password"
              type="password"
              value={form.oldPassword}
              onChange={(e) =>
                setForm({ ...form, oldPassword: e.target.value })
              }
            />

            <TextField
              label="New password"
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />

            <TextField
              label="Confirm new password"
              type="password"
              error={form.confirm !== "" && form.confirm !== form.newPassword}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />

            <Button
              variant="contained"
              disabled={disabled || loading}
              onClick={() =>
                changePassword({
                  variables: {
                    input: {
                      oldPassword: form.oldPassword,
                      newPassword: form.newPassword,
                    },
                  },
                })
              }
            >
              {loading ? "Updating…" : "Update password"}
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
