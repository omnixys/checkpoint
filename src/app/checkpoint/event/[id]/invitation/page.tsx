"use client";

import { Box, Stack } from "@mui/material";
import { useRef } from "react";

import BackToTopButton from "@/components/invitationList/button/BackToTopButton";
import InvitationCardView from "@/components/invitationList/cards/InvitationCardView";
import BulkSendInvitationDialog from "@/components/invitationList/dialogs/BulkSendInvitationDialog";
import InvitationCreateDialog from "@/components/invitationList/dialogs/InvitationCreateDialog";
import InvitationDetailDialog from "@/components/invitationList/dialogs/InvitationDetailDialog";
import InvitationImportDialog from "@/components/invitationList/dialogs/InvitationImportDialog";
import {
  UseInvitationLogicReturn,
  useInvitationLogic,
} from "@/components/invitationList/hooks/useInvitationLogic";
import { useScrollHeader } from "@/components/invitationList/hooks/useScrollHeader";
import { useScrollTopButton } from "@/components/invitationList/hooks/useScrollTopButton";
import InvitationActionsMobile from "@/components/invitationList/InvitationActionsMobile";
import InvitationBulkBar from "@/components/invitationList/InvitationBulkBar";
import InvitationHeaderBar from "@/components/invitationList/InvitationHeaderBar";
import InvitationTable from "@/components/invitationList/InvitationTable";
import { useDevice } from "@/providers/DeviceProvider";
import { useParams } from "next/navigation";

export type InvitationLogicProp = {
  logic: UseInvitationLogicReturn;
};

export default function InvitationsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { id: eventId } = useParams();
  const { isMobile, isTablet } = useDevice();

  const logic: UseInvitationLogicReturn = useInvitationLogic(eventId as string);

  const { collapsed, visible, progress, glassOpacity } =
    useScrollHeader(scrollRef);
  const { visible: showTopBtn } = useScrollTopButton();

  const useCards = isMobile || isTablet;

  return (
    <Stack
      ref={scrollRef}
      spacing={4}
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        pb: 6,
        position: "relative",

        height: "100vh", // 🔥 WICHTIG
        overflowY: "auto", // 🔥 WICHTIG
        overscrollBehavior: "contain",
      }}
    >
      {/* VisionOS Header */}
      <InvitationHeaderBar
        logic={logic}
        scroll={{ collapsed, visible, progress, glassOpacity }}
        scrollRef={scrollRef}
      />

      {/* MAIN CONTENT */}
      <Box>
        {useCards ? (
          <InvitationCardView logic={logic} />
        ) : (
          <InvitationTable logic={logic} />
        )}
      </Box>

      <InvitationDetailDialog logic={logic} />

      {/* Floating Bulk Bar */}
      <InvitationBulkBar logic={logic} />

      {/* Mobile Actions */}
      {useCards && <InvitationActionsMobile logic={logic} />}

      {/* DIALOGS */}
      <InvitationCreateDialog logic={logic} />
      <InvitationImportDialog logic={logic} />
      <BulkSendInvitationDialog logic={logic} />

      {/* Floating scroll up button */}
      <BackToTopButton visible={showTopBtn} />
    </Stack>
  );
}
