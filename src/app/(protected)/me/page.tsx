"use client";

import useMeQuery from "@/checkpoint/hooks/user/useMeQuery";
import { env } from "@/checkpoint/lib/env";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const basePath = env.CHECKPOINT_BASE_PATH;

export default function MePage() {
  const theme = useTheme();
  const router = useRouter();

  const { mePage, mePageLoading } = useMeQuery({
    loadMePage: true,
  });

  if (mePageLoading) return null;

  const name = `${mePage?.personalInfo?.firstName ?? ""} ${
    mePage?.personalInfo?.lastName ?? ""
  }`;

  return (
    <Stack spacing={4}>
      {/* 🔥 HERO */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.2)}`,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            PERSONAL SPACE
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </Typography>

          <Typography color="text.secondary">@{mePage?.username}</Typography>

          <Typography color="text.secondary">
            {mePage?.personalInfo?.email}
          </Typography>
        </Stack>
      </Box>

      {/* 🔥 ACTION GRID */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <ActionCard
          title="Profile"
          description="Edit your personal information"
          onClick={() => router.push(`${basePath}me/profile`)}
        />

        <ActionCard
          title="Security"
          description="Password, sessions & protection"
          onClick={() => router.push(`${basePath}me/security`)}
        />

        <ActionCard
          title="Notifications"
          description="Manage alerts & communication"
          onClick={() => router.push(`${basePath}me/notifications`)}
        />
      </Stack>
    </Stack>
  );
}

/**
 * -------------------------------------------------------------
 * Premium Action Card (VisionOS Style)
 * -------------------------------------------------------------
 */
function ActionCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      sx={{
        flex: 1,
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",

        backdropFilter: "blur(16px)",
        background: alpha(theme.palette.background.paper, 0.5),

        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

        boxShadow: `0 10px 40px ${alpha(theme.palette.common.black, 0.15)}`,

        transition: "all 0.25s ease",

        "&:hover": {
          boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.25)}`,
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
