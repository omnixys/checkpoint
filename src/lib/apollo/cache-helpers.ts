import type { Reference } from "@apollo/client";

/**
 * Inserts entity into list without duplicates.
 */
export function addToList(
  existing: readonly Reference[],
  incoming: Reference,
  readField: (fieldName: string, ref: Reference) => unknown,
): Reference[] {
  const exists = existing.some((ref) => readField("id", ref) === readField("id", incoming));

  if (exists) {
    return [...existing];
  }

  return [incoming, ...existing];
}

/**
 * Replaces entity in list.
 */
export function replaceInList(
  existing: readonly Reference[],
  incoming: Reference,
  readField: (fieldName: string, ref: Reference) => unknown,
): Reference[] {
  return existing.map((ref) =>
    readField("id", ref) === readField("id", incoming) ? incoming : ref,
  );
}

/**
 * Removes entity from list.
 */
export function removeFromList(
  existing: readonly Reference[],
  id: string,
  readField: (fieldName: string, ref: Reference) => unknown,
): Reference[] {
  return existing.filter((ref) => readField("id", ref) !== id);
}
