import {
  getQuarterForMonth,
  getWeekFolderName,
} from '../../../utils/dateUtils';
import { ExistingTradePathContext } from './types';

export function sanitizeTradeSymbolForFilename(symbol: string): string {
  if (!symbol) return 'UNKNOWN';

  let sanitized = symbol.trim().toUpperCase();
  sanitized = sanitized
    .replace(/[\\/:*?"<>|+]/g, '')
    .replace(/[\s.[\](){}#%&=;]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');

  if (!sanitized) return 'UNKNOWN';

  const maxSymbolLength = 20;
  if (sanitized.length > maxSymbolLength) {
    sanitized = sanitized.substring(0, maxSymbolLength).replace(/-+$/g, '');
  }

  return sanitized || 'UNKNOWN';
}

export function formatTradeDateForFilename(date: Date, format: string): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  switch (format) {
    case 'MMDDYY':
      return `${month}${day}${year}`;
    case 'YYMMDD':
      return `${year}${month}${day}`;
    case 'DDMMYY':
    default:
      return `${day}${month}${year}`;
  }
}

export function normalizeTradePathDate(dateLike: Date | string): Date {
  const normalized =
    dateLike instanceof Date ? dateLike : new Date(String(dateLike));

  if (!(normalized instanceof Date) || Number.isNaN(normalized.getTime())) {
    throw new Error(`Invalid trade date: ${String(dateLike)}`);
  }

  return normalized;
}

export function getTradePathParts(date: Date) {
  const year = date.getFullYear();
  const monthNum = date.getMonth() + 1;
  const month = String(monthNum).padStart(2, '0');
  const quarter = getQuarterForMonth(monthNum);
  const weekFolderName = getWeekFolderName(date, year);

  return {
    year: String(year),
    quarter,
    month,
    weekFolderName,
  };
}

export function buildTradeDirectoryPath(
  folderPathService: {
    getDatePathForQuarterSync: (...parts: (string | number)[]) => string;
  },
  date: Date,
  tradesFolder = 'trades'
): string {
  const { year, quarter, month, weekFolderName } = getTradePathParts(date);
  return normalizeTradePath(
    folderPathService.getDatePathForQuarterSync(
      year,
      quarter,
      month,
      weekFolderName,
      tradesFolder
    )
  );
}

export function buildTradeFilePath(params: {
  folderPathService: {
    getDatePathForQuarterSync: (...parts: (string | number)[]) => string;
  };
  date: Date;
  symbol: string;
  tradeNumber: number;
  dateFormat: string;
  tradesFolder?: string;
}): string {
  const directory = buildTradeDirectoryPath(
    params.folderPathService,
    params.date,
    params.tradesFolder
  );
  const filename = `${params.symbol}-${formatTradeDateForFilename(params.date, params.dateFormat)}-T${params.tradeNumber}.md`;
  return normalizeTradePath(`${directory}/${filename}`);
}

export function planTradeRelocation(params: {
  current: ExistingTradePathContext;
  nextEntryTime: Date | string;
  nextInstrument?: string;
}) {
  const nextDate = normalizeTradePathDate(params.nextEntryTime);
  const nextTicker = sanitizeTradeSymbolForFilename(
    params.nextInstrument || 'UNKNOWN'
  );
  const oldDate = safeNormalizeTradePathDate(params.current.existingEntryTime);
  const oldTicker = sanitizeTradeSymbolForFilename(
    params.current.existingTicker || 'UNKNOWN'
  );
  const dateChanged = oldDate ? !areDatesOnSameDay(oldDate, nextDate) : true;
  const tickerChanged = nextTicker !== oldTicker;
  const hasRegularTradeFilename = /-T\d+\.md$/i.test(params.current.filePath);
  const needsRegularTradePath =
    !hasRegularTradeFilename ||
    params.current.existingType === 'backtest-trade' ||
    params.current.isMissedTrade === true;

  return {
    required: dateChanged || tickerChanged || needsRegularTradePath,
    dateChanged,
    tickerChanged,
    needsRegularTradePath,
    normalizedEntryTime: nextDate,
    normalizedTicker: nextTicker,
  };
}

function normalizeTradePath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

function safeNormalizeTradePathDate(
  dateLike: Date | string | null | undefined
): Date | null {
  if (!dateLike) {
    return null;
  }

  try {
    return normalizeTradePathDate(dateLike);
  } catch {
    return null;
  }
}

function areDatesOnSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
