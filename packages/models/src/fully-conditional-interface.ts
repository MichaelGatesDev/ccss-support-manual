export type FullyConditionalInterface<T> = {
  [P in keyof Partial<T>]: Pick<T, P> extends Partial<Pick<T, P>> ? T[P] : T[P] | undefined;
};
