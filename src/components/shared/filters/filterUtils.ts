

import { UnifiedFilters } from './types';
import {
  type ResolvedAccountPhaseWindow,
  tradeMatchesAccountPhaseWindows,
} from './accountPhaseScope';
import {
  getEffectivePnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import {
  type BreakEvenRangeSettings,
  classifyPnLWithBreakEvenSettings,
} from '../../../utils/breakEvenRange';
import type { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';

import {
  type CustomFieldDefinition,
  CustomFieldType,
  isDiscreteCustomFieldFilterable,
} from '../../../types/customFields';
import { inferStoredTradeType } from '../../../utils/tradeTypeRouting';
import {
  normalizeAccountLookupKey,
  normalizeTradeAccountIdentity,
} from '../../../services/trade/core/TradeAccountIdentity';
import { getTradeDirectionDisplayKind } from '../../../services/trade/core/TradeDirection';
import { createTickerMatcher } from '../../../utils/tickerMatching';
import { getTradeBrokerIdentity } from '../../../services/propChallenge/tradeIdentity';
import { hasUnknownCanonicalPnL } from '../../../services/trade/core/CanonicalProjectionFields';
import { type FilterExclusions, hasFilterExclusions } from './filterExclusions';
import {
  getCustomFieldMatchMode,
  matchesSelectedValues,
} from './filterMatchModes';

const ALL_SELECTABLE_TRADE_STATUSES = [
  'open',
  'win',
  'loss',
  'breakeven',
  'cancelled',
] as const;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function normalizeCustomFieldFilterValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value);
  }

  return null;
}

function normalizeDirectionFilterGroup(
  direction: unknown
): 'long' | 'short' | null {
  if (typeof direction !== 'string') {
    return null;
  }

  const normalized = direction.trim().toLowerCase();
  if (normalized === 'long' || normalized === 'call' || normalized === 'buy') {
    return 'long';
  }

  if (normalized === 'short' || normalized === 'put' || normalized === 'sell') {
    return 'short';
  }

  return null;
}

function getTradeDirectionFilterGroup(
  trade: PartialTradeFrontmatter
): 'long' | 'short' | null {
  return normalizeDirectionFilterGroup(getTradeDirectionDisplayKind(trade));
}

function getTradeCustomFieldRawValue(
  trade: Record<string, unknown>,
  field: CustomFieldDefinition
): unknown {
  const rootLevelValue = trade[field.fieldKey];
  if (rootLevelValue !== undefined) {
    return rootLevelValue;
  }

  const nestedCustomFields = asRecord(trade.customFields);
  if (nestedCustomFields) {
    return nestedCustomFields[field.id];
  }

  return undefined;
}


