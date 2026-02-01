import ErrorView from "@/components/ui/ErrorView";

export default function NotFoundPage() {
  return (
    <ErrorView
      title="Seite nicht gefunden"
      message="Die angeforderte Seite existiert nicht oder wurde verschoben."
      actions={[
        { href: "/checkpoint/", label: "Zur Startseite", variant: "contained" },
        // { href: "/login", label: "Zum Dashboard", variant: "outlined" },
      ]}
    />
  );
}
