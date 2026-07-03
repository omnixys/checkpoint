// src/checkpoint/mappers/plus-one.mapper.ts

import type { PublicPlusOneInput } from "@/checkpoint/generated/graphql";

/**
 * Ensures backend-safe payload
 * Removes empty fields and normalizes structure
 */
export function mapPlusOnes(plusOnes: PublicPlusOneInput[]): PublicPlusOneInput[] {
  return plusOnes
    .filter((p) => p.firstName && p.lastName && p.plusOneAgeCategory)
    .map((p) => ({
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      email: p.email ?? null,
      plusOneAgeCategory: p.plusOneAgeCategory,
      phoneNumbers: p.phoneNumbers ?? null,
    }));
}