export function applyTradeFilters<T extends object>(
  trades: T[],
  filters: UnifiedFilters | null,
  customFieldDefinitions: CustomFieldDefinition[] = [],
  options: {
    resolveAccountIdDisplayName?: (accountId: string) => string | undefined;
    isTradeOpen?: (trade: T) => boolean;
    breakEvenSettings?: BreakEvenRangeSettings;
    getBreakEvenBalance?: (trade: T) => number | undefined;
    accountPhaseWindows?: readonly ResolvedAccountPhaseWindow[];
  } = {}
): T[] {
  if (!filters) return trades;

  let filtered = trades;

  
  const hasWholeAccountSelection = Boolean(filters.accounts?.length);
  const hasAccountPhaseSelection = Boolean(filters.accountPhases?.length);
  if (hasWholeAccountSelection || hasAccountPhaseSelection) {
    const selectedLookupKeys = hasWholeAccountSelection
      ? new Set(
          filters.accounts.map((account) => normalizeAccountLookupKey(account))
        )
      : undefined;
    const accountPhaseWindows = hasAccountPhaseSelection
      ? (options.accountPhaseWindows ?? [])
      : [];

    filtered = filtered.filter((trade) => {
      const identity = normalizeTradeAccountIdentity(
        Object.fromEntries(Object.entries(trade)),
        {
          resolveAccountIdDisplayName: options.resolveAccountIdDisplayName,
        }
      );

      if (
        selectedLookupKeys &&
        identity.lookupKeys.some((lookupKey) =>
          selectedLookupKeys.has(lookupKey)
        )
      ) {
        return true;
      }

      if (accountPhaseWindows.length === 0) {
        return false;
      }

      return tradeMatchesAccountPhaseWindows(
        trade,
        new Set(identity.lookupKeys),
        getTradeBrokerIdentity({
          accountId: Reflect.get(trade, 'accountId'),
          canonicalAccountId: Reflect.get(trade, 'canonicalAccountId'),
          canonicalAccountIdentity: Reflect.get(
            trade,
            'canonicalAccountIdentity'
          ),
          
          
          
          
          isCopiedTrade: Reflect.get(trade, 'isCopiedTrade'),
        }),
        accountPhaseWindows
      );
    });
  }

  
  if (filters.tickers?.length > 0) {
    const matchesSelectedTicker = createTickerMatcher(filters.tickers);
    filtered = filtered.filter((t) =>
      matchesSelectedTicker((t as PartialTradeFrontmatter).instrument)
    );
  }

  
  
  
  if (filters.setups?.length > 0) {
    
    const selected = new Set<string>();
    for (const setup of filters.setups) {
      if (setup !== '__NO_SETUP__') selected.add(setup.toLowerCase());
    }
    const includesNoSetup = filters.setups.includes('__NO_SETUP__');
    filtered = filtered.filter((t) => {
      const setups = (t as PartialTradeFrontmatter).setup;
      const tradeSetups = Array.isArray(setups)
        ? setups.map((setup) => setup.toLowerCase())
        : [];
      return matchesSelectedValues(
        tradeSetups,
        selected,
        filters.matchModes.setups,
        includesNoSetup
      );
    });
  }

  if (filters.tags?.length > 0) {
    const selected = new Set(
      filters.tags.filter((tag) => tag !== '__NO_TAGS__')
    );
    const includesNoTags = filters.tags.includes('__NO_TAGS__');
    filtered = filtered.filter((t) =>
      matchesSelectedValues(
        (t as PartialTradeFrontmatter).tags ?? [],
        selected,
        filters.matchModes.tags,
        includesNoTags
      )
    );
  }

  if (filters.mistakes?.length > 0) {
    const selected = new Set(
      filters.mistakes.filter((mistake) => mistake !== '__NO_MISTAKES__')
    );
    const includesNoMistakes = filters.mistakes.includes('__NO_MISTAKES__');
    filtered = filtered.filter((t) =>
      matchesSelectedValues(
        getTradeMistakes(t as PartialTradeFrontmatter),
        selected,
        filters.matchModes.mistakes,
        includesNoMistakes
      )
    );
  }

  
  
  
  if (filters.tradeTypes?.length > 0) {
    const tradeTypesSet = new Set(filters.tradeTypes);
    filtered = filtered.filter((t) => {
      const trade = t as T & {
        path?: string;
        type?: unknown;
        isMissedTrade?: boolean;
        isBacktestTrade?: boolean;
      };
      const tradeType = inferStoredTradeType({
        filePath: trade.path,
        type: trade.type,
        isMissedTrade: trade.isMissedTrade,
        isBacktestTrade: trade.isBacktestTrade,
      });

      return tradeTypesSet.has(tradeType);
    });
  }

  
  if (filters.statuses?.length > 0) {
    const explicitlyIncludesAllStatuses = ALL_SELECTABLE_TRADE_STATUSES.every(
      (status) => filters.statuses.includes(status)
    );
    const statusesSet = new Set(filters.statuses);
    filtered = filtered.filter((t) => {
      if ((t as { tradeStatus?: string }).tradeStatus === 'CANCELLED') {
        return statusesSet.has('cancelled');
      }
      const isOpen = options.isTradeOpen
        ? options.isTradeOpen(t)
        : isTradeOpenWithContext(t);

      if (isOpen) {
        return statusesSet.has('open');
      }

      if (hasUnknownCanonicalPnL(t)) {
        return explicitlyIncludesAllStatuses;
      }

      
      const pnl = getEffectivePnL(t);
      const outcome = options.breakEvenSettings
        ? classifyPnLWithBreakEvenSettings(
            pnl,
            options.breakEvenSettings,
            options.getBreakEvenBalance?.(t)
          )
        : pnl > 0
          ? 'win'
          : pnl < 0
            ? 'loss'
            : 'breakeven';

      return statusesSet.has(outcome === 'unknown' ? 'breakeven' : outcome);
    });
  }

  
  if (filters.reviewStatus?.length > 0) {
    const includeReviewed = filters.reviewStatus.includes('reviewed');
    const includeUnreviewed = filters.reviewStatus.includes('unreviewed');

    if (includeReviewed !== includeUnreviewed) {
      filtered = filtered.filter((t) => {
        const isReviewed = (t as PartialTradeFrontmatter).reviewed === true;
        return includeReviewed ? isReviewed : !isReviewed;
      });
    }
  }

  
  if (filters.directions?.length > 0) {
    const selectedDirections = new Set(filters.directions);

    filtered = filtered.filter((t) => {
      const directionGroup = getTradeDirectionFilterGroup(t);
      return directionGroup !== null && selectedDirections.has(directionGroup);
    });
  }

  
  if (
    filters.customFieldFilters &&
    Object.keys(filters.customFieldFilters).length > 0
  ) {
    const fieldDefinitionMap = customFieldDefinitions
      .filter((field) => isDiscreteCustomFieldFilterable(field))
      .reduce<Map<string, CustomFieldDefinition>>((map, field) => {
        map.set(field.id, field);
        return map;
      }, new Map());

    filtered = filtered.filter((trade) => {
      const tradeRecord = Object.fromEntries(Object.entries(trade));

      return Object.entries(filters.customFieldFilters || {}).every(
        ([fieldId, selectedValues]) => {
          if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
            return true;
          }

          const fieldDefinition = fieldDefinitionMap.get(fieldId);
          if (!fieldDefinition) {
            return true;
          }

          const selectedValueSet = new Set(
            selectedValues.flatMap((value) => {
              const normalized = normalizeCustomFieldFilterValue(value);
              return normalized === null ? [] : [normalized];
            })
          );

          if (selectedValueSet.size === 0) {
            return true;
          }

          const rawValue = getTradeCustomFieldRawValue(
            tradeRecord,
            fieldDefinition
          );

          if (fieldDefinition.type === CustomFieldType.MULTISELECT) {
            return matchesSelectedValues(
              getTradeCustomFieldValues(tradeRecord, fieldDefinition),
              selectedValueSet,
              getCustomFieldMatchMode(filters.matchModes, fieldId),
              false
            );
          }

          const normalizedValue = normalizeCustomFieldFilterValue(rawValue);
          return (
            normalizedValue !== null && selectedValueSet.has(normalizedValue)
          );
        }
      );
    });
  }

  if (hasFilterExclusions(filters.exclusions)) {
    filtered = applyTradeExclusions(
      filtered,
      filters.exclusions,
      customFieldDefinitions
    );
  }

  return filtered;
}

