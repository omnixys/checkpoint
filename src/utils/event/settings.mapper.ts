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

import {
  EventCategory,
  SettingsPayload,
  UpdateSettingsInput,
} from "@/checkpoint/generated/graphql";

type FullSettingsPatch = Partial<SettingsPayload> & {
  allowPublicRsvp?: boolean;
  allowPublicPlusOne?: boolean;
  allowPublicRsvpWebsite?: boolean;
  allowPlusOneUpdate?: boolean;
  publicRsvpWebsite?: string | null;
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

    /**
     * Convert ISO string → Date
     * Required because backend expects GraphQLISODateTime (Date)
     */
    startsAt: payload.startsAt ? new Date(payload.startsAt) : undefined,
    endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,

    ...(payload.allowPublicRsvp !== undefined && { allowPublicRsvp: payload.allowPublicRsvp }),
    ...(payload.allowPublicPlusOne !== undefined && {
      allowPublicPlusOne: payload.allowPublicPlusOne,
    }),
    ...(payload.allowPublicRsvpWebsite !== undefined && {
      allowPublicRsvpWebsite: payload.allowPublicRsvpWebsite,
    }),
    ...(payload.allowPlusOneUpdate !== undefined && {
      allowPlusOneUpdate: payload.allowPlusOneUpdate,
    }),
    ...(payload.publicRsvpWebsite !== undefined && {
      publicRsvpWebsite: payload.publicRsvpWebsite,
    }),
    ...(payload.isPublic !== undefined && { isPublic: payload.isPublic }),
    ...(payload.category !== undefined && { category: payload.category }),
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
