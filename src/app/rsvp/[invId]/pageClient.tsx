"use client";

import { useParams } from "next/navigation";
import RsvpContainer from "@/checkpoint/components/rsvp/RsvpContainer";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { getLogger } from "@/checkpoint/utils/logger";

/**
 * Main RSVP Page Entry
 * - Extracts invitationId from URL
 * - Delegates all logic/UI to <RsvpContainer />
 */
export default function RsvpPageClient({
  callingCodeCountry,
}: {
  callingCodeCountry: CallingCodeCountry[];
}) {
  const t = useTypedTranslations("rsvp");
  const _logger = getLogger("RsvpPage");

  const { invId } = useParams<{ invId: string }>();

  if (!invId) {
    return (
      <div
        style={{
          padding: "64px",
          textAlign: "center",
          fontSize: "1.2rem",
        }}
      >
        {t("invalidInvitationLink")}
      </div>
    );
  }

  return <RsvpContainer invitationId={invId} callingCodeCountry={callingCodeCountry} />;
}
