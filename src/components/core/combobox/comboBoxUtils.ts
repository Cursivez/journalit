export const ADD_OPTION_PREFIX = '__add__';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeComboBoxOptions(
  options: readonly unknown[]
): string[] {
  return options.flatMap((option) => {
    if (typeof option === 'string') {
      return [option];
    }

    if (
      typeof option === 'number' ||
      typeof option === 'boolean' ||
      typeof option === 'bigint'
    ) {
      return [String(option)];
    }

    return [];
  });
}

export function getSelectedValues(value: string | string[], isMulti: boolean) {
  return isMulti && Array.isArray(value) ? [...value] : [];
}

export function getFilteredComboBoxOptions({
  normalizedOptions,
  inputValue,
  isMulti,
  value,
}: {
  normalizedOptions: string[];
  inputValue: string;
  isMulti: boolean;
  value: string | string[];
}): string[] {
  const selectedValues =
    isMulti && Array.isArray(value) ? value.map(String) : [];
  const selectedValueSet = new Set(selectedValues);
  const query = inputValue.toLowerCase();
  const queryPattern = new RegExp(escapeRegExp(query));
  const filtered: string[] = [];

  for (const option of normalizedOptions) {
    if (!queryPattern.test(option.toLowerCase())) continue;
    if (isMulti && selectedValueSet.has(option)) continue;
    filtered.push(option);
  }

  return filtered;
}

export function shouldShowAddOption({
  allowCreate,
  inputValue,
  normalizedOptions,
}: {
  allowCreate: boolean;
  inputValue: string;
  normalizedOptions: string[];
}): boolean {
  return (
    allowCreate &&
    inputValue.trim() !== '' &&
    !normalizedOptions.find(
      (option) => option.toLowerCase() === inputValue.toLowerCase()
    )
  );
}

export function getSelectedOptionValue(selected: string): string {
  return selected.startsWith(ADD_OPTION_PREFIX)
    ? selected.slice(ADD_OPTION_PREFIX.length)
    : selected;
}

export function isAddOption(selected: string): boolean {
  return selected.startsWith(ADD_OPTION_PREFIX);
}

export function shouldSaveCustomOption(
  optionType: string | undefined,
  value: string
): boolean {
  if (optionType !== 'instrument') return true;
  return /^[A-Z0-9.]+$/i.test(value);
}
