"use client";

import {
  AddTimeLinesDocument,
  AssignUserRoleToEventDocument,
  CreateEventDocument,
  CreateEventInput,
  CreateSettingsInput,
  EventAddressInput,
  EventChildrenDocument,
  EventChildrenQuery,
  EventChildrenQueryVariables,
  EventDocument,
  EventQuery,
  EventQueryVariables,
  EventTimelinePayload,
  RemoveTimeLinesDocument,
  RemoveUserFromEventDocument,
  TransferEventOwnershipDocument,
  UpdateEventDocument,
  UpdateSettingsInput,
  UpdateTimeLinesDocument,
  UserRoleType,
} from "@/checkpoint/generated/graphql";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo } from "react";

type TimelineCreate = {
  type: string;
  label: string;
  timestamp: string;
};

type TimelineUpdate = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
};

type RoleAssign = {
  userId: string;
  role: UserRoleType;
};

/**
 * DEFAULTS (centralized → enterprise)
 */

const DEFAULT_ADDRESS: EventAddressInput = {
  street: "Namurstraße",
  houseNumber: "4",
  postalCode: "70374",
  city: "Stuttgart",
  state: "Baden-Württemberg",
  country: "Germany",
  additionalInfo: "auto-generated",
};

const DEFAULT_SETTINGS: CreateSettingsInput = {
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
  category: "GENERAL",
};

/**
 * useEventSettings (FINAL ENTERPRISE VERSION)
 */
