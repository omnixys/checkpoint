"use client";

import {
  ChangeMyPasswordMutation,
  ChangeMyPasswordMutationVariables,
  ChangeMyPasswordDocument,
} from "@/checkpoint/generated/graphql";

import { useMutation } from "@apollo/client/react";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ChangePasswordCard() {
  const theme = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  const [changePassword] = useMutation<ChangeMyPasswordMutation, ChangeMyPasswordMutationVariables>(
    ChangeMyPasswordDocument,
  );

  /* ------------------------------------------------------------
   * Validation
   * ------------------------------------------------------------ */
  const errors = useMemo(() => {
    return {
      mismatch: form.confirm !== "" && form.confirm !== form.newPassword,
      weak: form.newPassword.length > 0 && form.newPassword.length < 8,
    };
  }, [form]);

  const disabled = !form.oldPassword || !form.newPassword || errors.mismatch || errors.weak;

  /* ------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------ */
  const submit = async () => {
    try {
      setStatus("saving");

      const { data } = await changePassword({
        variables: {
          input: {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
          },
        },
      });

      if (!data?.changeMyPassword?.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirm: "",
      });

      setTimeout(() => {
        router.push("/me");
      }, 1200);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Stack spacing={4}>
      {/* 🔥 HEADER */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Security
        </Typography>

        <Typography color="text.secondary">
          Update your password to keep your account secure
        </Typography>
      </Box>

      {/* 🔥 FORM */}
      <Card
        sx={{
          borderRadius: 4,
          backdropFilter: "blur(16px)",
          background: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label="Current password"
              type="password"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              fullWidth
            />

            <TextField
              label="New password"
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              error={errors.weak}
              helperText={errors.weak ? "Password must be at least 8 characters" : " "}
              fullWidth
            />

            <TextField
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.mismatch}
              helperText={errors.mismatch ? "Passwords do not match" : " "}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 🔥 ACTION BAR */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: form.newPassword ? 1 : 0,
          y: form.newPassword ? 0 : 40,
        }}
        sx={{
          position: "sticky",
          bottom: 16,
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 480,
            p: 2,
            borderRadius: 3,
            backdropFilter: "blur(20px)",
            background: alpha(theme.palette.background.paper, 0.7),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {status === "saving" && "Updating password…"}
              {status === "success" && "Password updated"}
              {status === "error" && "Error updating password"}
              {status === "idle" && "Enter a new password"}
            </Typography>

            <Typography
              sx={{
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
                fontWeight: 600,
              }}
              onClick={!disabled ? submit : undefined}
            >
              Update
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
