"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import RouteGuard from "@/checkpoint/components/guard/RouteGuard";
import InvitationBulkApproveDialog from "@/checkpoint/components/invitation/dialogs/InvitationBulkApproveDialog";
import InvitationBulkSendDialog from "@/checkpoint/components/invitation/dialogs/InvitationBulkSendDialog";
import InvitationCreateDialog from "@/checkpoint/components/invitation/dialogs/InvitationCreateDialog";
import InvitationDetailDialog from "@/checkpoint/components/invitation/dialogs/InvitationDetailDialog";
import InvitationDetailMobileDialog from "@/checkpoint/components/invitation/dialogs/InvitationDetailMobileDialog";
import InvitationImportDialog from "@/checkpoint/components/invitation/dialogs/InvitationImportDialog";
import InvitationResendDialog from "@/checkpoint/components/invitation/dialogs/InvitationResendDialog";
import InvitationContent from "@/checkpoint/components/invitation/InvitationContent";
import InvitationHeader from "@/checkpoint/components/invitation/InvitationHeader";
import BackToTopButton from "@/checkpoint/components/utils/BackToTopButton";
import {
  type InvitationLogic,
  useInvitationLogic,
} from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useScrollTopButton } from "@/checkpoint/hooks/invitation/useScrollTopButton";
import { useScrollHeader } from "@/checkpoint/hooks/useScrollHeader";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import type { CallingCodeCountry } from "@/checkpoint/types/country.type";

/* ---------------------------------------------------------------------------
 * Invitations Page (REFactored)
 * - Header Factory
 * - Scroll Driven UI
 * - Clean separation
 * ------------------------------------------------------------------------- */
export default function InvitationClientPage({ countries }: { countries: CallingCodeCountry[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams<{ id: string }>();
  const { activeEventId, selectEvent } = useActiveEvent();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && id !== activeEventId) {
      selectEvent(id);
    }
  }, [activeEventId, id, selectEvent]);

  const logic: InvitationLogic = useInvitationLogic(id as string);
  const scroll = useScrollHeader({
    scrollRef,
  });
  const { visible } = useScrollTopButton();

  return (
    <RouteGuard featureId="invitations">
      <Box
        ref={scrollRef}
        sx={{
          height: "100dvh",
          overflowY: "auto",
          position: "relative",
          width: "100%",
          background: theme.palette.background.default,
        }}
      >
        {/* HEADER */}
        <InvitationHeader logic={logic} scroll={scroll} />

        {/* CONTENT */}
        {/* <PullToRefresh onReload={logic.reload}> */}
        <Box sx={{ px: { xs: 1.5, md: 3 }, pb: 12, pt: isMobile ? 3 : 0, minWidth: 0 }}>
          <InvitationContent logic={logic} isMobile={isMobile} />
        </Box>
        {/* </PullToRefresh> */}

        {/* FLOATING ELEMENTS */}
        <BackToTopButton visible={visible} />

        {/* DIALOGS */}
        <InvitationCreateDialog logic={logic} callingCodeCountries={countries} />
        <InvitationImportDialog logic={logic} />
        <InvitationBulkSendDialog logic={logic} />
        <InvitationBulkApproveDialog logic={logic} />

        {logic.activeInvitation && isMobile ? (
          <InvitationDetailMobileDialog logic={logic} />
        ) : (
          <InvitationDetailDialog logic={logic} />
        )}

        <InvitationResendDialog logic={logic} />
      </Box>
    </RouteGuard>
  );
}
