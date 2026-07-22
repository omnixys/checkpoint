export function mergeMessagesById<T extends { id: string }>(
  current: readonly T[],
  incoming: readonly T[],
): T[] {
  const merged = [...current];
  const indexes = new Map(merged.map((message, index) => [message.id, index]));

  for (const message of incoming) {
    const index = indexes.get(message.id);
    if (index === undefined) {
      indexes.set(message.id, merged.length);
      merged.push(message);
    } else {
      merged[index] = message;
    }
  }

  return merged;
}

export function appendMessageById<T extends { id: string }>(
  current: readonly T[],
  message: T,
): T[] {
  return mergeMessagesById(current, [message]);
}
