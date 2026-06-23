type TradeAccountIdentitySource = 'account';

export interface TradeAccountRef {
  value: string;
  source: TradeAccountIdentitySource;
  lookupKey: string;
}

interface TradeAccountIdentity {
  refs: TradeAccountRef[];
  accountNames: string[];
  lookupKeys: string[];
}

function toLookupKey(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const normalized = String(item).trim();
      return normalized ? [normalized] : [];
    });
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
}

export function normalizeTradeAccountIdentity(
  tradeLike: Record<string, unknown>,
  ..._ignoredLegacyOptions: Array<{
    resolveAccountIdDisplayName?: (accountId: string) => string | undefined;
  }>
): TradeAccountIdentity {
  const refs: TradeAccountRef[] = [];
  const seen = new Set<string>();

  for (const value of normalizeStringArray(tradeLike.account)) {
    const lookupKey = toLookupKey(value);
    if (!lookupKey || seen.has(lookupKey)) {
      continue;
    }

    seen.add(lookupKey);
    refs.push({ value, source: 'account', lookupKey });
  }

  const accountNames = refs.map((ref) => ref.value);
  const lookupKeys = refs.map((ref) => ref.lookupKey);

  return { refs, accountNames, lookupKeys };
}

export function normalizeAccountLookupKey(value: string): string {
  return toLookupKey(value);
}
