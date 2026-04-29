import { createNavigation } from "@/checkpoint/components/layout/navigation.config";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import { TourStep } from "@/checkpoint/providers/TourProvider";

type BuildTourParams = {
  role: UserRoleType;
  activeEvent?: any;
  t: (key: any) => string;
};

function buildNavDescription(tourId: string, t: any): string {
  const map: Record<string, string> = {
    "sidebar.home": t("tour.home") ?? "Übersicht über dein Event",
    "sidebar.notifications":
      t("tour.notifications") ?? "Benachrichtigungen verwalten",
    "sidebar.scanner": t("tour.scanner") ?? "QR Codes scannen",
    "sidebar.event": t("tour.eventPage") ?? "Event Details",
    "sidebar.invitations": t("tour.invitations") ?? "Einladungen verwalten",
    "sidebar.seats": t("tour.seats") ?? "Sitzplätze verwalten",
    "sidebar.guests": t("tour.guests") ?? "Alle Gäste anzeigen",
    "sidebar.tickets": t("tour.tickets") ?? "Tickets verwalten",
    "sidebar.profile": t("tour.profile") ?? "Dein Profil",
    "sidebar.myTicket": t("tour.myTicket") ?? "Dein Ticket",
    "sidebar.mySeat": t("tour.mySeat") ?? "Dein Sitzplatz",
    "sidebar.plusOnes": t("tour.plusOnes") ?? "Begleitpersonen",
  };

  return map[tourId] ?? "";
}

export function buildTour({ role, activeEvent, t }: BuildTourParams) {
  const steps: TourStep[] = [];

  const hasEvent = Boolean(activeEvent);

  // 🚨 STEP 1: EVENT SELECTOR (PRECONDITION)
  if (!hasEvent) {
    steps.push({
      id: "event-selector",
      target: "event.selector",
      title: t("tour.event.title") ?? "Event auswählen",
      description:
        t("tour.event.description") ??
        "Wähle zuerst ein Event aus, um fortzufahren",
      allowInteraction: true,
    });

    // ❗ WICHTIG: keine weiteren Steps ohne Event
    return steps;
  }

  // 🔥 NAVIGATION BASIERT
  const navItems = createNavigation(role, t, activeEvent?.id);

  const navSteps = navItems
    .filter((item) => item.tourId && !item.disabled)
    .map((item) => ({
      id: item.tourId!,
      target: item.tourId!,
      title: item.label,
      description: buildNavDescription(item.tourId!, t),
    }));

  steps.push(...navSteps);

  // 🔥 GLOBAL CONTROLS (immer am Ende)
  steps.push(
    {
      id: "ui.colorSwitcher",
      target: "ui.colorSwitcher",
      title: t("tour.color.title") ?? "Farbschema",
      description: t("tour.color.description") ?? "Passe die Farben der App an",
    },
    {
      id: "ui.themeToggle",
      target: "ui.themeToggle",
      title: t("tour.theme.title") ?? "Dark Mode",
      description:
        t("tour.theme.description") ?? "Wechsle zwischen hell und dunkel",
    },
    {
      id: "ui.language",
      target: "ui.language",
      title: t("tour.language.title") ?? "Sprache",
      description: t("tour.language.description") ?? "Ändere die Sprache",
    },
    {
      id: "ui.userMenu",
      target: "ui.userMenu",
      title: t("tour.user.title") ?? "Profil",
      description: t("tour.user.description") ?? "Einstellungen & Shortcuts",
    },
  );

  return steps;
}
