import ErrorView from "@/checkpoint/components/ErrorView";
import { env } from "@/checkpoint/lib/env";

export default function NotFoundPage() {
  return (
    <ErrorView
      title="Seite nicht gefunden"
      message="Die angeforderte Seite existiert nicht oder wurde verschoben."
      actions={[
        { href: env.CHECKPOINT_BASE_PATH, label: "Zur Startseite", variant: "contained" },
        // { href: "/login", label: "Zum Dashboard", variant: "outlined" },
      ]}
    />
  );
}
