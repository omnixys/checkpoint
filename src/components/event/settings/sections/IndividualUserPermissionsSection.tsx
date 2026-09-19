"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SaveIcon from "@mui/icons-material/Save";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { GetEventTreeDocument } from "@/checkpoint/generated/graphql";
import { useEventRbac } from "@/checkpoint/hooks/events/useEventRbac";
import { EventPermissionKey } from "@/checkpoint/lib/rbac/event-permissions";
import { useActiveEvent } from "@/checkpoint/providers/ActiveEventProvider";
import { glassInputSx } from "@/checkpoint/themes/styles/glassInput";

const EVENT_ASSIGNABLE_USERS_QUERY = gql`
  query EventAssignableUsers($eventId: ID!, $query: String!) {
    eventAssignableUsers(eventId: $eventId, query: $query) {
      id
      username
      displayName
      email
    }
  }
`;

const EVENT_USER_PERMISSION_GRANTS_QUERY = gql`
  query EventUserPermissionGrants($eventId: ID!, $userId: ID!) {
    eventUserPermissionGrants(eventId: $eventId, userId: $userId) {
      eventId
      userId
      permissionKeys
    }
  }
`;

const SET_EVENT_USER_PERMISSIONS_MUTATION = gql`
  mutation SetEventUserPermissions($input: SetEventUserPermissionsInput!) {
    setEventUserPermissions(input: $input) {
      eventId
      userId
      permissionKeys
    }
  }
`;

interface AssignableUser {
  id: string;
  username: string;
  displayName?: string | null;
  email?: string | null;
}

interface PermissionGrant {
  eventId: string;
  userId: string;
  permissionKeys: string[];
}

interface EventNode {
  id: string;
  name: string;
  parentId?: string | null;
  depth?: number | null;
}

function displayUser(user: AssignableUser): string {
  return user.displayName || user.username || user.email || user.id;
}

