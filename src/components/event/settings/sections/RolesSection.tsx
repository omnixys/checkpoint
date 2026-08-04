"use client";

import AddIcon from "@mui/icons-material/Add";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Autocomplete,
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useMutationHandler } from "@/checkpoint/hooks/core/useMutationHandler";
import type { EventRoleDefinition } from "@/checkpoint/hooks/events/useEventRbac";
import { useEventRbac } from "@/checkpoint/hooks/events/useEventRbac";
import { type EventStaffMember, useEventStaff } from "@/checkpoint/hooks/events/useEventStaff";
import { getFeatures } from "@/checkpoint/lib/experience/feature-registry";
import type { FeatureDefinition } from "@/checkpoint/lib/experience/types";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { useAuth } from "@/checkpoint/providers/AuthProvider";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";
import type { EventRoleType } from "@/checkpoint/types/event.type";

interface Props {
  roles: EventRoleType[];
  meta: { id: string; owner: string };
}

const CATEGORY_LABELS: Record<string, string> = {
  event: "Event",
  tools: "Tools",
  personal: "Personal",
  admin: "Administration",
};

export default function RolesSection({ roles, meta }: Props) {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { can } = useActiveEvent();
  const { execute, loading, error, success, reset } = useMutationHandler();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#2563eb");
  const [icon, setIcon] = useState("user-cog");

  const rbac = useEventRbac(meta.id, includeArchived);
  const { staff } = useEventStaff({ eventId: meta.id });

  const currentUserRole = roles.find((role) => role.userId === currentUser?.id)?.role;
  const isOwner = currentUser?.id === meta.owner;
  const canManageRoles =
    isOwner || currentUserRole === "ADMIN" || can(EventPermissionKey.ManageRoles);

  const handleCreateRole = async () => {
    if (!name.trim()) {
      return;
    }

    await execute(() =>
      rbac.createRole({
        name,
        description,
        color,
        icon,
      }),
    );

    setName("");
    setDescription("");
    setColor("#2563eb");
    setIcon("user-cog");
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h6">Permissions & Roles</Typography>
          <Typography variant="body2" color="text.secondary">
            Event-specific roles with granular access control.
          </Typography>
        </Stack>

        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.58),
          }}
        >
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <TextField
                label="Role name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth={true}
                disabled={!canManageRoles}
                sx={glassInputSx(theme)}
              />
              <TextField
                label="Icon"
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                disabled={!canManageRoles}
                sx={{ ...glassInputSx(theme), minWidth: 140 }}
              />
              <TextField
                label="Color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                disabled={!canManageRoles}
                sx={{ ...glassInputSx(theme), width: { xs: "100%", md: 110 } }}
              />
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                disabled={!canManageRoles || loading || !name.trim()}
                onClick={handleCreateRole}
                sx={{ minWidth: 132 }}
              >
                Create
              </Button>
            </Stack>
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth={true}
              disabled={!canManageRoles}
              sx={glassInputSx(theme)}
            />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Switch
                checked={includeArchived}
                onChange={(event) => setIncludeArchived(event.target.checked)}
              />
            }
            label="Show archived"
          />
          {rbac.loading && <CircularProgress size={18} />}
          {rbac.error && <Chip color="error" label={rbac.error.message} />}
        </Stack>

        <Stack spacing={2}>
          {rbac.roles.map((role) => (
            <RoleDefinitionCard
              key={role.id}
              role={role}
              staff={staff}
              isOwner={isOwner}
              canManage={canManageRoles}
              loading={loading}
              onUpdate={(input) => execute(() => rbac.updateRole(role.id, input))}
              onSetPermissions={(permissionKeys) =>
                execute(() => rbac.setPermissions(role.id, permissionKeys))
              }
              onArchive={() => execute(() => rbac.archiveRole(role.id))}
              onDelete={() => execute(() => rbac.deleteRole(role.id))}
              onAssign={(userId) => execute(() => rbac.assignRole(userId, role.id))}
              onRemove={(userId) => execute(() => rbac.removeRole(userId, role.id))}
            />
          ))}
        </Stack>
      </Stack>

      <Snackbar open={success} autoHideDuration={3000} onClose={reset}>
        <Alert severity="success" onClose={reset}>
          Roles updated
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={reset}>
        <Alert severity="error" onClose={reset}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

