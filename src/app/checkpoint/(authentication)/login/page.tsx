"use client";

import React, { JSX } from "react";
import LoginForm from "./LoginForm";
import { AppleNavBar } from "@/components/apple/AppleNavBar";

export default function LoginPage(): JSX.Element {
  return (
    <>
      <AppleNavBar title="Login" />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          paddingTop: "2rem",
        }}
      >
        <LoginForm />
      </div>
    </>
  );
}
