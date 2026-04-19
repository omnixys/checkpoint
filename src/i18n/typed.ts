import type { Messages } from "./messages";

/**
 * Flatten nested object keys into dot-notation
 * e.g. { a: { b: string } } -> "a.b"
 */
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<
          keyof T,
          symbol
        >]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

/**
 * Keys of a namespace, e.g. "sidebar.home"
 */
export type NamespaceKeys<N extends keyof Messages> = DotNestedKeys<
  Messages[N]
>;
