"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { initializeBrowserTracing } from "@omnixys/observability-ts/browser";

// Bootstrap OTel for the fallback error page so we can capture the crash
initializeBrowserTracing({
  enabled: process.env.NODE_ENV === "production",
  serviceName: "checkpoint-web",
  sampleRate: 1.0,
  instrumentations: [],
}).catch(() => {});

export default function GlobalError({ error }: { readonly error: Error & { digest?: string } }) {
  useEffect(() => {
    // Log to console as fallback; the browser tracer may not be fully initialized
    console.error("[global-error]", error.message);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
