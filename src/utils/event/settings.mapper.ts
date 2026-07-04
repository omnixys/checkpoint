/**
 * settings.mapper.ts
 *
 * Centralized mapping layer for transforming GraphQL payloads
 * into valid mutation input DTOs.
 *
 * This ensures:
 * - No __typename leakage
 * - No readonly fields (id, createdAt, updatedAt)
 * - Strict typing
 * - Reusable and safe transformations
 */

import type {
  EventCategory,
  EventVisibleTab,
  SettingsPayload,
  UpdateSettingsInput,
} from "@/checkpoint/generated/graphql";

type FullSettingsPatch = Partial<SettingsPayload> & {
  allowPublicRsvp?: boolean;
  allowPublicPlusOne?: boolean;
  allowPublicRsvpWebsite?: boolean;
  allowPlusOneUpdate?: boolean;
  allowGuestSeatSelection?: boolean;
  allowSeatOverbooking?: boolean;
  ticketReleaseAt?: string | null;
  maxPlusOnes?: number;
  requireApprovalForPlusOnes?: boolean;
  rsvpDeadline?: string | null;
  approvalMode?: SettingsPayload["approvalMode"];
  publicRsvpWebsite?: string | null;
  invitedByOptions?: string[];
  seatColorGroups?: SettingsPayload["seatColorGroups"];
  visibleTabs?: EventVisibleTab[];
  isPublic?: boolean;
  category?: EventCategory;
};

/**
 * Maps SettingsPayload (GraphQL response)
 * into UpdateSettingsInput (GraphQL mutation input)
 *
 * WHY:
 * GraphQL responses contain fields that are NOT allowed in input types.
 * This mapper guarantees clean separation between read-model and write-model.
 */
export function mapSettingsToUpdateInput(
  payload: SettingsPayload & FullSettingsPatch,
): UpdateSettingsInput {
  return {
    allowReEntry: payload.allowReEntry,
    rotateSeconds: payload.rotateSeconds,
    maxSeats: payload.maxSeats,
    isActive: payload.isActive,

    dressCode: payload.dressCode ?? null,
    description: payload.description ?? null,

    startsAt: payload.startsAt ?? null,
    endsAt: payload.endsAt ?? null,

    allowPublicRsvp: payload.allowPublicRsvp ?? null,
    allowPublicPlusOne: payload.allowPublicPlusOne ?? null,
    allowPublicRsvpWebsite: payload.allowPublicRsvpWebsite ?? null,
    allowPlusOneUpdate: payload.allowPlusOneUpdate ?? null,
    allowGuestSeatSelection: payload.allowGuestSeatSelection ?? null,
    allowSeatOverbooking: payload.allowSeatOverbooking ?? null,
    maxPlusOnes: payload.maxPlusOnes ?? null,
    requireApprovalForPlusOnes: payload.requireApprovalForPlusOnes ?? null,
    rsvpDeadline: payload.rsvpDeadline ?? null,
    approvalMode: payload.approvalMode ?? null,
    ticketReleaseAt: payload.ticketReleaseAt ?? null,
    publicRsvpWebsite: payload.publicRsvpWebsite ?? null,
    invitedByOptions: payload.invitedByOptions ?? null,
    visibleTabs: payload.visibleTabs ?? null,
    seatColorGroups: payload.seatColorGroups ?? null,
    isPublic: payload.isPublic ?? null,
    category: payload.category ?? null,
  };
}

/**
 * Applies a partial patch on top of an existing payload
 * and converts it into UpdateSettingsInput.
 *
 * WHY:
 * UI works with local mutable state.
 * Backend expects strict DTO.
 */
export function mapSettingsPatchToInput(
  current: SettingsPayload,
  patch: FullSettingsPatch,
): UpdateSettingsInput {
  const merged: SettingsPayload & FullSettingsPatch = {
    ...current,
    ...patch,
  };

  return mapSettingsToUpdateInput(merged);
}
