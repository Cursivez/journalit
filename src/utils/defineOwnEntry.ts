
export function defineOwnEntry<T>(
  target: Record<string, T>,
  key: string,
  value: T
): void {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
}