export function useEventSettings(eventId: string) {
  // ─────────────────────────────
  // QUERY
  // ─────────────────────────────

  const { data, loading } = useQuery<EventQuery, EventQueryVariables>(
    EventDocument,
    {
      variables: { id: eventId },
      fetchPolicy: "cache-and-network",
    },
  );

  const event = data?.event;

  const staffRoles = (event?.userRoles ?? []).filter(
    (role) => role.role !== "GUEST",
  );
  // ─────────────────────────────
  // MUTATIONS
  // ─────────────────────────────

  const [updateEvent] = useMutation(UpdateEventDocument);
  const [assignRole] = useMutation(AssignUserRoleToEventDocument);
  const [removeRole] = useMutation(RemoveUserFromEventDocument);

  const [createTimeline] = useMutation(AddTimeLinesDocument);
  const [updateTimelineMutation] = useMutation(UpdateTimeLinesDocument);
  const [removeTimelineMutation] = useMutation(RemoveTimeLinesDocument);

  const [createChild] = useMutation(CreateEventDocument);
  const [transferOwnerMutation] = useMutation(TransferEventOwnershipDocument);

  const { data: eventData, loading: childrenLoading } = useQuery<
    EventChildrenQuery,
    EventChildrenQueryVariables
  >(EventChildrenDocument, {
    variables: { id: eventId },
  });

  const children = eventData?.eventChildren.filter(
    (child) => child.id !== eventId,
  );

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────

  const actions = useMemo(
    () => ({
      /**
       * Update Event Settings (nested!)
       */
      updateSettings: (patch: UpdateSettingsInput) => {
        const normalized = {
          ...patch,
          startsAt: patch.startsAt ?? undefined,
          endsAt: patch.endsAt ?? undefined,
        };

        return updateEvent({
          variables: {
            input: {
              eventId,
              name: null,
              parentId: null,
              settings: normalized,
            },
          },

          optimisticResponse: {
            __typename: "Mutation",
            updateEvent: {
              __typename: "EventPayload",

              id: eventId,
              name: event?.name ?? "",
              owner: event?.owner ?? "",
              parentId: event?.parentId ?? null,
              path: event?.path ?? null,
              depth: event?.depth ?? 0,

              createdAt: event?.createdAt ?? new Date().toISOString(),
              updatedAt: new Date().toISOString(),

              myRole: event?.myRole ?? null,

              settings: {
                __typename: "SettingsPayload",

                id: event?.settings?.id ?? "temp",

                allowReEntry:
                  normalized.allowReEntry ??
                  event?.settings?.allowReEntry ??
                  true,

                rotateSeconds:
                  normalized.rotateSeconds ??
                  event?.settings?.rotateSeconds ??
                  300,

                maxSeats:
                  normalized.maxSeats ?? event?.settings?.maxSeats ?? 50,

                isActive:
                  normalized.isActive ?? event?.settings?.isActive ?? false,

                dressCode:
                  normalized.dressCode ?? event?.settings?.dressCode ?? null,

                description:
                  normalized.description ??
                  event?.settings?.description ??
                  null,

                startsAt:
                  normalized.startsAt ?? event?.settings?.startsAt ?? null,

                endsAt: normalized.endsAt ?? event?.settings?.endsAt ?? null,

                createdAt:
                  event?.settings?.createdAt ?? new Date().toISOString(),

                updatedAt: new Date().toISOString(),
              },

              timeline: event?.timeline ?? [],
              userRoles: event?.userRoles ?? [],
            },
          },
        });
      },

      /**
       * Assign Role
       */
      assignRole: (role: RoleAssign) =>
        assignRole({
          variables: {
            input: {
              eventId,
              userId: role.userId,
              eventRole: role.role,
            },
          },
        }),

      /**
       * Remove Role
       */
      removeRole: (userId: string) =>
        removeRole({
          variables: {
            input: {
              eventId,
              userId,
            },
          },
        }),

      /**
       * Create Timeline (ARRAY!)
       */
      addTimeline: (items: TimelineCreate[]) =>
        createTimeline({
          variables: {
            eventId,
            input: items.map((item) => ({
              type: item.type,
              label: item.label,
              timestamp: item.timestamp,
            })),
          },
        }),

      /**
       * Update Timeline (ARRAY!)
       */
      updateTimeline: (items: TimelineUpdate[]) => {
        const timeline: EventTimelinePayload[] = items.map((t) => ({
          __typename: "EventTimelinePayload",
          id: t.id,
          eventId,
          label: t.label,
          timestamp: t.timestamp,
          type: t.type,
        }));

        return updateTimelineMutation({
          variables: {
            eventId,
            input: items.map((item) => ({
              id: item.id,
              type: item.type,
              label: item.label,
              timestamp: item.timestamp,
            })),
          },

          optimisticResponse: {
            __typename: "Mutation",
            updateTimeLines: {
              __typename: "EventPayload",
              timeline,
            },
          },
        });
      },

      /**
       * Remove Timeline (ARRAY!)
       */
      removeTimeline: (ids: string[]) =>
        removeTimelineMutation({
          variables: {
            eventId,
            input: ids.map((item) => ({
              id: item,
            })),
          },
        }),

      /**
       * Create Child Event
       */
      addChild: (payload: CreateEventInput) => {
        const address: EventAddressInput = {
          ...DEFAULT_ADDRESS,
          ...payload.address,
        };

        const settings: CreateSettingsInput = {
          ...DEFAULT_SETTINGS,
          ...payload.settings,
        };

        return createChild({
          variables: {
            input: {
              parentId: eventId,
              name: payload.name,
              address,
              settings,
              children: [],
            },
          },
        });
      },

      /**
       * Transfer Ownership (FIXED)
       */
      transferOwner: (userId: string) =>
        transferOwnerMutation({
          variables: {
            input: {
              eventId,
              newOwnerId: userId,
            },
          },
        }),
    }),
    [eventId],
  );

  // ─────────────────────────────
  // MAPPING (STRICT)
  // ─────────────────────────────

  const mapped = useMemo(() => {
    if (!event) return null;

    return {
      meta: {
        id: event.id,
        name: event.name,
        owner: event.owner,
        ...(event.parentId ? { parentId: event.parentId } : {}),
        ...(children
          ? {
              children: children.map((c) => ({
                id: c.id,
                name: c.name,
              })),
            }
          : {}),
      },
      settings: event.settings,
      timeline: event.timeline,
      roles: staffRoles,
    };
  }, [event]);

  return {
    loading,
    ...mapped,
    actions,
  };
}
