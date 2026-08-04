export type EnvValue = string | number | boolean;

export interface EnvOptions<T extends EnvValue = string> {
  fallback?: string;
  required?: boolean;
  transform?: (value: string) => T;
}

export function getEnv<T extends EnvValue = string>(
  key: string,
  raw: string | undefined,
  options: EnvOptions<T> = {},
): T {
  const value = raw?.trim();
  if (!value) {
    if (options.required) throw new Error(`[ENV] Missing required environment variable: ${key}`);
    if (options.fallback === undefined) return "" as T;
    return applyTransform(key, options.fallback, options.transform);
  }
  return applyTransform(key, value, options.transform);
}

function applyTransform<T extends EnvValue>(
  key: string,
  value: string,
  transformer: ((value: string) => T) | undefined,
): T {
  try {
    return (transformer ? transformer(value) : value) as T;
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "invalid value";
    throw new Error(`[ENV] Invalid environment variable ${key}: ${message}`, { cause });
  }
}

export function toHttpUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("expected an HTTP(S) URL");
  }
  return url.toString().replace(/\/$/, "");
}

export function toWsUrl(value: string): string {
  const url = new URL(value);
  if (url.protocol !== "ws:" && url.protocol !== "wss:") {
    throw new Error("expected a WS(S) URL");
  }
  return url.toString().replace(/\/$/, "");
}

export function toUuidOrEmpty(value: string): string {
  if (!value) return "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error("expected a UUID");
  }
  return value;
}

export function toSampleRate(value: string): number {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) {
    throw new Error("expected a number between 0 and 1");
  }
  return rate;
}

export function toBoolean(value: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error('expected "true" or "false"');
}

export function toNodeEnv(value: string): "development" | "test" | "production" {
  if (value === "development" || value === "test" || value === "production") return value;
  throw new Error("expected development, test, or production");
}

export function toBasePath(value: string): string {
  if (!value.startsWith("/") || (value.length > 1 && !value.endsWith("/"))) {
    throw new Error('expected "/" or a path with leading and trailing slash');
  }
  return value;
}

export function minLength(length: number) {
  return (value: string): string => {
    if (value.length < length) throw new Error(`expected at least ${length} characters`);
    return value;
  };
}
