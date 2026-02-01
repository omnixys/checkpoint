"use client";

import { JSX, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { ADMIN_CHANGE_PASSWORD } from "./graphql";
import { useRouter } from "next/navigation";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyboardCapslockRoundedIcon from "@mui/icons-material/KeyboardCapslockRounded";
import { motion } from "framer-motion";

type Props = {
  id?: string;
};

/* ------------------------------------------------------------
 * Subtle shake animation (VisionOS-like)
 * ---------------------------------------------------------- */
const shake = {
  initial: { x: 0 },
  animate: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45 },
  },
};

/* ------------------------------------------------------------
 * Password strength heuristic (Apple-like)
 * ---------------------------------------------------------- */
function getPasswordStrength(pw: string): {
  score: number;
  label: string;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak" };
  if (score === 2) return { score, label: "Okay" };
  if (score === 3) return { score, label: "Strong" };
  return { score, label: "Very strong" };
}

export default function NewPasswordStep({ id }: Props): JSX.Element {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const passwordsMatch = password === confirm && confirm.length > 0;
  const meetsPolicy = password.length >= 8;

  const [changePassword, { loading }] = useMutation(ADMIN_CHANGE_PASSWORD, {
    onError: () => {
      setError("Failed to change password. Please try again.");
      setShakeKey((k) => k + 1);
    },
  });

  const submit = async (): Promise<void> => {
    if (!id || !password || !passwordsMatch || !meetsPolicy) {
      setShakeKey((k) => k + 1);
      return;
    }

    setError(null);

    await changePassword({
      variables: {
        input: {
          id,
          newPassword: password,
        },
      },
    });

    setSuccess(true);
    setTimeout(() => {
      router.replace("/checkpoint/login");
    }, 1400);
  };

  /* ------------------------------------------------------------
   * SUCCESS STATE
   * ---------------------------------------------------------- */
  if (success) {
    return (
      <Box
        maxWidth={420}
        mx="auto"
        textAlign="center"
        sx={{
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          bgcolor: "rgba(52,199,89,0.15)",
          border: "1px solid rgba(52,199,89,0.35)",
        }}
      >
        <CheckCircleRoundedIcon
          sx={{ fontSize: 48, color: "#34C759", mb: 1 }}
        />
        <Typography variant="h6" fontWeight={700}>
          Password updated
        </Typography>
        <Typography sx={{ opacity: 0.8, mt: 0.5 }}>
          Redirecting to login…
        </Typography>
      </Box>
    );
  }

  /* ------------------------------------------------------------
   * FORM
   * ---------------------------------------------------------- */
  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h5" mb={1.5} fontWeight={700}>
        Set new password
      </Typography>

      <Typography mb={3} sx={{ opacity: 0.75 }}>
        Use a strong password to keep your account secure.
      </Typography>

      {/* Error (VisionOS glass + shake) */}
      {error && (
        <motion.div
          key={shakeKey}
          variants={shake}
          initial="initial"
          animate="animate"
        >
          <Box
            sx={{
              mb: 2,
              px: 2.5,
              py: 2,
              borderRadius: 3,
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background:
                "linear-gradient(180deg, rgba(255,59,48,0.18), rgba(255,59,48,0.08))",
              border: "1px solid rgba(255,59,48,0.35)",
              boxShadow: "0 12px 30px rgba(255,59,48,0.25)",
            }}
          >
            <Typography fontWeight={700} sx={{ color: "#FF453A" }}>
              Something went wrong
            </Typography>
            <Typography fontSize={14} sx={{ mt: 0.5 }}>
              {error}
            </Typography>
          </Box>
        </motion.div>
      )}

      <motion.div
        key={shakeKey}
        variants={shake}
        initial="initial"
        animate="animate"
      >
        <Stack spacing={2}>
          {/* NEW PASSWORD */}
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
          />

          {/* Caps Lock warning */}
          {capsLock && (
            <Typography
              fontSize={13}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#FF9F0A",
              }}
            >
              <KeyboardCapslockRoundedIcon fontSize="small" />
              Caps Lock is on
            </Typography>
          )}

          {/* Password strength */}
          {password && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={(strength.score / 4) * 100}
                sx={{
                  height: 6,
                  borderRadius: 4,
                  mb: 0.5,
                  bgcolor: "rgba(255,255,255,0.12)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor:
                      strength.score <= 1
                        ? "#FF453A"
                        : strength.score === 2
                          ? "#FF9F0A"
                          : "#34C759",
                  },
                }}
              />
              <Typography fontSize={13} sx={{ opacity: 0.75 }}>
                Strength: <strong>{strength.label}</strong> · Minimum 8
                characters
              </Typography>
            </Box>
          )}

          {/* Passphrase suggestion */}
          {!password && (
            <Typography fontSize={13} sx={{ opacity: 0.6 }}>
              Tip: Use a passphrase like <em>“Blue-River-Sunset-42”</em>
            </Typography>
          )}

          {/* CONFIRM PASSWORD */}
          <TextField
            label="Confirm password"
            type={showPw ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={!!confirm && !passwordsMatch}
            helperText={
              confirm && !passwordsMatch ? "Passwords do not match" : " "
            }
            InputProps={{
              sx: {
                borderRadius: "14px",
                backdropFilter: "blur(12px)",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw((p) => !p)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* SUBMIT */}
          <Button
            variant="contained"
            onClick={submit}
            disabled={
              !id ||
              !password ||
              !confirm ||
              !passwordsMatch ||
              !meetsPolicy ||
              loading
            }
            sx={{
              py: 1.2,
              borderRadius: 3,
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Save password"
            )}
          </Button>

          <Button
            variant="text"
            onClick={() => router.replace("/checkpoint/login")}
          >
            ← Back to login
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
