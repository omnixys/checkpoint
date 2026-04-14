import React, { JSX, Suspense } from "react";
import LoginForm from "./LoginForm";
import { Skeleton } from "@mui/material";

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
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}
