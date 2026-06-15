

import { UnifiedFilters } from './types';
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
import { createTickerMatcher } from '../../../utils/tickerMatching';

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
  } = {}
): T[] {
  if (!filters) return trades;

  let filtered = trades;

  
  if (filters.accounts?.length > 0) {
    const selectedLookupKeys = new Set(
      filters.accounts.map((account) => normalizeAccountLookupKey(account))
    );

    filtered = filtered.filter((trade) => {
      const identity = normalizeTradeAccountIdentity(
        Object.fromEntries(Object.entries(trade)),
        {
          resolveAccountIdDisplayName: options.resolveAccountIdDisplayName,
        }
      );

      return identity.lookupKeys.some((lookupKey) =>
        selectedLookupKeys.has(lookupKey)
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
    const hasNoSetupFilter = filters.setups.includes('__NO_SETUP__');
    const regularSetups = filters.setups.filter((s) => s !== '__NO_SETUP__');

    filtered = filtered.filter((t) => {
      const trade = t as PartialTradeFrontmatter;
      const hasNoSetup = !trade.setup || trade.setup.length === 0;

      
      if (hasNoSetupFilter && hasNoSetup) return true;

      
      if (
        regularSetups.length > 0 &&
        trade.setup &&
        Array.isArray(trade.setup) &&
        trade.setup.length > 0
      ) {
        return trade.setup.some((tradeSetup: string) =>
          regularSetups.some(
            (filterSetup: string) =>
              tradeSetup.toLowerCase() === filterSetup.toLowerCase()
          )
        );
      }

      return false;
    });
  }

  
  if (filters.tags?.length > 0) {
    const hasNoTagsFilter = filters.tags.includes('__NO_TAGS__');
    const regularTags = filters.tags.filter((tag) => tag !== '__NO_TAGS__');

    filtered = filtered.filter((t) => {
      const trade = t as PartialTradeFrontmatter;
      const hasNoTags = !trade.tags || trade.tags.length === 0;

      
      if (hasNoTagsFilter && hasNoTags) return true;

      
      if (
        regularTags.length > 0 &&
        trade.tags?.some((tag: string) => regularTags.includes(tag))
      ) {
        return true;
      }

      return false;
    });
  }

  
  if (filters.mistakes?.length > 0) {
    const hasNoMistakesFilter = filters.mistakes.includes('__NO_MISTAKES__');
    const regularMistakes = filters.mistakes.filter(
      (mistake) => mistake !== '__NO_MISTAKES__'
    );

    filtered = filtered.filter((t) => {
      const trade = t as PartialTradeFrontmatter;
      const mistakes = Array.isArray(trade.mistake)
        ? trade.mistake
        : trade.mistake
          ? [trade.mistake]
          : [];
      const hasNoMistakes = mistakes.length === 0;

      
      if (hasNoMistakesFilter && hasNoMistakes) return true;

      if (regularMistakes.length > 0) {
        return regularMistakes.some((mistake) => mistakes.includes(mistake));
      }

      return false;
    });
  }

  
  
  
  if (filters.tradeTypes?.length > 0) {
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

      return filters.tradeTypes.includes(tradeType);
    });
  }

  
  if (filters.statuses?.length > 0) {
    filtered = filtered.filter((t) => {
      const isOpen = options.isTradeOpen
        ? options.isTradeOpen(t)
        : isTradeOpenWithContext(t as PartialTradeFrontmatter);

      if (isOpen) {
        return filters.statuses.includes('open');
      }

      
      const pnl = getEffectivePnL(t as PartialTradeFrontmatter);
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

      return filters.statuses.includes(
        outcome === 'unknown' ? 'breakeven' : outcome
      );
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
            selectedValues
              .map((value) => normalizeCustomFieldFilterValue(value))
              .filter((value): value is string => value !== null)
          );

          if (selectedValueSet.size === 0) {
            return true;
          }

          const rawValue = getTradeCustomFieldRawValue(
            tradeRecord,
            fieldDefinition
          );

          if (fieldDefinition.type === CustomFieldType.MULTISELECT) {
            const tradeValues = Array.isArray(rawValue)
              ? rawValue
                  .map((value) => normalizeCustomFieldFilterValue(value))
                  .filter((value): value is string => value !== null)
              : rawValue !== undefined
                ? [normalizeCustomFieldFilterValue(rawValue)].filter(
                    (value): value is string => value !== null
                  )
                : [];

            return tradeValues.some((value) => selectedValueSet.has(value));
          }

          const normalizedValue = normalizeCustomFieldFilterValue(rawValue);
          return (
            normalizedValue !== null && selectedValueSet.has(normalizedValue)
          );
        }
      );
    });
  }

  return filtered;
}
