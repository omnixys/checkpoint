import type React from "react";

export function useRouter() {
  return {
    back: () => undefined,
    push: () => undefined,
    replace: () => undefined,
    prefetch: () => undefined,
  };
}
