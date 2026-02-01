// /app/(auth)/signup/page.tsx
"use client";

import { AppleLoadingOverlay } from "@/components/apple/AppleLoadingOverlay";
import { useAuth } from "@//providers/AuthProvider";
import { UserSignUpInput } from "@/types/authentication/auth-input.type";
import {
  SignUpStep1,
  SignUpStep2Item,
  SignUpStep3,
} from "@/types/authentication/auth.type";
import { AuthManager } from "@/utils/AuthManager";
import { AppleNavBar } from "@/components/apple/AppleNavBar";
import { Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { AppleProgress } from "./signup.style";
import { SlideTransition } from "./SlideTransition";
import { Step1UserInfo } from "./Step1UserInfo";
import { Step2Phones } from "./Step2Phones";
import { Step3Password } from "./Step3Password";

/* -----------------------------------------------------------
 * Maps frontend objects to API-compliant input
 * ----------------------------------------------------------- */
function mapFrontendToApiInput(input: UserSignUpInput) {
  return {
    username: input.username,
    email: input.email,
    password: input.password,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneNumbers: input.phoneNumbers?.map((p) => ({
      type: p.type,
      number: p.number,
      isPrimary: p.isPrimary,
    })),
  };
}

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  // Step number
  const [step, setStep] = useState<number>(1);

  // Step 1 – Identity
  const [step1, setStep1] = useState<SignUpStep1>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  // Step 2 – Phones
  const [phones, setPhones] = useState<SignUpStep2Item[]>([]);

  // Step 3 – Password
  const [step3, setStep3] = useState<SignUpStep3>({
    password: "",
    passwordConfirm: "",
  });

  /* -----------------------------------------------------------
   * SIGN UP handler (final step)
   * ----------------------------------------------------------- */
  async function handleSignUp(): Promise<void> {
    setLoading(true);

    try {
      const input: UserSignUpInput = {
        ...step1,
        password: step3.password,
        phoneNumbers: phones,
      };

      const apiInput = mapFrontendToApiInput(input);

      // Call central AuthManager
      await AuthManager.signup(apiInput);

      // Optional: Auto-login after signup
      await AuthManager.login({
        username: step1.username,
        password: step3.password,
      });

      // Refetch user in global state
      await auth.refetchMe();

      router.push("/checkpoint/");
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  }

  /* Step Navigation */
  const next = (): void => setStep((s) => Math.min(3, s + 1));
  const prev = (): void => setStep((s) => Math.max(1, s - 1));

  return (
    <Box sx={{ p: 2 }}>
      <AppleNavBar title="Registrieren" onBack={() => router.push("/checkpoint/")} />

      {/* Top progress bar (iOS style) */}
      <AppleProgress step={step} total={3} />

      <Stack spacing={4} mt={4}>
        <SlideTransition step={step}>
          <>
            {step === 1 && (
              <Step1UserInfo value={step1} onChange={setStep1} onNext={next} />
            )}

            {step === 2 && (
              <Step2Phones
                phones={phones}
                onChange={setPhones}
                onNext={next}
                onBack={prev}
              />
            )}

            {step === 3 && (
              <Step3Password
                value={step3}
                onChange={setStep3}
                onBack={prev}
                onFinish={handleSignUp}
              />
            )}
          </>
        </SlideTransition>
      </Stack>

      {/* Global Loading Overlay */}
      <AppleLoadingOverlay show={loading} />
    </Box>
  );
}
