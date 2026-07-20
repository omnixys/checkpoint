"use client";

// TODO implementen optimistic fetch

import { Box, CircularProgress, Stack, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import AcceptForm from "@/checkpoint/components/rsvp/AcceptForm";
import DeclineDialog from "@/checkpoint/components/rsvp/dialog/DeclineDialog";
import InvalidInvitationDialog from "@/checkpoint/components/rsvp/dialog/InvalidInvitationDialog";
import InvitationAlreadyAcceptedDialog from "@/checkpoint/components/rsvp/dialog/InvitationAlreadyAcceptedDialog";
import InvitationAlreadyDeclinedDialog from "@/checkpoint/components/rsvp/dialog/InvitationAlreadyDeclinedDialog";
import MaybeDialog from "@/checkpoint/components/rsvp/dialog/MaybeDialog";
import FinalScreens from "@/checkpoint/components/rsvp/FinalScreens";
import InitialView from "@/checkpoint/components/rsvp/InitialView";
import RsvpSupportChat from "@/checkpoint/components/support/chat/RsvpSupportChat";
import useInvitationQuery from "@/checkpoint/hooks/invitation/useInvitationQuery";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { getLogger } from "@/checkpoint/utils/logger";

/**
 * RSVP State Machine
 */
type RsvpScreen =
  | "initial"
  | "accept-form"
  | "accepted"
  | "maybe"
  | "decline-confirm"
  | "declined"
  | "already-accepted"
  | "already-declined";

/**
 * Main container orchestrating all RSVP logic.
 */
export default function RsvpContainer({
  invitationId,
  callingCodeCountry,
}: {
  invitationId: string;
  callingCodeCountry: CallingCodeCountry[];
}) {
  const logger = getLogger("RsvpContainer");
  const _theme = useTheme();

  // local UI state
  const [screen, setScreen] = useState<RsvpScreen>("initial");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);

  const { invitation, invitationError, invitationLoading, invitationRefetch } = useInvitationQuery({
    invitationId,
    loadInvitation: true,
  });

  /**
   * Validate invitation when loaded.
   */
  useEffect(() => {
    if (invitationLoading) {
      return;
    }

    logger.debug({ invitation, invitationError });

    if (!invitation || invitationError) {
      setInvalidDialogOpen(true);
      return;
    }

    const status = invitation?.status;
    // const requiresApproval = invitation.approved === false;

    // if (requiresApproval) {
    //   // not yet approved
    //   setInvalidDialogOpen(true);
    //   return;
    // }

    // ⛔ special cases
    if (status === "ACCEPTED") {
      setScreen("already-accepted");
      return;
    }

    if (status === "DECLINED") {
      setScreen("already-declined");
      return;
    }

    const invalidStatuses = ["REJECTED", "CANCELED", "EXPIRED"];

    if (invalidStatuses.includes(status)) {
      setInvalidDialogOpen(true);
      return;
    }
  }, [invitation, invitationLoading, invitationError, logger.debug]);

  /**
   * Handle Maybe
   */
  const handleMaybe = () => {
    setScreen("maybe");
  };

  /**
   * Handle Decline (confirmation open)
   */
  const handleDecline = () => {
    setScreen("decline-confirm");
  };

  /**
   * Handle Back from Decline cancel
   */
  const handleCancelDecline = () => {
    setScreen("initial");
  };

  /**
   * On success of Accept RSVP
   */
  const handleAccepted = async () => {
    await invitationRefetch();
    setScreen("accepted");
  };

  /**
   * On success of Decline RSVP
   */
  const handleDeclined = () => {
    setScreen("declined");
  };

  /**
   * Loading state
   */
  if (invitationLoading || !invitation) {
    return (
      <Stack
        sx={{
          minHeight: "60vh",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  /**
   * Invalid Invitation → Adaptive Dialog
   */
  if (invalidDialogOpen) {
    return <InvalidInvitationDialog open={true} />;
  }

  /**
   * Render State Machine
   */
  return (
    <Box sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 3, sm: 4 }, maxWidth: 800, mx: "auto" }}>
      <RsvpSupportChat
        eventId={invitation.eventId}
        guestName={`${invitation.firstName ?? ""} ${invitation.lastName ?? ""}`.trim()}
        invitationId={invitation.id}
      />
      {screen === "initial" && (
        <InitialView
          invitation={invitation}
          onAccept={() => setScreen("accept-form")}
          onMaybe={handleMaybe}
          onDecline={handleDecline}
        />
      )}

      {screen === "accept-form" && (
        <AcceptForm
          invitation={invitation}
          onAccepted={handleAccepted}
          countries={callingCodeCountry}
        />
      )}

      {screen === "accepted" && <FinalScreens type="accepted" invitation={invitation} />}

      {screen === "maybe" && (
        <MaybeDialog invitationId={invitation.id} onBack={() => setScreen("initial")} />
      )}

      {screen === "decline-confirm" && (
        <DeclineDialog
          invitation={invitation}
          onConfirm={handleDeclined}
          onCancel={handleCancelDecline}
        />
      )}

      {screen === "declined" && <FinalScreens type="declined" invitation={invitation} />}

      {screen === "already-accepted" && <InvitationAlreadyAcceptedDialog open={true} />}
      {screen === "already-declined" && <InvitationAlreadyDeclinedDialog open={true} />}
    </Box>
  );
}
