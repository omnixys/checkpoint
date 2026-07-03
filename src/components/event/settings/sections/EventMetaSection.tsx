"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { centerStyle } from "@/checkpoint/app/(protected)/event/[id]/settings/EventSettingsClientPage";
import OwnerTransferDialog from "@/checkpoint/components/event/settings/dialog/OwnerTransferDialog";
import type { CreateEventInput, GetSubEventNameListQuery } from "@/checkpoint/generated/graphql";
import { useMutationHandler } from "@/checkpoint/hooks/core/useMutationHandler";
import useSubEventListQuery from "@/checkpoint/hooks/events/useEventChildrenQuery";
import useUserQuery from "@/checkpoint/hooks/user/useUserQuery";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import type { EventMetaDTO, EventRoleType } from "@/checkpoint/types/event.type";

interface Props {
  meta: EventMetaDTO;
  actions: {
    addChild: (payload: CreateEventInput) => Promise<any>;
    transferOwner?: (userId: string) => Promise<any>;
  };
  roles: EventRoleType[];
  currentUserId?: string;
}

/**
 * EventMetaSection
 *
 * Responsibilities:
 * - Display event meta information
 * - Handle child creation
 * - Handle ownership transfer
 *
 * Constraints:
 * - MUST respect hook contract (CreateEventInput)
 * - MUST NOT contain business logic
 */
export default function EventMetaSection({ meta, actions, roles }: Props) {
  const theme = useTheme();
  const { currentUser } = useAuth();

  const [childName, setChildName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { execute, error, success, reset } = useMutationHandler();
  const { subEventNameList, subEventNameListLoading } = useSubEventListQuery({
    eventId: meta.id,
    loadChildrenSettings: true,
  });

  const { userInfo, userInfoLoading } = useUserQuery({
    userId: meta.owner,
    loadUserName: true,
  });

  const currentUserId = currentUser?.id;
  const isOwner = currentUserId === meta.owner;

  // TODO visuell optimieren mit error und loader
  if (subEventNameListLoading || userInfoLoading) {
    return (
      <Box sx={centerStyle}>
        <CircularProgress />
      </Box>
    );
  }

  /**
   * Handles creation of a child event
   *
   * Important:
   * - Must comply with CreateEventInput contract
   * - Empty objects are merged with defaults in hook
   */
  const handleAddChild = async () => {
    if (!childName.trim()) {
      return;
    }

    const payload: CreateEventInput = {
      parentId: meta.id,
      name: childName,
      address: null,

      settings: {
        allowReEntry: true,
        rotateSeconds: 600,
        maxSeats: 10,
        dressCode: "formal",
        description: "Guest Event",
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        allowPublicPlusOne: true,
        allowPublicRsvp: true,
        allowPublicRsvpWebsite: true,
        isActive: true,
        isPublic: true,
        publicRsvpWebsite: "",
        invitedByOptions: [],
        category: "GENERAL",
        allowPlusOneUpdate: false,
        allowGuestSeatSelection: false,
        allowSeatOverbooking: false,
        approvalMode: "AUTO",
        maxPlusOnes: 1,
        requireApprovalForPlusOnes: true,
        rsvpDeadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
        ticketReleaseAt: null,
      },
      children: [],
      tags: null,
    };

    const result = await execute(() => actions.addChild(payload));

    if (result) {
      setChildName("");
    }
  };

  const ownerInfo = `${userInfo?.personalInfo?.firstName} ${userInfo?.personalInfo?.lastName}`;

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h6">Event</Typography>

        {/* EVENT INFO */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          }}
        >
          <Stack spacing={1}>
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {meta.name}
            </Typography>

            {/* <Typography variant="caption" color="text.secondary">
              Event ID: {meta.id}
            </Typography> */}

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <Chip label={`Owner: ${ownerInfo}`} color="primary" />

              {isOwner && (
                <Button size="small" onClick={() => setDialogOpen(true)}>
                  Transfer
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* CHILD EVENTS */}
        <Stack spacing={1}>
          <Typography variant="subtitle1">Child Events</Typography>

          {isOwner && (
            <Stack direction="row" spacing={1}>
              <TextField
                placeholder="Child event name"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                fullWidth={true}
                sx={glassInputSx(theme)}
              />

              <IconButton onClick={handleAddChild} disabled={true}>
                <AddIcon />
              </IconButton>
            </Stack>
          )}

          <Stack spacing={1}>
            <AnimatePresence>
              {(subEventNameList ?? []).map((child) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChildRow child={child} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        </Stack>
      </Stack>

      {/* OWNER TRANSFER */}
      <OwnerTransferDialog
        open={dialogOpen}
        roles={roles}
        onClose={() => setDialogOpen(false)}
        currentOwnerId={meta.owner}
        onTransfer={(newOwnerId) =>
          execute(() => actions.transferOwner?.(newOwnerId) ?? Promise.resolve())
        }
      />

      {/* SUCCESS FEEDBACK */}
      <Snackbar open={success} autoHideDuration={3000} onClose={reset}>
        <Alert severity="success" onClose={reset}>
          Action successful
        </Alert>
      </Snackbar>

      {/* ERROR FEEDBACK */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={reset}>
        <Alert severity="error" onClose={reset}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

/**
 * ChildRow
 *
 * Pure UI component
 * No business logic allowed
 */
function ChildRow({ child }: { child: GetSubEventNameListQuery["eventChildren"][number] }) {
  const theme = useTheme();
  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return "n/a";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        backdropFilter: "blur(10px)",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      }}
    >
      <Typography sx={{ flex: 1, fontWeight: 600 }}>{child.name}</Typography>

      {/* <Chip label={child.id} size="small" /> */}
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Box
          sx={{
            px: 1.25,
            py: 0.75,
            minWidth: 112,
            borderRadius: 2,
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(76, 175, 80, 0.14)" : "rgba(76, 175, 80, 0.10)",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Start
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {formatDateTime(child.settings?.startsAt)}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.25,
            py: 0.75,
            minWidth: 112,
            borderRadius: 2,
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(244, 67, 54, 0.14)" : "rgba(244, 67, 54, 0.10)",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Ende
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {formatDateTime(child.settings?.endsAt)}
          </Typography>
        </Box>
      </Stack>

      <IconButton disabled={true}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
