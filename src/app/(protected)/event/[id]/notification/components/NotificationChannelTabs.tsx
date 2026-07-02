"use client";

import { Box, Chip, Stack, Typography, alpha, useTheme } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { NotificationChannel } from "../types/notification-channel.enum";
import { JSX } from "react";
import { getNotificationTone } from "@/checkpoint/app/(protected)/event/[id]/notification/themes/notificationTheme";

type Props = {
  value: NotificationChannel;
  onChange: (value: NotificationChannel) => void;
};

const MotionDiv = motion.div;

export function NotificationChannelTabs({ value, onChange }: Props) {
  const theme = useTheme();
  const activeTone = getNotificationTone(theme, value);

  const channelMeta: Record<
    NotificationChannel,
    {
      label: string;
      description: string;
      icon: JSX.Element;
    }
  > = {
    [NotificationChannel.WHATSAPP]: {
      label: "WhatsApp",
      description: "Direct customer communication",
      icon: <ChatRoundedIcon fontSize="small" />,
    },
    [NotificationChannel.IN_APP]: {
      label: "In-App",
      description: "System workflows and collaboration",
      icon: <AppsRoundedIcon fontSize="small" />,
    },
    [NotificationChannel.EMAIL]: {
      label: "Mail",
      description: "Executive and business correspondence",
      icon: <MailRoundedIcon fontSize="small" />,
    },
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        pt: 2.25,
        pb: 2,
        borderBottom: `1px solid ${activeTone.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              letterSpacing: 0,
              overflowWrap: "anywhere",
            }}
          >
            Notification Center
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              color: alpha(theme.palette.text.primary, 0.64),
            }}
          >
            Omnichannel communication workspace
          </Typography>
        </Box>

        <Chip
          label="Workspace"
          sx={{
            color: theme.palette.text.primary,
            borderRadius: 999,
            border: `1px solid ${activeTone.cardBorder}`,
            backgroundColor: theme.palette.extended.surface.level3,
          }}
        />
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          gap: 1.25,
          mt: 2.25,
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {Object.values(NotificationChannel).map((channel) => {
          const meta = channelMeta[channel];
          const active = value === channel;
          const tone = getNotificationTone(theme, channel);

          return (
            <Box
              key={channel}
              onClick={() => onChange(channel)}
              sx={{
                minWidth: 0,
                flex: 1,
                flexBasis: { xs: "100%", sm: 0 },
                cursor: "pointer",
              }}
            >
              <MotionDiv
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.995 }}
                transition={{ duration: 0.16 }}
              >
                <Box
                  sx={{
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    border: `1px solid ${active ? tone.cardBorderSelected : tone.cardBorder}`,
                    backgroundColor: active ? tone.cardBgSelected : tone.cardBg,
                    transition: "all 160ms ease",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.25,
                    }}
                  >
                    <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: 2,
                          display: "grid",
                          placeItems: "center",
                          color: active ? tone.accent : theme.palette.text.primary,
                          backgroundColor: active
                            ? alpha(tone.accent, 0.14)
                            : alpha(theme.palette.common.white, 0.04),
                          border: `1px solid ${active ? tone.accentBorder : tone.cardBorder}`,
                          flexShrink: 0,
                        }}
                      >
                        {meta.icon}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                            lineHeight: 1.15,
                          }}
                        >
                          {meta.label}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: alpha(theme.palette.text.primary, 0.58),
                          }}
                        >
                          {meta.description}
                        </Typography>
                      </Box>
                    </Stack>

                    <AnimatePresence mode="wait">
                      {active ? (
                        <MotionDiv
                          key="active"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ duration: 0.16 }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: tone.accent,
                            }}
                          />
                        </MotionDiv>
                      ) : (
                        <MotionDiv
                          key="inactive"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: alpha(theme.palette.text.primary, 0.16),
                            }}
                          />
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </Stack>
                </Box>
              </MotionDiv>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
