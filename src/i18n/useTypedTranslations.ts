/** biome-ignore-all lint/suspicious/noExplicitAny: any in use */
"use client";

import { useTranslations } from "next-intl";
import type { Messages } from "./messages";
import type { NamespaceKeys } from "./typed";

export function useTypedTranslations<N extends keyof Messages>(namespace: N) {
  const t = useTranslations(namespace as string);

  return <K extends NamespaceKeys<N>>(key: K, values?: Record<string, any>) =>
    t(key as string, values);
}