function FeatureToggleCard({
  feature,
  enabled,
  disabled,
  onToggle,
}: {
  feature: FeatureDefinition;
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const theme = useTheme();
  const Icon = feature.icon;

  return (
    <Paper
      onClick={() => !disabled && onToggle()}
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        p: 1.5,
        minWidth: 90,
        borderRadius: 2,
        cursor: disabled ? "default" : "pointer",
        userSelect: "none",
        border: `1px solid ${enabled ? alpha(theme.palette.primary.main, 0.3) : theme.palette.divider}`,
        backgroundColor: enabled
          ? alpha(theme.palette.primary.main, 0.08)
          : theme.palette.background.paper,
        transition: "all 0.2s ease",
        "&:hover": disabled
          ? {}
          : {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              borderColor: alpha(theme.palette.primary.main, 0.25),
            },
      }}
    >
      <Box
        sx={{
          color: enabled ? "primary.main" : "text.secondary",
          display: "flex",
          alignItems: "center",
          fontSize: 20,
        }}
      >
        <Icon />
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: enabled ? 600 : 400,
          color: enabled ? "primary.main" : "text.secondary",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {feature.label}
      </Typography>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: enabled ? "primary.main" : "text.disabled",
          transition: "background-color 0.2s ease",
        }}
      />
    </Paper>
  );
}

