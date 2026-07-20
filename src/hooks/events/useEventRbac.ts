"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo } from "react";

export interface EventPermissionDefinition {
  key: string;
  category: string;
  label: string;
  description: string;
  premiumFeatureKey?: string | null;
}

export interface EventRoleDefinition {
  id: string;
  eventId: string;
  key: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  systemKey?: string | null;
  system: boolean;
  archivedAt?: string | null;
  permissions: string[];
  assignedUserCount: number;
}

interface EventRbacQueryData {
  eventPermissions: EventPermissionDefinition[];
  eventRoles: EventRoleDefinition[];
}

const EVENT_RBAC_QUERY = gql`
  query EventRbac($eventId: ID!, $includeArchived: Boolean) {
    eventPermissions {
      key
      category
      label
      description
      premiumFeatureKey
    }
    eventRoles(eventId: $eventId, includeArchived: $includeArchived) {
      id
      eventId
      key
      name
      description
      color
      icon
      systemKey
      system
      archivedAt
      permissions
      assignedUserCount
    }
  }
`;

const CREATE_EVENT_ROLE = gql`
  mutation CreateEventRole($input: CreateEventRoleInput!) {
    createEventRole(input: $input) {
      id
    }
  }
`;

const UPDATE_EVENT_ROLE = gql`
  mutation UpdateEventRole($input: UpdateEventRoleInput!) {
    updateEventRole(input: $input) {
      id
    }
  }
`;

const SET_EVENT_ROLE_PERMISSIONS = gql`
  mutation SetEventRolePermissions($input: SetEventRolePermissionsInput!) {
    setEventRolePermissions(input: $input) {
      id
    }
  }
`;

const ARCHIVE_EVENT_ROLE = gql`
  mutation ArchiveEventRole($input: ArchiveEventRoleInput!) {
    archiveEventRole(input: $input) {
      id
    }
  }
`;

const DELETE_EVENT_ROLE = gql`
  mutation DeleteEventRole($input: DeleteEventRoleInput!) {
    deleteEventRole(input: $input)
  }
`;

const ASSIGN_EVENT_ROLE = gql`
  mutation AssignEventRole($input: AssignEventRoleInput!) {
    assignEventRole(input: $input) {
      userId
      permissions
    }
  }
`;

const REMOVE_EVENT_ROLE = gql`
  mutation RemoveEventRole($input: RemoveEventRoleInput!) {
    removeEventRole(input: $input) {
      userId
      permissions
    }
  }
`;

export function useEventRbac(eventId: string | undefined, includeArchived: boolean) {
  const variables = useMemo(
    () => ({ eventId: eventId ?? "", includeArchived }),
    [eventId, includeArchived],
  );

  const query = useQuery<EventRbacQueryData>(EVENT_RBAC_QUERY, {
    variables,
    skip: !eventId,
  });

  const refetch = () => query.refetch(variables);

  const [createRoleMutation] = useMutation(CREATE_EVENT_ROLE);
  const [updateRoleMutation] = useMutation(UPDATE_EVENT_ROLE);
  const [setPermissionsMutation] = useMutation(SET_EVENT_ROLE_PERMISSIONS);
  const [archiveRoleMutation] = useMutation(ARCHIVE_EVENT_ROLE);
  const [deleteRoleMutation] = useMutation(DELETE_EVENT_ROLE);
  const [assignRoleMutation] = useMutation(ASSIGN_EVENT_ROLE);
  const [removeRoleMutation] = useMutation(REMOVE_EVENT_ROLE);

  return {
    loading: query.loading,
    error: query.error,
    permissions: query.data?.eventPermissions ?? [],
    roles: query.data?.eventRoles ?? [],
    refetch,
    createRole: async (input: {
      name: string;
      key?: string;
      description?: string;
      color?: string;
      icon?: string;
    }) => {
      await createRoleMutation({ variables: { input: { eventId, ...input } } });
      return refetch();
    },
    updateRole: async (
      roleId: string,
      input: {
        name?: string;
        description?: string;
        color?: string;
        icon?: string;
      },
    ) => {
      await updateRoleMutation({ variables: { input: { eventId, roleId, ...input } } });
      return refetch();
    },
    setPermissions: async (roleId: string, permissionKeys: string[]) => {
      await setPermissionsMutation({
        variables: { input: { eventId, roleId, permissionKeys } },
      });
      return refetch();
    },
    archiveRole: async (roleId: string) => {
      await archiveRoleMutation({ variables: { input: { eventId, roleId } } });
      return refetch();
    },
    deleteRole: async (roleId: string) => {
      await deleteRoleMutation({ variables: { input: { eventId, roleId } } });
      return refetch();
    },
    assignRole: async (userId: string, roleId: string) => {
      await assignRoleMutation({ variables: { input: { eventId, userId, roleId } } });
      return refetch();
    },
    removeRole: async (userId: string, roleId: string) => {
      await removeRoleMutation({ variables: { input: { eventId, userId, roleId } } });
      return refetch();
    },
  };
}
