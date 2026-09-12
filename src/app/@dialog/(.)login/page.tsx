"use client";

import type { JSX } from "react";
import LoginDialog from "@/checkpoint/components/auth/LoginDialog";

/**
 * Intercepts client-side navigation to `/login`: instead of leaving the
 * current page, the login dialog is shown via the `@dialog` parallel route.
 * Hard navigation / refresh continues to serve the full login page.
 */
export default function LoginDialogPage(): JSX.Element {
  return <LoginDialog />;
}
