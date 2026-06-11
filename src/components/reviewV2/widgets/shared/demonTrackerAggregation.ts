

import type { PartialTradeFrontmatter } from '../../../../types/TradeFrontmatter';
import type {
  DemonTrackerCountMode,
  DemonTrackerSourceMode,
  DemonTrackerWidgetConfig,
} from '../../../../types/reviewV2';
import { getTradingDayString } from '../../../../utils/tradingDayUtils';
import type { DemonTrackerEntry } from '../../../../services/monthly/types';

interface ScalperDefaultsLike {
  countMode?: DemonTrackerCountMode;
  sourceMode?: DemonTrackerSourceMode;
}

interface PluginWithTradeSettings {
  settings?: {
    trade?: {
      tradingDayCutoffTime?: string;
    };
  };
}

interface ResolvedDemonTrackerModes {
  countMode: DemonTrackerCountMode;
  sourceMode: DemonTrackerSourceMode;
}

interface AggregateDemonTrackerInput {
  trades: PartialTradeFrontmatter[];
  sessionMistakesByTradingDay?: Record<string, string[]>;
  countMode: DemonTrackerCountMode;
  sourceMode: DemonTrackerSourceMode;
  plugin?: PluginWithTradeSettings;
  mistakesFilter?: string[] | null;
}

const FALLBACK_COUNT_MODE: DemonTrackerCountMode = 'per-trade';
const FALLBACK_SOURCE_MODE: DemonTrackerSourceMode = 'trades';

const NO_MISTAKES_SENTINEL = '__NO_MISTAKES__';

function isCountMode(value: unknown): value is DemonTrackerCountMode {
  return value === 'per-trade' || value === 'per-trading-day';
}

function isSourceMode(value: unknown): value is DemonTrackerSourceMode {
  return value === 'trades' || value === 'session' || value === 'combined';
}

