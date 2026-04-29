"use client";

import { useState } from "react";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { UserRoleType } from "@/checkpoint/generated/graphql";
import { useMutationHandler } from "@/checkpoint/hooks/core/useMutationHandler";
import { EventRoleType } from "@/checkpoint/types/event.type";
import useGuestQuery from "@/checkpoint/hooks/user/useGuestQuery";

/**
 * Props
 */
type Props = {
  roles: EventRoleType[];
  meta: { owner: string };
  actions: {
    assignRole: (role: EventRoleType) => Promise<any>;
    removeRole: (userId: string) => Promise<any>;
  };
};

/**
 * RolesSection
 *
 * Enterprise responsibilities:
 * - Role assignment
 * - Permission enforcement
 * - Safe mutation handling
 */
export default function RolesSection({ roles, meta, actions }: Props) {
  const theme = useTheme();
  const { currentUser } = useAuth();

  const { execute, loading, error, success, reset } = useMutationHandler();

  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<UserRoleType>("GUEST");

  const { securityGuestMap } = useGuestQuery({
    guestIdList: roles.map((role) => role.userId),
    loadSecurityGuestIdList: true,
  });

  /**
   * Permissions
   */
  const isOwner = currentUser?.id === meta.owner;
  const currentUserRole = roles.find((r) => r.userId === currentUser?.id)?.role;
  const isAdmin = currentUserRole === "ADMIN";

  /**
   * Add role
   */
  const handleAdd = async () => {
    if (!newUserId.trim()) return;

    await execute(() =>
      actions.assignRole({
        userId: newUserId,
        role: newRole,
      }),
    );

    setNewUserId("");
    setNewRole("GUEST");
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h6">Roles</Typography>

        {/* ADD USER */}
        <Stack direction="row" spacing={1}>
          <TextField
            placeholder="User ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            fullWidth
            sx={glassInputSx(theme)}
          />

          <Select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as UserRoleType)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="SECURITY">Security</MenuItem>
            <MenuItem value="GUEST">Guest</MenuItem>
          </Select>

          <Button variant="contained" onClick={handleAdd} disabled={loading}>
            Add
          </Button>
        </Stack>

        {/* ROLE LIST */}
        <Stack spacing={1}>
          <AnimatePresence>
            {roles.map((role) => (
              <motion.div
                key={role.userId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <RoleRow
                  name={securityGuestMap.get(role.userId)}
                  role={role}
                  currentUserId={currentUser?.id}
                  ownerId={meta.owner}
                  isOwner={meta.owner === role.userId}
                  canEdit={isOwner || (isAdmin && role.role !== "ADMIN")}
                  canDelete={
                    role.userId !== meta.owner && (isOwner || (isAdmin && role.role !== "ADMIN"))
                  }
                  actions={actions}
                  execute={execute}
                  loading={loading}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </Stack>
      </Stack>

      {/* SUCCESS */}
      <Snackbar open={success} autoHideDuration={3000} onClose={reset}>
        <Alert severity="success" onClose={reset}>
          Role updated
        </Alert>
      </Snackbar>

      {/* ERROR */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={reset}>
        <Alert severity="error" onClose={reset}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

/**
 * RoleRow
 *
 * Handles:
 * - role update
 * - delete
 * - safety checks
 */
function RoleRow({
  role,
  currentUserId,
  ownerId,
  isOwner,
  canEdit,
  canDelete,
  actions,
  execute,
  loading,
  name,
}: {
  name?: string | undefined;
  role: EventRoleType;
  currentUserId?: string | undefined;
  ownerId: string;
  isOwner: boolean;
  canEdit: boolean;
  canDelete: boolean;
  actions: {
    assignRole: (role: EventRoleType) => Promise<any>;
    removeRole: (userId: string) => Promise<any>;
  };
  execute: <T>(fn: () => Promise<T>) => Promise<T | null>;
  loading: boolean;
}) {
  const theme = useTheme();

  /**
   * Prevent self-downgrade
   */
  const isSelf = role.userId === currentUserId;

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
      <Chip label={name} color={isOwner ? "primary" : "default"} />

      <Select
        value={role.role}
        disabled={!canEdit || isOwner || isSelf}
        onChange={(e) =>
          execute(() =>
            actions.assignRole({
              userId: role.userId,
              role: e.target.value as UserRoleType,
            }),
          )
        }
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="ADMIN">Admin</MenuItem>
        <MenuItem value="SECURITY">Security</MenuItem>
        <MenuItem value="GUEST">Guest</MenuItem>
      </Select>

      {isOwner && (
        <Typography variant="caption" color="primary">
          Owner
        </Typography>
      )}

      {loading && <CircularProgress size={16} />}

      <IconButton
        disabled={!canDelete}
        onClick={() => execute(() => actions.removeRole(role.userId))}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
