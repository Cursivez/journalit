import type { Trade } from '../../components/dashboard/utils/dataUtils';
import { getTradeDirectionDisplayKind } from '../trade/core/TradeDirection';
import type {
  AnalyticsEntityGroupKey,
  AnalyticsGroupDimension,
  AnalyticsGroupKey,
} from './types';

export type AnalyticsEntityGroupResolver = (
  trade: Trade
) => Array<{ id: string; label: string }>;

export interface AnalyticsGroupingResolvers {
  account?: AnalyticsEntityGroupResolver;
  setup?: AnalyticsEntityGroupResolver;
}

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export const compareAnalyticsStrings = (
  left: string,
  right: string
): number => {
  const foldedLeft = left.toLowerCase();
  const foldedRight = right.toLowerCase();
  if (foldedLeft < foldedRight) return -1;
  if (foldedLeft > foldedRight) return 1;
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
};

const normalizeValues = (values: readonly string[] | undefined): string[] =>
  [
    ...new Set((values ?? []).map((value) => value.trim()).filter(Boolean)),
  ].sort(compareAnalyticsStrings);

const normalizeEntities = (
  kind: 'account' | 'setup',
  values: Array<{ id: string; label: string }>
): AnalyticsEntityGroupKey[] => {
  const labelsById = new Map<string, string>();
  for (const value of values) {
    const id = value.id.trim();
    const label = value.label.trim();
    if (!id || !label) continue;
    const existing = labelsById.get(id);
    if (
      existing === undefined ||
      compareAnalyticsStrings(label, existing) < 0
    ) {
      labelsById.set(id, label);
    }
  }
  return [...labelsById]
    .sort(([left], [right]) => compareAnalyticsStrings(left, right))
    .map(([id, label]) => ({ kind, id, label }));
};

export const getAnalyticsGroupKeys = (
  trade: Trade,
  dimension: AnalyticsGroupDimension,
  tradingDay: Date | null,
  resolvers: AnalyticsGroupingResolvers
): AnalyticsGroupKey[] => {
  switch (dimension) {
    case 'account':
      return normalizeEntities('account', resolvers.account?.(trade) ?? []);
    case 'setup':
      return normalizeEntities('setup', resolvers.setup?.(trade) ?? []);
    case 'ticker':
      return normalizeValues(trade.instrument ? [trade.instrument] : []).map(
        (value) => ({ kind: 'ticker', value })
      );
    case 'direction': {
      const direction = getTradeDirectionDisplayKind(trade);
      if (direction === 'long' || direction === 'call') {
        return [{ kind: 'direction', value: 'long' }];
      }
      if (direction === 'short' || direction === 'put') {
        return [{ kind: 'direction', value: 'short' }];
      }
      return [];
    }
    case 'tag':
      return normalizeValues(trade.tags).map((value) => ({
        kind: 'tag',
        value,
      }));
    case 'mistake':
      return normalizeValues(trade.mistake).map((value) => ({
        kind: 'mistake',
        value,
      }));
    case 'weekday':
      return tradingDay
        ? [{ kind: 'weekday', value: WEEKDAYS[tradingDay.getDay()] }]
        : [];
    case 'month':
      return tradingDay
        ? [
            {
              kind: 'month',
              value: `${tradingDay.getFullYear()}-${String(
                tradingDay.getMonth() + 1
              ).padStart(2, '0')}`,
            },
          ]
        : [];
    default: {
      const exhaustive: never = dimension;
      return exhaustive;
    }
  }
};

export const analyticsGroupIdentity = (group: AnalyticsGroupKey): string =>
  'id' in group ? `${group.kind}:${group.id}` : `${group.kind}:${group.value}`;

export const analyticsGroupDisplayValue = (group: AnalyticsGroupKey): string =>
  'label' in group ? group.label : group.value;
