export type Translator<K extends string = string> = (
  key: K,
  values?: Record<string, unknown>,
) => string;

export function formatEnum<T extends (key: any, values?: any) => string>(
  t: T,
  enumName: string,
  value: string | number | null | undefined,
): string {
  if (!value) return "—";

  const key = `${enumName}.${value}` as Parameters<T>[0];

  return t(key);
}
