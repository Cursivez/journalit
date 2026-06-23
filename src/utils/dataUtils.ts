


export function normalizeStringArray(value: unknown): string[] {
  const normalized: string[] = [];
  const appendValue = (item: unknown): void => {
    if (typeof item === 'string') {
      normalized.push(item);
      return;
    }
    if (typeof item === 'number') {
      normalized.push(String(item));
      return;
    }
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      const name: unknown = Reflect.get(item, 'name');
      if (typeof name === 'string') {
        normalized.push(name);
        return;
      }
      const itemValue: unknown = Reflect.get(item, 'value');
      if (typeof itemValue === 'string') {
        normalized.push(itemValue);
      }
    }
  };

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const item: unknown = value[index];
      appendValue(item);
    }
  } else if (value !== undefined && value !== null) {
    appendValue(value);
  }

  return normalized.flatMap((item) => {
    const trimmed = item.trim();
    return trimmed ? [trimmed] : [];
  });
}
