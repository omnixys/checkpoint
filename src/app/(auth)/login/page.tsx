import React, { JSX, Suspense } from "react";
import LoginForm from "./LoginForm";
import { Skeleton } from "@mui/material";
import { Metadata } from "next";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";

export const metadata = buildMetadata({
  title: "Login",
  description: "Access your event dashboard securely.",

  page: "login",

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Login",
    description: "Secure access to your event dashboard.",
  },
});
export default function LoginPage(): JSX.Element {
  return (
    <Suspense
      fallback={<Skeleton variant="rectangular" width="100%" height="100vh" />}
    >
      <LoginForm />
    </Suspense>
  );
}
