export type ComboBoxItem =
  | { kind: 'option'; value: string; label: string }
  | { kind: 'create'; value: string };


export function normalizeComboBoxOptions(
  options: readonly unknown[]
): string[] {
  const values = options.flatMap((option) => {
    if (typeof option === 'string') return option.trim() ? [option] : [];
    if (
      typeof option === 'number' ||
      typeof option === 'boolean' ||
      typeof option === 'bigint'
    )
      return [String(option)];
    return [];
  });
  return [...new Set(values)];
}

export function getComboBoxItems({
  options,
  selected,
  query,
  isMulti,
  allowCreate,
  getOptionLabel,
}: {
  options: readonly string[];
  selected: ReadonlySet<string>;
  query: string;
  isMulti: boolean;
  allowCreate: boolean;
  getOptionLabel: (value: string) => string;
}): ComboBoxItem[] {
  const search = query.trim().toLocaleLowerCase();
  const items: ComboBoxItem[] = [];
  let hasExactMatch = false;
  for (const value of selected) {
    if (
      value.toLocaleLowerCase() === search ||
      getOptionLabel(value).toLocaleLowerCase() === search
    ) {
      hasExactMatch = true;
      break;
    }
  }
  for (const value of options) {
    const label = getOptionLabel(value);
    const normalizedLabel = label.toLocaleLowerCase();
    if (normalizedLabel === search || value.toLocaleLowerCase() === search) {
      hasExactMatch = true;
    }
    if (isMulti && selected.has(value)) continue;
    if (normalizedLabel.includes(search))
      items.push({ kind: 'option', value, label });
  }
  if (allowCreate && search && !hasExactMatch) {
    items.push({ kind: 'create', value: query.trim() });
  }
  return items;
}
