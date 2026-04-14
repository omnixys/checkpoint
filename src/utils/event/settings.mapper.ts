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

import { SettingsPayload, UpdateSettingsInput } from "@/checkpoint/generated/graphql";

/**
 * Maps SettingsPayload (GraphQL response)
 * into UpdateSettingsInput (GraphQL mutation input)
 *
 * WHY:
 * GraphQL responses contain fields that are NOT allowed in input types.
 * This mapper guarantees clean separation between read-model and write-model.
 */
export function mapSettingsToUpdateInput(payload: SettingsPayload): UpdateSettingsInput {
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
  patch: Partial<SettingsPayload>,
): UpdateSettingsInput {
  const merged: SettingsPayload = {
    ...current,
    ...patch,
  };

  return mapSettingsToUpdateInput(merged);
}
