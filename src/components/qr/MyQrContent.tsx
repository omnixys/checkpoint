"use client";

import { Alert, Box, CircularProgress, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useMemo } from "react";
import QrCard from "@/checkpoint/components/qr/QrCard";
import NoTicket from "@/checkpoint/components/utils/NoTicket";
import useMyTicketQuery from "@/checkpoint/hooks/ticket/useMyTicketQuery";
import { useTypedTranslations } from "@/checkpoint/i18n/useTypedTranslations";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";

const MotionBox = motion.create(Box);

export default function MyQrContent() {
  const theme = useTheme();
  const tQr = useTypedTranslations("qr");
  const { activeEvent } = useActiveEvent();

  const {
    fullTicketEventIdMap,
    myFullTicketListLoading,
    myFullTicketListError,
    myFullTicketListRefetch,
  } = useMyTicketQuery({
    eventId: activeEvent?.id,
    loadMyFullTicketList: true,
  });

  const ticket = useMemo(() => {
    if (!fullTicketEventIdMap || !activeEvent) {
      return null;
    }

    return fullTicketEventIdMap.get(activeEvent.id) ?? null;
  }, [fullTicketEventIdMap, activeEvent]);

  if (!activeEvent) {
    return null;
  }

  if (myFullTicketListLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          px: 2,
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {tQr("loading")}
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (myFullTicketListError) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3 }, py: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: alpha(theme.palette.error.main, 0.32),
            backgroundColor: alpha(theme.palette.error.main, 0.09),
          }}
        >
          {tQr("loadError")}
        </Alert>
      </Box>
    );
  }

  if (!ticket) {
    return <NoTicket eventId={activeEvent.id} eventName={activeEvent.name} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        background: `radial-gradient(circle at top, ${alpha(
          theme.palette.primary.main,
          0.14,
        )}, ${alpha(theme.palette.background.default, 0)} 44%), ${theme.palette.background.default}`,
      }}
    >
      <Stack
        spacing={3}
        sx={{ width: "100%", maxWidth: theme.spacing(108), mx: "auto", minWidth: 0 }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 4,
            border: 1,
            borderColor: alpha(theme.palette.divider, 0.62),
            backgroundColor: alpha(theme.palette.background.paper, 0.56),
            backdropFilter: "blur(24px) saturate(150%)",
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 900,
              lineHeight: 1.1,
              overflowWrap: "anywhere",
            }}
          >
            {tQr("title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mt: 0.75,
            }}
          >
            {tQr("subtitle")}
          </Typography>
        </MotionBox>

        <QrCard
          ticket={ticket}
          event={activeEvent}
          onActivated={() => {
            void myFullTicketListRefetch();
          }}
        />
      </Stack>
    </Box>
  );
}
