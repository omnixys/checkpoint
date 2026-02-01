"use client";

import {
  GET_INVITATION_BY_ID,
  GET_PLUS_ONES_BY_INVITATION,
} from "@/graphql/invitation/invitation.query";
import {
  GetInvitationByIdRequest,
  GetInvitationByIdResult,
  GetPlusOnesByInvitationRequest,
  GetPlusOnesByInvitationResult,
} from "@/types/invitation/invitation-query.graphql.type";
import { getLogger } from "@/utils/logger";
import { useQuery } from "@apollo/client/react";
import { Box, CircularProgress, Stack, useTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AcceptForm from "./AcceptForm";
import DeclineDialog from "./DeclineDialog";
import FinalScreens from "./FinalScreens";
import InitialView from "./InitialView";
import InvalidInvitationDialog from "./InvalidInvitationDialog";
import InvitationAlreadyAcceptedDialog from "./InvitationAlreadyAcceptedDialog";
import InvitationAlreadyDeclinedDialog from "./InvitationAlreadyDeclinedDialog";
import MaybeDialog from "./MaybeDialog";

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
}: {
  invitationId: string;
}) {
  const logger = getLogger("RsvpContainer");
  const theme = useTheme();

  // local UI state
  const [screen, setScreen] = useState<RsvpScreen>("initial");
  const [invalidDialogOpen, setInvalidDialogOpen] = useState(false);

  // Data queries
  const {
    data: invitationData,
    loading: invitationLoading,
    error: invitationError,
    refetch: refetchInvitation,
  } = useQuery<GetInvitationByIdResult, GetInvitationByIdRequest>(
    GET_INVITATION_BY_ID,
    {
      variables: { invitationId },
      fetchPolicy: "network-only",
    }
  );

  const {
    data: plusOnesData,
    loading: plusOnesLoading,
    refetch: refetchPlusOnes,
  } = useQuery<GetPlusOnesByInvitationResult, GetPlusOnesByInvitationRequest>(
    GET_PLUS_ONES_BY_INVITATION,
    {
      variables: { invitationId },
      fetchPolicy: "network-only",
    }
  );

  // Derived data
  const invitation = useMemo(
    () => invitationData?.invitation ?? null,
    [invitationData]
  );
  const plusOnes = useMemo(
    () => plusOnesData?.getPlusOnesByInvitation ?? [],
    [plusOnesData]
  );

  /**
   * Validate invitation when loaded.
   */
  useEffect(() => {
    if (invitationLoading) return;

    logger.debug({ invitation, invitationError });

    if (!invitation || invitationError) {
      setInvalidDialogOpen(true);
      return;
    }

    // Invalid states:
    // - Declined
    // - Rejected
    // - Canceled
    // - Expired
    // - Not approved but requires approval
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
  }, [invitation, invitationLoading, invitationError]);

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
    await refetchInvitation();
    await refetchPlusOnes();
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
  if (invitationLoading || plusOnesLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "60vh" }}
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
    <Box sx={{ px: 2, py: 4, maxWidth: 800, mx: "auto" }}>
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
          plusOnes={plusOnes}
          refetchPlusOnes={refetchPlusOnes}
          onAccepted={handleAccepted}
          onBack={() => setScreen("initial")}
        />
      )}

      {screen === "accepted" && (
        <FinalScreens
          type="accepted"
          invitation={invitation}
          plusOnes={plusOnes}
        />
      )}

      {screen === "maybe" && (
        <MaybeDialog
          invitation={invitation}
          onBack={() => setScreen("initial")}
        />
      )}

      {screen === "decline-confirm" && (
        <DeclineDialog
          invitation={invitation}
          onConfirm={handleDeclined}
          onCancel={handleCancelDecline}
        />
      )}

      {screen === "declined" && (
        <FinalScreens type="declined" invitation={invitation} />
      )}

      {screen === "already-accepted" && (
        <InvitationAlreadyAcceptedDialog open={true} />
      )}
      {screen === "already-declined" && (
        <InvitationAlreadyDeclinedDialog open={true} />
      )}
    </Box>
  );
}
