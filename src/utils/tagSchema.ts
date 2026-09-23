

export const TAG_BUCKETS = {
  TRADE: 'trade',
  PERIODIC: 'periodic',
  ACCOUNT: 'account',
  SETUP: 'setup',
  MISTAKE: 'mistake',
  DIRECTION: 'direction',
  ASSET: 'asset',
  STATUS: 'status',
} as const;


export function formatTagForYAML(tagString: string): string {
  return tagString
    .trim()
    .replace(/\s+/g, '-') 
    .toLowerCase() 
    .replace(/[^a-z0-9-]/g, ''); 
}


export function parseDisplayText(value: string | undefined): string {
  if (!value) return '';

  if (
    typeof value === 'string' &&
    value.startsWith('"') &&
    value.endsWith('"')
  ) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === 'string') {
        const simpleUnwrapped = value.slice(1, -1);
        const looksLegacyEncoded =
          parsed === '' ||
          parsed !== simpleUnwrapped ||
          /[:|>[\]{}*&!%@`]/.test(parsed) ||
          /^(?:true|false|null|~|yes|no|on|off)$/i.test(parsed);

        if (looksLegacyEncoded) {
          return parsed;
        }
      }
    } catch {
      return value;
    }
  }

  return value;
}
