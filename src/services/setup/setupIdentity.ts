export function normalizeSetupKey(value: string): string {
  return value
    .trim()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}
