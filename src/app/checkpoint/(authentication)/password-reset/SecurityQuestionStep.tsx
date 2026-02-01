"use client";

import { JSX, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_SECURITY_QUESTIONS, VERIFY_SECURITY_QUESTIONS } from "./graphql";
import { handleGraphQLError } from "@/utils/graphqlHandler.error";
import { motion } from "framer-motion";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";

type Props = {
  onSuccess: () => void;
  setId: (id: string) => void
};

const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: { duration: 0.45 },
  },
};


export function getResetToken(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get("token");
}

export default function SecurityQuestionStep({
  onSuccess,
  setId,
}: Props): JSX.Element {
  const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
      const [showPw, setShowPw] = useState(false);
  
  const { data, loading } = useQuery(GET_SECURITY_QUESTIONS);
  const [verify, { loading: verifying }] = useMutation(
    VERIFY_SECURITY_QUESTIONS, {
        onError: (apolloError) => {
          const message = handleGraphQLError(
            apolloError,
            "Something went wrong. Please try again later."
          );
          
          if (message === "Exactly 3 answers required") {
            setError(`You have to answer all Questions!.`);
            return;
          }
    
          setError("Something went wrong. Please try again later.");
        },
        onCompleted: () => {
          setSubmitted(true);
        },
      });


  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);


  if (loading) {
    return <CircularProgress />;
  }

  const submit = async (): Promise<void> => {
    const payload = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const res = await verify({
      variables: { answers: payload },
    });

    const result = res.data?.verifySecurityQuestionsAndResetPassword;

     if (!result) {
       setError("Something went wrong. Please try again.");
       return;
     }

     if (!result.success) {
       if (result.lockedUntil) {
         setLockedUntil(new Date(result.lockedUntil));
         setError(
           "Too many failed attempts. Your account is temporarily locked."
         );
         return;
       }

       setError("One or more answers were incorrect. Please try again.");
       return;
     }

    if (result?.success && result.userId) {
      setId(result.userId);
      onSuccess();
    }
    
  };



  return (
    <Box maxWidth={480} mx="auto">
      <Typography variant="h5" mb={2}>
        Verify your identity
      </Typography>

      {error && (
        <motion.div {...shakeAnimation}>
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
              Verification failed
            </Typography>

            <Typography
              fontSize={14}
              sx={{ mt: 0.5, opacity: 0.9, color: "#fff" }}
            >
              {error}
            </Typography>

            {lockedUntil && (
              <Typography fontSize={13} sx={{ mt: 1, opacity: 0.75 }}>
                Locked until <strong>{lockedUntil.toLocaleTimeString()}</strong>
              </Typography>
            )}
          </Box>
        </motion.div>
      )}

      <motion.div
        animate={error ? "animate" : "initial"}
        variants={shakeAnimation}
      >
        <Stack spacing={2}>
          {data?.getSecurityVerificationQuestions?.map((q: any) => (
            <TextField
              key={q.id}
              label={q.question}
              type={showPw ? "text" : "password"}
              error={!!error}
              InputProps={{
                sx: { borderRadius: "14px" },
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRoundedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw((p) => !p)} edge="end">
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [q.id]: e.target.value,
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backdropFilter: "blur(12px)",
                  transition: "border-color 0.2s ease",
                },
                "& .MuiOutlinedInput-root.Mui-error fieldset": {
                  borderColor: "rgba(255,59,48,0.7)",
                },
              }}
            />
          ))}
          <Button variant="contained" onClick={submit} disabled={verifying}>
            Verify
          </Button>
          <Button
            variant="text"
            onClick={() => router.push("/login")}
          >
            ← Back to login
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
}