function normalizeMistake(value: unknown): string | null {
  const normalized = String(value ?? '').trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeMistakeList(values: unknown[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const mistake = normalizeMistake(value);
    if (!mistake) continue;

    const key = mistake.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    normalized.push(mistake);
  }

  return normalized;
}

function normalizeMistakeFilter(mistakesFilter?: string[] | null): {
  onlyNoMistakes: boolean;
  allowed: Set<string>;
} {
  const rawFilter = Array.isArray(mistakesFilter) ? mistakesFilter : [];

  const includesNoMistakes = rawFilter.includes(NO_MISTAKES_SENTINEL);
  const allowed = new Set<string>();

  for (const filterValue of rawFilter) {
    const normalized = normalizeMistake(filterValue);
    if (!normalized || normalized === NO_MISTAKES_SENTINEL) continue;
    allowed.add(normalized.toLowerCase());
  }

  return {
    onlyNoMistakes: includesNoMistakes && allowed.size === 0,
    allowed,
  };
}

function pushOccurrence(
  map: Map<string, DemonTrackerEntry>,
  mistake: string,
  dateRef: string
): void {
  const lookupKey = mistake.toLowerCase();
  const existing = map.get(lookupKey);
  if (existing) {
    existing.occurrences += 1;
    existing.dates.push(dateRef);
    return;
  }

  map.set(lookupKey, {
    mistake,
    occurrences: 1,
    dates: [dateRef],
  });
}

function extractTradeMistakes(trade: PartialTradeFrontmatter): string[] {
  if (!Array.isArray(trade.mistake)) return [];
  return normalizeMistakeList(trade.mistake);
}

function getTradeDateInfo(
  trade: PartialTradeFrontmatter,
  plugin?: PluginWithTradeSettings
): { tradingDay: string; dateRef: string } | null {
  if (!trade.entryTime) return null;

  const parsed = new Date(trade.entryTime);
  if (isNaN(parsed.getTime())) return null;

  const tradingDay = getTradingDayString(parsed, plugin);
  const dateRef =
    typeof trade.entryTime === 'string'
      ? trade.entryTime
      : parsed.toISOString();

  return { tradingDay, dateRef };
}

function isMistakeAllowed(mistake: string, allowed: Set<string>): boolean {
  if (allowed.size === 0) return true;
  return allowed.has(mistake.toLowerCase());
}

export function resolveDemonTrackerModes(
  config?: DemonTrackerWidgetConfig,
  scalperDefaults?: ScalperDefaultsLike
): ResolvedDemonTrackerModes {
  const configuredCountMode = config?.countMode;
  const configuredSourceMode = config?.sourceMode;

  const defaultCountMode = scalperDefaults?.countMode;
  const defaultSourceMode = scalperDefaults?.sourceMode;

  const countMode = isCountMode(configuredCountMode)
    ? configuredCountMode
    : isCountMode(defaultCountMode)
      ? defaultCountMode
      : FALLBACK_COUNT_MODE;

  const sourceMode = isSourceMode(configuredSourceMode)
    ? configuredSourceMode
    : isSourceMode(defaultSourceMode)
      ? defaultSourceMode
      : FALLBACK_SOURCE_MODE;

  return { countMode, sourceMode };
}

export function aggregateDemonTrackerData({
  trades,
  sessionMistakesByTradingDay,
  countMode,
  sourceMode,
  plugin,
  mistakesFilter,
}: AggregateDemonTrackerInput): DemonTrackerEntry[] {
  const { onlyNoMistakes, allowed } = normalizeMistakeFilter(mistakesFilter);

  if (onlyNoMistakes) {
    return [];
  }

  const mistakeMap = new Map<string, DemonTrackerEntry>();
  const seenTradeDayMistakes = new Set<string>();
  const seenSessionDayMistakes = new Set<string>();
  const seenCombinedDayMistakes = new Set<string>();

  const shouldUseTrades = sourceMode === 'trades' || sourceMode === 'combined';
  const shouldUseSession =
    sourceMode === 'session' || sourceMode === 'combined';

  if (shouldUseTrades) {
    for (const trade of trades) {
      const dateInfo = getTradeDateInfo(trade, plugin);
      if (!dateInfo) continue;

      const mistakes = extractTradeMistakes(trade);
      for (const mistake of mistakes) {
        if (!isMistakeAllowed(mistake, allowed)) continue;

        if (countMode === 'per-trading-day') {
          const dedupeKey = `${dateInfo.tradingDay}::${mistake.toLowerCase()}`;
          const dedupeSet =
            sourceMode === 'combined'
              ? seenCombinedDayMistakes
              : seenTradeDayMistakes;

          if (dedupeSet.has(dedupeKey)) {
            continue;
          }

          dedupeSet.add(dedupeKey);
          pushOccurrence(mistakeMap, mistake, dateInfo.tradingDay);
          continue;
        }

        pushOccurrence(mistakeMap, mistake, dateInfo.dateRef);
      }
    }
  }

  if (shouldUseSession) {
    const entries = Object.entries(sessionMistakesByTradingDay ?? {});

    for (const [tradingDay, rawMistakes] of entries) {
      const mistakes = Array.isArray(rawMistakes)
        ? normalizeMistakeList(rawMistakes)
        : [];

      for (const mistake of mistakes) {
        if (!isMistakeAllowed(mistake, allowed)) continue;

        if (countMode === 'per-trading-day') {
          const dedupeKey = `${tradingDay}::${mistake.toLowerCase()}`;
          const dedupeSet =
            sourceMode === 'combined'
              ? seenCombinedDayMistakes
              : seenSessionDayMistakes;

          if (dedupeSet.has(dedupeKey)) {
            continue;
          }

          dedupeSet.add(dedupeKey);
        }

        pushOccurrence(mistakeMap, mistake, tradingDay);
      }
    }
  }

  return Array.from(mistakeMap.values()).sort((a, b) => {
    if (b.occurrences !== a.occurrences) {
      return b.occurrences - a.occurrences;
    }

    return a.mistake.localeCompare(b.mistake);
  });
}
