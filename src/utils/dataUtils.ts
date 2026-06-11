


export function normalizeStringArray(value: unknown): string[] {
  const values = Array.isArray(value)
    ? value
    : value === undefined || value === null
      ? []
      : [value];

  return values
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'number') {
        return String(item);
      }
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        if (typeof record.name === 'string') {
          return record.name;
        }
        if (typeof record.value === 'string') {
          return record.value;
        }
      }
      return null;
    })
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
