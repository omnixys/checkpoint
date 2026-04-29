export type StripMeta<T> = T extends object ? Omit<T, "__typename"> : T;
export type Safe<T> = NonNullable<T>;
export type Field<T, K extends keyof NonNullable<T>> = NonNullable<NonNullable<T>[K]>;