function RoleDefinitionCard({
  role,
  staff,
  isOwner,
  canManage,
  loading,
  onUpdate,
  onSetPermissions,
  onArchive,
  onDelete,
  onAssign,
  onRemove,
}: {
  role: EventRoleDefinition;
  staff: EventStaffMember[];
  isOwner: boolean;
  canManage: boolean;
  loading: boolean;
  onUpdate: (input: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
  }) => Promise<unknown>;
  onSetPermissions: (permissionKeys: string[]) => Promise<unknown>;
  onArchive: () => Promise<unknown>;
  onDelete: () => Promise<unknown>;
  onAssign: (userId: string) => Promise<unknown>;
  onRemove: (userId: string) => Promise<unknown>;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState({
    name: role.name,
    description: role.description ?? "",
    color: role.color ?? "#2563eb",
    icon: role.icon ?? "user-cog",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions);
  const [userId, setUserId] = useState("");
  const [autocompleteValue, setAutocompleteValue] = useState<EventStaffMember | string | null>(
    null,
  );

  useEffect(() => {
    setDraft({
      name: role.name,
      description: role.description ?? "",
      color: role.color ?? "#2563eb",
      icon: role.icon ?? "user-cog",
    });
    setSelectedPermissions(role.permissions);
    setUserId("");
    setAutocompleteValue(null);
  }, [role]);

  const permissionLocked = role.systemKey === "ADMIN" && !isOwner;
  const roleLocked = role.system;
  const isArchived = Boolean(role.archivedAt);

  const allFeatures = useMemo(() => getFeatures(), []);

  const featuresByCategory = useMemo(() => {
    const categories: Record<string, FeatureDefinition[]> = {};
    for (const feature of allFeatures) {
      const cat = feature.category;
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(feature);
    }
    return categories;
  }, [allFeatures]);

  const toggleFeature = (feature: FeatureDefinition) => {
    const hasAll = feature.requiredPermissions.every((p) => selectedPermissions.includes(p));

    if (hasAll) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !feature.requiredPermissions.includes(p as EventPermissionKey)),
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...feature.requiredPermissions.filter((p) => !prev.includes(p)),
      ]);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        opacity: isArchived ? 0.62 : 1,
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.04)
            : alpha(theme.palette.background.paper, 0.76),
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ alignItems: { xs: "stretch", md: "center" } }}
        >
          <Chip
            label={role.systemKey ?? role.key}
            icon={roleLocked ? <LockIcon /> : undefined}
            sx={{
              borderColor: role.color ?? undefined,
              color: role.color ?? undefined,
              minWidth: 96,
            }}
            variant="outlined"
          />
          <TextField
            label="Name"
            value={draft.name}
            onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
            disabled={!canManage || roleLocked}
            sx={{ ...glassInputSx(theme), flex: 1 }}
          />
          <TextField
            label="Icon"
            value={draft.icon}
            onChange={(event) => setDraft((value) => ({ ...value, icon: event.target.value }))}
            disabled={!canManage}
            sx={{ ...glassInputSx(theme), width: { xs: "100%", md: 140 } }}
          />
          <TextField
            label="Color"
            type="color"
            value={draft.color}
            onChange={(event) => setDraft((value) => ({ ...value, color: event.target.value }))}
            disabled={!canManage}
            sx={{ ...glassInputSx(theme), width: { xs: "100%", md: 104 } }}
          />
          <Tooltip title="Save role details">
            <span>
              <IconButton
                disabled={!canManage || loading}
                onClick={() => onUpdate(draft)}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <TextField
          label="Description"
          value={draft.description}
          onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))}
          disabled={!canManage}
          fullWidth={true}
          sx={glassInputSx(theme)}
        />

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={`${role.assignedUserCount} assigned`} size="small" />
          {isArchived && <Chip label="Archived" size="small" color="warning" />}
          {permissionLocked && <Chip label="Admin permissions locked" size="small" />}
        </Stack>

        <Stack spacing={1.5}>
          {Object.entries(featuresByCategory).map(([category, features]) => (
            <Box key={category}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}
              >
                {CATEGORY_LABELS[category] ?? category}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mt: 0.75, gap: 1 }}>
                {features.map((feature) => {
                  const enabled = feature.requiredPermissions.every((p) =>
                    selectedPermissions.includes(p),
                  );
                  return (
                    <FeatureToggleCard
                      key={feature.id}
                      feature={feature}
                      enabled={enabled}
                      disabled={!canManage || permissionLocked}
                      onToggle={() => toggleFeature(feature)}
                    />
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <Button
            startIcon={<SaveIcon />}
            variant="outlined"
            disabled={!canManage || permissionLocked || loading}
            onClick={() => onSetPermissions(selectedPermissions)}
          >
            Save permissions
          </Button>
          <Tooltip title={roleLocked ? "System roles cannot be archived" : "Archive role"}>
            <span>
              <IconButton disabled={!canManage || roleLocked || loading} onClick={onArchive}>
                <ArchiveIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip
            title={
              roleLocked || role.assignedUserCount > 0
                ? "Only unused custom roles can be deleted"
                : "Delete role"
            }
          >
            <span>
              <IconButton
                disabled={!canManage || roleLocked || role.assignedUserCount > 0 || loading}
                onClick={onDelete}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            Assign user
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{ alignItems: { xs: "stretch", md: "center" } }}
          >
            <Autocomplete
              freeSolo
              options={staff}
              value={autocompleteValue}
              onChange={(_, value) => {
                setAutocompleteValue(value);
                if (value && typeof value !== "string") {
                  setUserId(value.userId);
                } else if (typeof value === "string") {
                  setUserId(value);
                } else {
                  setUserId("");
                }
              }}
              onInputChange={(_, value) => {
                if (typeof value === "string") {
                  setUserId(value);
                }
              }}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                const name = [option.personalInfo?.firstName, option.personalInfo?.lastName]
                  .filter(Boolean)
                  .join(" ");
                return `${name} (@${option.username ?? option.userId})`;
              }}
              isOptionEqualToValue={(option, value) => {
                if (typeof value === "string") return false;
                return option.userId === value.userId;
              }}
              renderOption={(props, option) => {
                if (typeof option === "string") return null;
                const name = [option.personalInfo?.firstName, option.personalInfo?.lastName]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <li {...props} key={option.userId}>
                    <Stack direction="column">
                      <Typography variant="body2">{name || option.userId}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{option.username ?? "no-username"} · {option.userId}
                      </Typography>
                    </Stack>
                  </li>
                );
              }}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search user or enter ID"
                  placeholder="Name or User ID"
                  disabled={!canManage || isArchived}
                  sx={glassInputSx(theme)}
                />
              )}
            />
            <Button
              startIcon={<PersonAddIcon />}
              variant="contained"
              disabled={!canManage || isArchived || !userId.trim() || loading}
              onClick={() => {
                onAssign(userId.trim());
                setUserId("");
                setAutocompleteValue(null);
              }}
            >
              Assign
            </Button>
          </Stack>
        </Stack>

        {role.assignedUserCount > 0 && (
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Assigned users ({role.assignedUserCount})
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {staff
                .filter((member) => member.roles.includes(role.key))
                .map((member) => {
                  const name = [member.personalInfo?.firstName, member.personalInfo?.lastName]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <Chip
                      key={member.userId}
                      label={name || member.userId}
                      onDelete={
                        canManage && !isArchived ? () => onRemove(member.userId) : undefined
                      }
                      size="small"
                      sx={{
                        borderColor: role.color ?? undefined,
                      }}
                    />
                  );
                })}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