function getTradeMistakes(trade: PartialTradeFrontmatter): string[] {
  return Array.isArray(trade.mistake)
    ? trade.mistake
    : trade.mistake
      ? [trade.mistake]
      : [];
}

function getTradeCustomFieldValues(
  tradeRecord: Record<string, unknown>,
  field: CustomFieldDefinition
): string[] {
  const rawValue = getTradeCustomFieldRawValue(tradeRecord, field);
  const rawValues = Array.isArray(rawValue) ? rawValue : [rawValue];
  const values: string[] = [];
  for (const value of rawValues) {
    const normalized = normalizeCustomFieldFilterValue(value);
    if (normalized !== null) values.push(normalized);
  }
  return values;
}


function applyTradeExclusions<T extends object>(
  trades: T[],
  exclusions: FilterExclusions,
  customFieldDefinitions: CustomFieldDefinition[]
): T[] {
  const matchesExcludedTicker =
    exclusions.tickers.length > 0
      ? createTickerMatcher(exclusions.tickers)
      : null;
  const excludesNoSetup = exclusions.setups.includes('__NO_SETUP__');
  const excludedSetups = new Set<string>();
  for (const setup of exclusions.setups) {
    if (setup !== '__NO_SETUP__') excludedSetups.add(setup.toLowerCase());
  }
  const excludesNoTags = exclusions.tags.includes('__NO_TAGS__');
  const excludedTags = new Set(
    exclusions.tags.filter((tag) => tag !== '__NO_TAGS__')
  );
  const excludesNoMistakes = exclusions.mistakes.includes('__NO_MISTAKES__');
  const excludedMistakes = new Set(
    exclusions.mistakes.filter((mistake) => mistake !== '__NO_MISTAKES__')
  );
  const excludedCustomFields: Array<{
    field: CustomFieldDefinition;
    values: Set<string>;
  }> = [];
  for (const field of customFieldDefinitions) {
    const values = exclusions.customFieldFilters[field.id];
    if (!values || values.length === 0) continue;
    if (!isDiscreteCustomFieldFilterable(field)) continue;
    excludedCustomFields.push({ field, values: new Set(values) });
  }

  return trades.filter((t) => {
    const trade = t as PartialTradeFrontmatter;

    if (matchesExcludedTicker && matchesExcludedTicker(trade.instrument)) {
      return false;
    }

    if (excludesNoSetup || excludedSetups.size > 0) {
      const setups = Array.isArray(trade.setup) ? trade.setup : [];
      if (excludesNoSetup && setups.length === 0) return false;
      if (setups.some((setup) => excludedSetups.has(setup.toLowerCase()))) {
        return false;
      }
    }

    if (excludesNoTags || excludedTags.size > 0) {
      const tags = trade.tags ?? [];
      if (excludesNoTags && tags.length === 0) return false;
      if (tags.some((tag) => excludedTags.has(tag))) return false;
    }

    if (excludesNoMistakes || excludedMistakes.size > 0) {
      const mistakes = getTradeMistakes(trade);
      if (excludesNoMistakes && mistakes.length === 0) return false;
      if (mistakes.some((mistake) => excludedMistakes.has(mistake))) {
        return false;
      }
    }

    if (excludedCustomFields.length > 0) {
      const tradeRecord = Object.fromEntries(Object.entries(t));
      for (const { field, values } of excludedCustomFields) {
        if (
          getTradeCustomFieldValues(tradeRecord, field).some((value) =>
            values.has(value)
          )
        ) {
          return false;
        }
      }
    }

    return true;
  });
}
