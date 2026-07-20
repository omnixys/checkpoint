"use client";

import { useMutation } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import {
  AddTimeLinesDocument,
  AssignUserRoleToEventDocument,
  CreateEventDocument,
  type CreateEventInput,
  type CreateSettingsInput,
  type EventAddressInput,
  EventCategory,
  type EventTimelinePayload,
  EventVisibleTab,
  GetEventSettingsDocument,
  InvitationApprovalMode,
  RemoveTimeLinesDocument,
  RemoveUserFromEventDocument,
  TransferEventOwnershipDocument,
  UpdateEventDocument,
  type UpdateEventInput,
  type UpdateSettingsInput,
  UpdateTimeLinesDocument,
  type UserRoleType,
} from "@/checkpoint/generated/graphql";
import useEventQuery from "@/checkpoint/hooks/events/useEventQuery";

interface TimelineCreate {
  type: string;
  label: string;
  timestamp: string;
}

interface TimelineUpdate {
  id: string;
  type: string;
  label: string;
  timestamp: string;
}

interface RoleAssign {
  userId: string;
  role: UserRoleType;
}

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
  invitedByOptions: [],
  category: EventCategory.GENERAL,
  allowPlusOneUpdate: false,
  maxPlusOnes: 1,
  requireApprovalForPlusOnes: false,
  rsvpDeadline: null,
  approvalMode: InvitationApprovalMode.AUTO,
  allowGuestSeatSelection: false,
  allowSeatOverbooking: false,
  scheduleTicketRelease: false,
  ticketReleaseAt: null,
  visibleTabs: [EventVisibleTab.TIMELINE, EventVisibleTab.DETAILS, EventVisibleTab.MAP],
  seatColorGroups: null,
};

/**
 * useEventSettings (FINAL ENTERPRISE VERSION)
 */
export function useEventSettings(eventId: string) {
  const { eventSettings, eventSettingsLoading, eventSettingsError } = useEventQuery({
    eventId,
    loadEventSettings: true,
  });

  const eventRoles = useMemo(() => eventSettings?.userRoles ?? [], [eventSettings]);

  useEffect(() => {
    if (eventSettingsError) {
    }
  }, [eventSettingsError]);
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

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────

  const actions = {
    updateSettings: (patch: UpdateSettingsInput) => {
      const normalized = {
        ...patch,
        startsAt: patch.startsAt ?? null,
        endsAt: patch.endsAt ?? null,
      };

      return updateEvent({
        variables: {
          input: {
            eventId,
            settings: normalized,
          } as UpdateEventInput,
        },

        // optimisticResponse: {
        //   __typename: "Mutation",
        //   updateEvent: {
        //     __typename: "EventPayload",

        //     id: eventId,
        //     name: event?.name ?? "",
        //     owner: event?.owner ?? "",
        //     parentId: event?.parentId ?? null,
        //     path: event?.path ?? null,
        //     depth: event?.depth ?? 0,

        //     createdAt: event?.createdAt ?? new Date().toISOString(),
        //     updatedAt: new Date().toISOString(),

        //     myRole: event?.myRole ?? null,

        //     settings: {
        //       __typename: "SettingsPayload",

        //       id: event?.settings?.id ?? "temp",

        //       allowReEntry:
        //         normalized.allowReEntry ??
        //         event?.settings?.allowReEntry ??
        //         true,

        //       rotateSeconds:
        //         normalized.rotateSeconds ??
        //         event?.settings?.rotateSeconds ??
        //         300,

        //       maxSeats:
        //         normalized.maxSeats ?? event?.settings?.maxSeats ?? 50,

        //       isActive:
        //         normalized.isActive ?? event?.settings?.isActive ?? false,

        //       dressCode:
        //         normalized.dressCode ?? event?.settings?.dressCode ?? null,

        //       description:
        //         normalized.description ??
        //         event?.settings?.description ??
        //         null,

        //       startsAt:
        //         normalized.startsAt ?? event?.settings?.startsAt ?? null,

        //       endsAt: normalized.endsAt ?? event?.settings?.endsAt ?? null,

        //       createdAt:
        //         event?.settings?.createdAt ?? new Date().toISOString(),

        //       updatedAt: new Date().toISOString(),
        //     },

        //     timeline: event?.timeline ?? [],
        //     userRoles: event?.userRoles ?? [],
        //   },
        // },
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
        refetchQueries: [{ query: GetEventSettingsDocument, variables: { eventId } }],
        awaitRefetchQueries: true,
      }),

    /**
     * Remove Role
     */
    removeRole: (role: RoleAssign) =>
      removeRole({
        variables: {
          input: {
            eventId,
            userId: role.userId,
            eventRole: role.role,
          },
        },
        refetchQueries: [{ query: GetEventSettingsDocument, variables: { eventId } }],
        awaitRefetchQueries: true,
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
        referenceId: null,
        sourceId: null,
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
            id: eventId,
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
            tags: payload.tags ?? null,
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
  };

  // ─────────────────────────────
  // MAPPING (STRICT)
  // ─────────────────────────────

  const mapped = useMemo(() => {
    if (!eventSettings) {
      return null;
    }

    // const subEvents = eventSettings.subEvents;
    //         ...(subEvents
    //       ? {
    //           children: subEvents.map((c) => ({
    //             id: c.id,
    //             name: c.name,
    //           })),
    //         }
    //       : {}),

    return {
      meta: {
        id: eventSettings.id,
        name: eventSettings.name,
        owner: eventSettings.owner,
        ...(eventSettings.parentId ? { parentId: eventSettings.parentId } : {}),
      },
      settings: eventSettings.settings,
      timeline: eventSettings.timeline,
      roles: eventRoles,
    };
  }, [eventSettings, eventRoles]);

  return {
    loading: eventSettingsLoading,
    error: eventSettingsError,
    ...mapped,
    actions,
  };
}
