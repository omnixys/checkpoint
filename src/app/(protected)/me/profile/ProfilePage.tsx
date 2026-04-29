"use client";

import useMeMutation from "@/checkpoint/hooks/user/useMeMutation";
import useMeQuery from "@/checkpoint/hooks/user/useMeQuery";

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProfileClientPage() {
  const theme = useTheme();
  const router = useRouter();

  const { mePage, mePageLoading } = useMeQuery({
    loadMePage: true,
  });

  const { updateProfile, updateProfileLoading } = useMeMutation();

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [savedState, setSavedState] = useState(form);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  /* ------------------------------------------------------------
   * Sync initial data
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (mePage) {
      const next = {
        username: mePage.username,
        firstName: mePage.personalInfo?.firstName ?? "",
        lastName: mePage.personalInfo?.lastName ?? "",
        email: mePage.personalInfo?.email ?? "",
      };

      setForm(next);
      setSavedState(next);
    }
  }, [mePage]);

  /* ------------------------------------------------------------
   * Dirty check
   * ------------------------------------------------------------ */
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(savedState);
  }, [form, savedState]);

  /* ------------------------------------------------------------
   * Prevent accidental leave (optional but useful)
   * ------------------------------------------------------------ */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  /* ------------------------------------------------------------
   * Update handler
   * ------------------------------------------------------------ */
  const update = async () => {
    if (!isDirty || updateProfileLoading) return;

    try {
      setStatus("saving");

      const { data } = await updateProfile({
        variables: { input: form },
      });

      const payload = data?.updateMyProfile;

      if (!payload?.ok) {
        setStatus("error");
        return;
      }

      setSavedState(form);
      setStatus("saved");

      setTimeout(() => {
        router.push("/me");
      }, 1200);
    } catch {
      setStatus("error");
    }
  };

  if (mePageLoading) return null;

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
          boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.2)}`,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Edit Profile
        </Typography>
        <Typography color="text.secondary">
          Update your personal information
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
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") update();
              }}
              fullWidth
            />

            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") update();
              }}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") update();
              }}
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>

      {/* 🔥 FLOATING ACTION BAR */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: isDirty ? 1 : 0,
          y: isDirty ? 0 : 40,
          pointerEvents: isDirty ? "auto" : "none",
        }}
        sx={{
          position: "sticky",
          bottom: 16,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 520,
            p: 2,
            borderRadius: 3,
            backdropFilter: "blur(20px)",
            background: alpha(theme.palette.background.paper, 0.75),
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
                          alignItems:"center",
            justifyContent:"space-between"
            }}

          >
            {/* STATUS */}
            <Typography variant="body2" color="text.secondary">
              {status === "saving" && "Saving…"}
              {status === "saved" && "All changes saved"}
              {status === "error" && "Error saving changes"}
              {status === "idle" && "Unsaved changes"}
            </Typography>

            {/* CTA */}
            <Button
              variant="contained"
              disableElevation
              onClick={update}
              disabled={!isDirty || updateProfileLoading}
              sx={{
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
              }}
            >
              {updateProfileLoading ? "Saving…" : "Save Changes"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
