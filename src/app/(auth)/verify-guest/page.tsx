import React, { JSX, Suspense } from "react";
import { Skeleton } from "@mui/material";
import VerifyPageClient from "./verifyPageClient";

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
        <Suspense
          fallback={<Skeleton variant="rectangular" width={210} height={118} />}
        >
          <VerifyPageClient />
        </Suspense>
      </div>
    </>
  );
}
