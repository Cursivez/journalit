import { generateUUID } from './uuid';

const TRADE_SCHEMA_VERSION = 1;

export type TradeId = string;

function createTradeId(): TradeId {
  return `trade_${generateUUID()}`;
}

export function getTradeIdValue(value: unknown): TradeId | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function getSchemaVersionValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
}

function isBooleanTrue(value: unknown): boolean {
  return value === true || value === 'true';
}

export function getTradeIdentityNoteType(
  frontmatter: Record<string, unknown> | null | undefined,
  filePath?: string
): 'trade' | 'backtest-trade' | null {
  if (
    typeof frontmatter?.type === 'string' &&
    frontmatter.type !== 'trade' &&
    frontmatter.type !== 'backtest-trade' &&
    frontmatter.type !== 'missed-trade'
  ) {
    return null;
  }

  if (
    isBooleanTrue(frontmatter?.isMissedTrade) ||
    frontmatter?.type === 'missed-trade' ||
    (typeof filePath === 'string' && /-M\d+\.md$/i.test(filePath))
  ) {
    return null;
  }

  if (
    frontmatter?.type === 'backtest-trade' ||
    frontmatter?.isBacktestTrade === true ||
    frontmatter?.isBacktestTrade === 'true' ||
    (typeof filePath === 'string' && /-B\d+\.md$/i.test(filePath))
  ) {
    return 'backtest-trade';
  }

  if (
    frontmatter?.type === 'trade' ||
    (typeof filePath === 'string' && /-T\d+\.md$/i.test(filePath))
  ) {
    return 'trade';
  }

  return null;
}

export function isTradeIdentityEligibleNote(
  frontmatter: Record<string, unknown> | null | undefined,
  filePath?: string
): boolean {
  return getTradeIdentityNoteType(frontmatter, filePath) !== null;
}

export function getTradeIdentityFields(
  source?: Record<string, unknown> | null
): { tradeId?: TradeId; schemaVersion?: number } {
  return {
    tradeId: getTradeIdValue(source?.tradeId),
    schemaVersion: getSchemaVersionValue(source?.schemaVersion),
  };
}

export function getTradeIdentityFieldsFromContent(content: string): {
  tradeId?: TradeId;
  schemaVersion?: number;
} {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = frontmatterMatch[1];
  const tradeIdMatch = frontmatter.match(/^tradeId:\s*(.+)$/m);
  const schemaVersionMatch = frontmatter.match(/^schemaVersion:\s*(.+)$/m);

  const tradeIdValue = tradeIdMatch?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  const schemaVersionValue = schemaVersionMatch?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '');

  return {
    tradeId: getTradeIdValue(tradeIdValue),
    schemaVersion: getSchemaVersionValue(schemaVersionValue),
  };
}

export function buildTradeIdentityFields(
  source?: Record<string, unknown> | null
): { tradeId: TradeId; schemaVersion: number } {
  const existingTradeId = getTradeIdValue(source?.tradeId);
  const existingSchemaVersion = getSchemaVersionValue(source?.schemaVersion);

  return {
    tradeId: existingTradeId ?? createTradeId(),
    schemaVersion: Math.max(
      existingSchemaVersion ?? TRADE_SCHEMA_VERSION,
      TRADE_SCHEMA_VERSION
    ),
  };
}

export function ensureTradeIdentityFrontmatter(
  frontmatter: Record<string, unknown>,
  options?: { forceNewTradeId?: boolean }
): {
  tradeId: TradeId;
  schemaVersion: number;
  changed: boolean;
  previousTradeId?: TradeId;
} {
  const previousTradeId = getTradeIdValue(frontmatter.tradeId);
  const nextTradeId = options?.forceNewTradeId
    ? createTradeId()
    : (previousTradeId ?? createTradeId());
  const nextSchemaVersion = Math.max(
    getSchemaVersionValue(frontmatter.schemaVersion) ?? TRADE_SCHEMA_VERSION,
    TRADE_SCHEMA_VERSION
  );

  const changed =
    previousTradeId !== nextTradeId ||
    getSchemaVersionValue(frontmatter.schemaVersion) !== nextSchemaVersion;

  frontmatter.tradeId = nextTradeId;
  frontmatter.schemaVersion = nextSchemaVersion;

  return {
    tradeId: nextTradeId,
    schemaVersion: nextSchemaVersion,
    changed,
    previousTradeId,
  };
}
