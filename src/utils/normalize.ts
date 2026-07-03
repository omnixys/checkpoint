export function normalizeArray<T>(value?: T[] | null): T[] {
  return value ?? [];
}

export function required<T>(value: T | null | undefined, name: string): T {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
