"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

type UnlockType = "ticket" | "invitation" | "token";

export default function UnlockPage(): JSX.Element {
  const theme = useTheme();
  const omni = theme.palette.omnixys;
  const apple = theme.palette.apple;

  const router = useRouter();

  const [value, setValue] = useState("");
  const [type, setType] = useState<UnlockType>("ticket");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    if (!value.trim()) {
      setError("Please enter a valid ID.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const target =
      type === "ticket"
        ? `/ticket/${value}`
        : type === "invitation"
        ? `/invitation/${value}`
        : `/token/${value}`;

    router.push(target);
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 420,
        mx: "auto",
        mt: 6,
        borderRadius: 4,
        bgcolor:
          theme.palette.mode === "light"
            ? apple.systemBackground + "CC"
            : apple.secondarySystemBackground + "CC",
        border: `1px solid ${apple.separator}`,
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ color: omni.textPrimary, mb: 1 }}
      >
        Access without an account
      </Typography>

      <Typography sx={{ color: omni.textSecondary, opacity: 0.8, mb: 4 }}>
        View a ticket, invitation, or token without signing in.
      </Typography>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            bgcolor: omni.error + "11",
            color: omni.error,
            border: `1px solid ${omni.error}44`,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Type Select */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel sx={{ color: omni.textSecondary }}>Access type</InputLabel>
        <Select
          label="Access type"
          value={type}
          onChange={(e) => setType(e.target.value as UnlockType)}
          disabled={isSubmitting}
          sx={{
            borderRadius: 3,
            bgcolor: apple.systemBackground,
            color: omni.textPrimary,
          }}
        >
          <MenuItem value="ticket">Ticket</MenuItem>
          <MenuItem value="invitation">Invitation</MenuItem>
          <MenuItem value="token">Token</MenuItem>
        </Select>
      </FormControl>

      {/* ID Input */}
      <TextField
        fullWidth
        label="Enter ID"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isSubmitting}
        sx={{
          mb: 3,
          bgcolor: apple.systemBackground,
        }}
      />

      {/* Submit */}
      <Button
        fullWidth
        onClick={submit}
        disabled={isSubmitting}
        sx={{
          borderRadius: 3,
          py: 1.6,
          fontWeight: 700,
          color: omni.primary,
          border: `1px solid ${omni.primary}66`,
          bgcolor: omni.primary + "11",
          "&:hover": {
            bgcolor: omni.primary + "22",
          },
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={22} sx={{ color: omni.primary }} />
        ) : (
          "Open"
        )}
      </Button>

      {/* Back */}
      <Box sx={{ mt: 3 }}>
        <Link href="/checkpoint/" style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            sx={{
              color: omni.textSecondary,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Back to home
          </Typography>
        </Link>
      </Box>
    </Box>
  );
}
