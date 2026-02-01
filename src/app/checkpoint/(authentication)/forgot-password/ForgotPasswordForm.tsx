"use client";

import { JSX, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { SEND_PASSWORD_RESET_EMAIL } from "./graphql";
import { handleGraphQLError } from "../../../../utils/graphqlHandler.error";

export default function ForgotPasswordForm(): JSX.Element {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [showPw, setShowPw] = useState(false);

  const [sendMail, { loading }] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
    onError: (apolloError) => {
      const message = handleGraphQLError(
        apolloError,
        "Something went wrong. Please try again later."
      );
      
      if (message === "User not found") { setError(`No account found for email "${email}".`); return}

      setError("Something went wrong. Please try again later.");
    },
    onCompleted: () => {
      setSubmitted(true);
    },
  });

  const submit = async (): Promise<void> => {
    setError(null);

    try {
      await sendMail({
        variables: {
          input: {
            email,
            resetUrl: `${window.location.origin}/password-reset`,
          },
        },
      });
    } catch {
      // handled by onError
    }
  };

  return (
    <Box maxWidth={420} mx="auto">
      <Typography variant="h5" mb={2}>
        Forgot your password?
      </Typography>

      {submitted ? (
        <Stack spacing={3}>
          <Alert severity="success">
            A password reset link was sent.
            Please check your inbox.
          </Alert>

          <Button
            variant="text"
            onClick={() => router.push("/login")}
          >
            ← Back to login
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email address"
            type="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />

          <Button
            variant="contained"
            onClick={submit}
            disabled={loading || !email}
          >
            Send reset email
          </Button>

          <Button
            variant="text"
            onClick={() => router.push("/login")}
          >
            ← Back to login
          </Button>
        </Stack>
      )}
    </Box>
  );
}
