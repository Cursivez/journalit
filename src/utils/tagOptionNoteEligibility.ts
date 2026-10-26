import { SETUP_FRONTMATTER_KEY } from '../services/setup/constants';
import { getTradeIdentityNoteType } from './tradeIdentity';
import { inferStoredTradeType } from './tradeTypeRouting';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

const DEFAULT_JOURNAL_FOLDER = '!Journalit';
const BACKTEST_TRADE_FILENAME_PATTERN = /(-B\d+\.md$|TMB.*\.md$)/;

export function resolveJournalFolderPath(settings: unknown): string {
  if (!isRecord(settings)) return DEFAULT_JOURNAL_FOLDER;
  const general = settings.general;
  if (!isRecord(general)) return DEFAULT_JOURNAL_FOLDER;
  const configured = general.journalFolderPath;
  return typeof configured === 'string' && configured.length > 0
    ? configured
    : DEFAULT_JOURNAL_FOLDER;
}

export function isJournalitJournalPath(
  filePath: string,
  journalFolder: string
): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedJournalFolder = journalFolder
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '');
  if (normalizedPath.includes('-backup-')) return false;
  return (
    normalizedPath === normalizedJournalFolder ||
    normalizedPath.startsWith(`${normalizedJournalFolder}/`)
  );
}

export function isSetupDefinitionNote(
  frontmatter: Record<string, unknown>
): boolean {
  return frontmatter[SETUP_FRONTMATTER_KEY] === true;
}

export function isBacktestTradeFilename(filePath: string): boolean {
  return BACKTEST_TRADE_FILENAME_PATTERN.test(filePath);
}

function isFilenameOnlyBacktestTradePath(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (!normalizedPath.includes('/trades/')) return false;
  return isBacktestTradeFilename(normalizedPath);
}

type TagOptionTradeKind = 'trade' | 'missed_trade' | 'backtest_trade';

export function classifyTagOptionTradeKind(
  frontmatter: Record<string, unknown>,
  filePath: string
): TagOptionTradeKind | undefined {
  const identity = getTradeIdentityNoteType(frontmatter, filePath);
  if (identity === 'trade') return 'trade';
  if (identity === 'backtest-trade') return 'backtest_trade';
  if (
    inferStoredTradeType({
      filePath,
      type: frontmatter.type,
      isMissedTrade:
        frontmatter.isMissedTrade === true ||
        frontmatter.isMissedTrade === 'true',
      isBacktestTrade: frontmatter.isBacktestTrade,
    }) === 'missed'
  ) {
    return 'missed_trade';
  }
  if (isFilenameOnlyBacktestTradePath(filePath)) return 'backtest_trade';
  return undefined;
}

export function isTagOptionTradeEligibleNote(
  frontmatter: Record<string, unknown>,
  filePath: string
): boolean {
  return classifyTagOptionTradeKind(frontmatter, filePath) !== undefined;
}
