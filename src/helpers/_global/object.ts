export const deepEqual = <T, U>(valueA: T, valueB: U): valueA is T & U => {
  if (typeof valueA !== typeof valueB) {
    return false;
  }

  if (
    (!isObj(valueA) && !isArray(valueA)) ||
    (!isObj(valueB) && !isArray(valueB))
  ) {
    return (valueA as unknown) === (valueB as unknown);
  }

  const keysA = Object.keys(valueA);
  const keysB = Object.keys(valueB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => deepEqual(valueA[key], valueB[key]));
};

export const match =
  <T extends () => ReturnType<T>>(value: string) =>
  (callbackObj: Record<string, T>, defaultCallback?: T) =>
    value in callbackObj ? callbackObj[value] : defaultCallback;
