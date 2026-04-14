"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { CreateEventInput, EventPayload, UserRolePayload } from "@/checkpoint/generated/graphql";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { useMutationHandler } from "@/checkpoint/hooks/core/useMutationHandler";
import OwnerTransferDialog from "@/checkpoint/components/event/settings/dialog/OwnerTransferDialog";
import { EventMetaDTO, EventTree } from "@/checkpoint/types/event.type";

type Props = {
  meta: EventMetaDTO;
  actions: {
    addChild: (payload: CreateEventInput) => Promise<any>;
    transferOwner?: (userId: string) => Promise<any>;
  };
  roles: UserRolePayload[];
  currentUserId?: string;
};

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
  const { user } = useAuth();

  const [childName, setChildName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { execute, loading, error, success, reset } = useMutationHandler();

  const currentUserId = user?.id;

  const isOwner = currentUserId === meta.owner;

  /**
   * Handles creation of a child event
   *
   * Important:
   * - Must comply with CreateEventInput contract
   * - Empty objects are merged with defaults in hook
   */
  const handleAddChild = async () => {
    if (!childName.trim()) return;

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
      },
    };

    const result = await execute(() => actions.addChild(payload));

    if (result) {
      setChildName("");
    }
  };

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

            <Typography variant="caption" color="text.secondary">
              Event ID: {meta.id}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
              <Chip label={`Owner: ${meta.owner}`} color="primary" />

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
                fullWidth
                sx={glassInputSx(theme)}
              />

              <IconButton onClick={handleAddChild} disabled={true}>
                <AddIcon />
              </IconButton>
            </Stack>
          )}

          <Stack spacing={1}>
            <AnimatePresence>
              {(meta.children ?? []).map((child) => (
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
function ChildRow({ child }: { child: { id: string; name: string } }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 1,
        backdropFilter: "blur(10px)",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      }}
    >
      <Typography sx={{ flex: 1 }}>{child.name}</Typography>

      <Chip label={child.id} size="small" />

      <IconButton disabled>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
