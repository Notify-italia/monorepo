export type UnknownType = any;

type anyObject = Record<string, unknown>;

export type ModifyDeep<A, B extends DeepPartialAny<A>> = {
  [K in keyof A | keyof B]: K extends keyof A // For all keys in A and B: // ───┐
    ? K extends keyof B // ───┼─ key K exists in both A and B
      ? A[K] extends anyObject //    │  ┴──┐
        ? B[K] extends anyObject //    │  ───┼─ both A and B are objects
          ? ModifyDeep<A[K], B[K]> //    │     │  └─── We need to go deeper (recursively)
          : B[K] //    │     ├─ B is a primitive 🠆 use B as the final type (new type)
        : B[K] //    │     └─ A is a primitive 🠆 use B as the final type (new type)
      : A[K] //    ├─ key only exists in A 🠆 use A as the final type (original type)
    : B[K]; //    └─ key only exists in B 🠆 use B as the final type (new type)
};

// This type is here only for some intellisense for the overrides object
type DeepPartialAny<T> = {
  /** Makes each property optional and turns each leaf property into any, allowing for type overrides by narrowing any. */
  [P in keyof T]?: T[P] extends anyObject ? DeepPartialAny<T[P]> : unknown;
};