export default function IndividualUserPermissionsSection({ eventId }: { eventId: string }) {
  const theme = useTheme();
  const { can } = useActiveEvent();
  const canManage = can(EventPermissionKey.ManageRoles);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const [selectedUser, setSelectedUser] = useState<AssignableUser | null>(null);
  const [directPermissions, setDirectPermissions] = useState<Record<string, string[]>>({});
  const [savedMessage, setSavedMessage] = useState(false);
  const rbac = useEventRbac(eventId, false);

  const { data: searchData, loading: searching } = useQuery<{
    eventAssignableUsers: AssignableUser[];
  }>(EVENT_ASSIGNABLE_USERS_QUERY, {
    variables: { eventId, query: deferredSearch },
    skip: !canManage || deferredSearch.length < 2,
    fetchPolicy: "no-cache",
  });

  const { data: treeData } = useQuery(GetEventTreeDocument, {
    variables: { eventId },
    skip: !canManage,
  });

  const {
    data: grantsData,
    loading: grantsLoading,
    error: grantsError,
    refetch: refetchGrants,
  } = useQuery<{ eventUserPermissionGrants: PermissionGrant[] }>(
    EVENT_USER_PERMISSION_GRANTS_QUERY,
    {
      variables: { eventId, userId: selectedUser?.id ?? "" },
      skip: !canManage || !selectedUser,
      fetchPolicy: "network-only",
    },
  );

  const [setPermissions, { loading: saving, error: saveError }] = useMutation(
    SET_EVENT_USER_PERMISSIONS_MUTATION,
  );

  const events = useMemo<EventNode[]>(() => {
    const tree = treeData?.eventTree;
    if (!tree?.rootEvent) return [];
    return [tree.rootEvent, ...(tree.subEvents ?? [])];
  }, [treeData]);

  const parentIds = useMemo(
    () => new Map(events.map((event) => [event.id, event.parentId ?? null])),
    [events],
  );

  useEffect(() => {
    if (!grantsData) return;
    setDirectPermissions(
      Object.fromEntries(
        grantsData.eventUserPermissionGrants.map((grant) => [grant.eventId, grant.permissionKeys]),
      ),
    );
    setSavedMessage(false);
  }, [grantsData]);

  const inheritedPermissions = (currentEventId: string): string[] => {
    const inherited = new Set<string>();
    let parentId = parentIds.get(currentEventId);
    while (parentId) {
      for (const permission of directPermissions[parentId] ?? []) inherited.add(permission);
      parentId = parentIds.get(parentId);
    }
    return [...inherited];
  };

  const togglePermission = (currentEventId: string, permissionKey: string) => {
    setDirectPermissions((current) => {
      const next = new Set(current[currentEventId] ?? []);
      if (next.has(permissionKey)) next.delete(permissionKey);
      else next.add(permissionKey);
      return { ...current, [currentEventId]: [...next] };
    });
    setSavedMessage(false);
  };

  const save = async (currentEventId: string) => {
    if (!selectedUser) return;
    await setPermissions({
      variables: {
        input: {
          eventId: currentEventId,
          userId: selectedUser.id,
          permissionKeys: directPermissions[currentEventId] ?? [],
        },
      },
    });
    await refetchGrants();
    setSavedMessage(true);
  };

  if (!canManage) {
    return (
      <Alert severity="info">
        Individuelle Nutzerrechte können nur mit der Berechtigung „Rollen verwalten“ geändert
        werden.
      </Alert>
    );
  }

  return (
    <Stack spacing={2} aria-labelledby="individual-user-permissions-heading">
      <Stack spacing={0.5}>
        <Typography id="individual-user-permissions-heading" variant="h6" sx={{ fontWeight: 500 }}>
          Individuelle Nutzerrechte
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Direkte Freigaben ergänzen Rollenrechte. Rechte des Parent-Events gelten automatisch in
          seinen Children.
        </Typography>
      </Stack>

      <Autocomplete
        aria-label="Nutzer für individuelle Rechte suchen"
        autoComplete={false}
        filterOptions={(options) => options}
        getOptionLabel={displayUser}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={searching}
        noOptionsText={deferredSearch.length < 2 ? "Mindestens zwei Zeichen eingeben" : "Keine Nutzer gefunden"}
        onChange={(_, value) => setSelectedUser(value)}
        onInputChange={(_, value, reason) => {
          if (reason === "input") setSearch(value);
        }}
        options={searchData?.eventAssignableUsers ?? []}
        renderInput={(params) => (
          <TextField
            {...params}
            helperText="Suche nach Name, Benutzername oder E-Mail"
            label="Nutzer suchen"
            placeholder="Name oder E-Mail"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps?.input,
                endAdornment: (
                  <>
                    {searching ? <CircularProgress size={18} /> : <PersonSearchIcon />}
                    {params.slotProps?.input?.endAdornment}
                  </>
                ),
              },
            }}
            sx={glassInputSx(theme)}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Stack>
              <Typography variant="body2">{displayUser(option)}</Typography>
              {(option.email || option.username) && (
                <Typography color="text.secondary" variant="caption">
                  {option.username}{option.email ? ` · ${option.email}` : ""}
                </Typography>
              )}
            </Stack>
          </li>
        )}
      />

      {selectedUser && (
        <Stack spacing={1.5}>
          <Typography variant="subtitle1">Rechte für {displayUser(selectedUser)}</Typography>
          {grantsLoading && <CircularProgress size={22} aria-label="Nutzerrechte werden geladen" />}
          {grantsError && <Alert severity="error">Die direkten Nutzerrechte konnten nicht geladen werden.</Alert>}
          {saveError && <Alert severity="error">Die Nutzerrechte konnten nicht gespeichert werden.</Alert>}
          {savedMessage && (
            <Alert severity="success">
              Gespeichert. Die Berechtigungen werden an die abhängigen Services weitergegeben.
            </Alert>
          )}

          {!grantsLoading && events.map((event) => (
            <PermissionScope
              directPermissions={directPermissions[event.id] ?? []}
              event={event}
              inheritedPermissions={inheritedPermissions(event.id)}
              key={event.id}
              permissions={rbac.permissions}
              saving={saving}
              onSave={() => save(event.id)}
              onToggle={(permissionKey) => togglePermission(event.id, permissionKey)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function PermissionScope({
  event,
  directPermissions,
  inheritedPermissions,
  permissions,
  saving,
  onSave,
  onToggle,
}: {
  event: EventNode;
  directPermissions: string[];
  inheritedPermissions: string[];
  permissions: Array<{ key: string; category: string; label: string; description: string }>;
  saving: boolean;
  onSave: () => void;
  onToggle: (permissionKey: string) => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(event.depth === 0 || event.depth == null);
  const permissionsByCategory = useMemo(() => {
    const grouped = new Map<string, typeof permissions>();
    for (const permission of permissions) {
      grouped.set(permission.category, [...(grouped.get(permission.category) ?? []), permission]);
    }
    return [...grouped.entries()];
  }, [permissions]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.extended.border.subtle}`,
        bgcolor: theme.palette.extended.surface.level2,
        ml: { xs: 0, md: (event.depth ?? 0) * 2 },
        overflow: "hidden",
      }}
    >
      <Button
        aria-expanded={open}
        endIcon={<ExpandMoreIcon sx={{ transform: open ? "rotate(180deg)" : "none" }} />}
        fullWidth={true}
        onClick={() => setOpen((value) => !value)}
        sx={{ justifyContent: "space-between", px: 2, py: 1.25 }}
      >
        {event.name}
      </Button>
      <Collapse in={open} timeout="auto" unmountOnExit={true}>
        <Stack spacing={1.5} sx={{ p: 2, pt: 0 }}>
          {inheritedPermissions.length > 0 && (
            <Box>
              <Typography color="text.secondary" variant="caption">
                Vom Parent geerbt
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {inheritedPermissions.map((permission) => (
                  <Chip key={permission} label={permission} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          {permissionsByCategory.map(([category, categoryPermissions]) => (
            <Box key={category}>
              <Typography color="text.secondary" variant="caption">
                {category}
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} sx={{ flexWrap: "wrap" }}>
                {categoryPermissions.map((permission) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={directPermissions.includes(permission.key)}
                        onChange={() => onToggle(permission.key)}
                      />
                    }
                    key={permission.key}
                    label={permission.label}
                    slotProps={{ typography: { variant: "body2" } }}
                  />
                ))}
              </Stack>
            </Box>
          ))}

          <Stack sx={{ alignItems: "flex-end" }}>
            <Button
              disabled={saving}
              onClick={onSave}
              startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
              variant="contained"
            >
              Rechte speichern
            </Button>
          </Stack>
        </Stack>
      </Collapse>
    </Paper>
  );
}
