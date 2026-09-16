import { Box, Skeleton } from "@mui/material";
import { type JSX, Suspense } from "react";
import LegalFooter from "@/checkpoint/components/layout/LegalFooter";
import {
  GetAllCallingCodesDocument,
  type GetAllCallingCodesQuery,
  type GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
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

export default async function LoginPage(): Promise<JSX.Element> {
  const client = await createServerClient();

  const res = await client.query<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>({
    query: GetAllCallingCodesDocument,
    fetchPolicy: "cache-first",
  });

  const callingCodeCountries: CallingCodeCountry[] =
    res?.data?.getAllCountries.map((c) => ({
      iso2: c.iso2,
      name: c.name,
      flagSvg: c.flagSvg,
      callingCode: c.callingCode?.code ?? null,
    })) ?? [];

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
          <LoginForm callingCodeCountries={callingCodeCountries} />
        </Suspense>
      </Box>
      <LegalFooter />
    </Box>
  );
}
