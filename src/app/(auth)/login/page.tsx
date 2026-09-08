import { Box, Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import LegalFooter from "@/checkpoint/components/layout/LegalFooter";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import LoginForm from "./LoginForm";

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100svh",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: { xs: "center", lg: "stretch" },
          justifyContent: { xs: "center", lg: "stretch" },
        }}
      >
        <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="100vh" />}>
          <LoginForm />
        </Suspense>
      </Box>
      <LegalFooter />
    </Box>
  );
}
