import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import VerifyPageClient from "./verifyPageClient";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Verify your access",
  description: "Confirm your email and activate your secure event access.",

  page: "verify-guest",

  /**
   * CRITICAL:
   * Prevent indexing and crawling
   */
  robots: {
    index: false,
    follow: false,
  },

  /**
   * OpenGraph intentionally minimal
   * → avoid leaking invitation context
   */
  openGraph: {
    title: "Verify access",
    description: "Secure verification required.",
    image: "/og-secure.png",
  },
});

export default function LoginPage(): JSX.Element {
  return (
    <>
      {/* <AppleNavBar title="Login" /> */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          paddingTop: "2rem",
        }}
      >
        <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
          <VerifyPageClient />
        </Suspense>
      </div>
    </>
  );
}
