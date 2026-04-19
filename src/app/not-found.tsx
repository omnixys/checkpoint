"use client";

import ErrorView from "@/checkpoint/components/ErrorView";
import { env } from "@/checkpoint/lib/env";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";

export default function NotFoundPage() {
  const t = useTypedTranslations('error');

  return (
    <ErrorView
      title={t("notFound.title")}
      message={t("notFound.message")}
      actions={[
        {
          href: env.CHECKPOINT_BASE_PATH,
          label: t("notFound.actions.home"),
          variant: "contained",
        },
      ]}
    />
  );
}
