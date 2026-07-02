"use client";

import InvitationBulkApproveDialog from "@/checkpoint/components/invitation/dialogs/InvitationBulkApproveDialog";
import InvitationBulkSendDialog from "@/checkpoint/components/invitation/dialogs/InvitationBulkSendDialog";
import InvitationCreateDialog from "@/checkpoint/components/invitation/dialogs/InvitationCreateDialog";
import InvitationDetailDialog from "@/checkpoint/components/invitation/dialogs/InvitationDetailDialog";
import InvitationDetailMobileDialog from "@/checkpoint/components/invitation/dialogs/InvitationDetailMobileDialog";
import InvitationImportDialog from "@/checkpoint/components/invitation/dialogs/InvitationImportDialog";
import InvitationContent from "@/checkpoint/components/invitation/InvitationContent";
import InvitationHeader from "@/checkpoint/components/invitation/InvitationHeader";
import BackToTopButton from "@/checkpoint/components/utils/BackToTopButton";
import PullToRefresh from "@/checkpoint/components/utils/PullToRefresh";
import {
  InvitationLogic,
  useInvitationLogic,
} from "@/checkpoint/hooks/invitation/useInvitationLogic";
import { useScrollTopButton } from "@/checkpoint/hooks/invitation/useScrollTopButton";
import { useScrollHeader } from "@/checkpoint/hooks/useScrollHeader";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import { useRef } from "react";

/* ---------------------------------------------------------------------------
 * Invitations Page (REFactored)
 * - Header Factory
 * - Scroll Driven UI
 * - Clean separation
 * ------------------------------------------------------------------------- */
export default function InvitationClientPage({ countries }: { countries: CallingCodeCountry[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const logic: InvitationLogic = useInvitationLogic(id as string);
  const scroll = useScrollHeader({
    scrollRef,
  });
  const { visible } = useScrollTopButton();

  return (
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
    </Box>
  );
}
