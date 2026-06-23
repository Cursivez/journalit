


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


export const PERIODIC_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const;


export const STATUS_TYPES = {
  NEEDS_REVIEW: 'needs-review',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;


type PeriodicType = (typeof PERIODIC_TYPES)[keyof typeof PERIODIC_TYPES];
type StatusType = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];


export function formatTagForYAML(tagString: string): string {
  return tagString
    .trim()
    .replace(/\s+/g, '-') 
    .toLowerCase() 
    .replace(/[^a-z0-9-]/g, ''); 
}


export function generateSlug(filePath: string): string {
  
  const filename = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
  return formatTagForYAML(filename);
}


export function generateTradeTag(): string {
  return TAG_BUCKETS.TRADE;
}


export function generatePeriodicTag(type: PeriodicType): string {
  return `${TAG_BUCKETS.PERIODIC}/${type}`;
}


export function generateAccountTag(filePath: string): string {
  const slug = generateSlug(filePath);
  return `${TAG_BUCKETS.ACCOUNT}/${slug}`;
}


export function generateSetupTags(setups: string[]): string[] {
  return setups.flatMap((setup) => {
    if (!setup?.trim()) return [];
    const tag = `${TAG_BUCKETS.SETUP}/${formatTagForYAML(setup)}`;
    return tag.endsWith('/') ? [] : [tag];
  });
}


export function generateMistakeTags(mistakes: string[]): string[] {
  return mistakes.flatMap((mistake) => {
    if (!mistake?.trim()) return [];
    const tag = `${TAG_BUCKETS.MISTAKE}/${formatTagForYAML(mistake)}`;
    return tag.endsWith('/') ? [] : [tag];
  });
}


export function generateDirectionTag(direction: string): string {
  const formattedDirection = formatTagForYAML(direction);
  return `${TAG_BUCKETS.DIRECTION}/${formattedDirection}`;
}


export function generateAssetTag(assetType: string): string {
  const formattedAsset = formatTagForYAML(assetType);
  return `${TAG_BUCKETS.ASSET}/${formattedAsset}`;
}


export function generateStatusTag(status: StatusType): string {
  return `${TAG_BUCKETS.STATUS}/${status}`;
}


export function generateContextualTags(_date: Date): string[] {
  
  
  
  return [];
}


export function meetsMinimumThreshold(
  tag: string,
  tagCounts: Record<string, number>,
  minThreshold: number = 3
): boolean {
  return (tagCounts[tag] || 0) >= minThreshold;
}


export function isValidTag(tag: string): boolean {
  
  if (tag !== tag.toLowerCase()) {
    return false;
  }

  
  if (!/^[a-z0-9-/]+$/.test(tag)) {
    return false;
  }

  
  const levels = tag.split('/');
  if (levels.length > 2) {
    return false;
  }

  
  if (!tag.trim()) {
    return false;
  }

  return true;
}


export function filterTagsByThreshold(
  tags: string[],
  tagCounts: Record<string, number>,
  minThreshold: number = 3
): string[] {
  return tags.filter((tag) =>
    meetsMinimumThreshold(tag, tagCounts, minThreshold)
  );
}


export function removeDuplicateTags(tags: string[]): string[] {
  return Array.from(new Set(tags.filter(Boolean)));
}


export function combineTags(...tagArrays: string[][]): string[] {
  const combined = tagArrays.flat();
  return removeDuplicateTags(combined);
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

export {};
