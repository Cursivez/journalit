export const UNTAGGED_SETUP_FILTER_VALUE =
  '\u0000journalit:setup-filter:untagged';

export function isSyntheticSetupTagFilterValue(value: string): boolean {
  return value.toLowerCase() === UNTAGGED_SETUP_FILTER_VALUE.toLowerCase();
}
