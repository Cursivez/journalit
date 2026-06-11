import { FilterState } from '../components/dashboard/DashboardView';
import type { UnifiedFilters } from '../components/shared/filters/types';
import type { TradeLogFilters, TradeType } from '../services/tradelog/types';

const CONCRETE_TRADE_TYPES = ['regular', 'missed', 'backtest'] as const;
const CONCRETE_TRADE_TYPE_SET = new Set<TradeType>(CONCRETE_TRADE_TYPES);

export const DEFAULT_REGULAR_ONLY_TRADE_TYPES: TradeType[] = ['regular'];
export const DEFAULT_ALL_TRADE_TYPES: TradeType[] = [
  'regular',
  'missed',
  'backtest',
];

const sanitizeTradeTypes = (tradeTypes?: TradeType[]): TradeType[] => {
  if (!tradeTypes || tradeTypes.length === 0) {
    return [];
  }

  if (tradeTypes.includes('all')) {
    return [...DEFAULT_ALL_TRADE_TYPES];
  }

  const deduped = new Set<TradeType>();

  for (const tradeType of tradeTypes) {
    if (CONCRETE_TRADE_TYPE_SET.has(tradeType)) {
      deduped.add(tradeType);
    }
  }

  return CONCRETE_TRADE_TYPES.filter((tradeType) => deduped.has(tradeType));
};

const resolveEffectiveTradeTypes = (
  tradeTypes: TradeType[] | undefined,
  defaultTradeTypes: TradeType[]
): TradeType[] => {
  const sanitized = sanitizeTradeTypes(tradeTypes);

  if (sanitized.length === 0) {
    return defaultTradeTypes.length > 0
      ? sanitizeTradeTypes(defaultTradeTypes)
      : [...DEFAULT_ALL_TRADE_TYPES];
  }

  if (sanitized.length === DEFAULT_ALL_TRADE_TYPES.length) {
    return [...DEFAULT_ALL_TRADE_TYPES];
  }

  return sanitized;
};

const areTradeTypeSelectionsEqual = (
  first: TradeType[] | undefined,
  second: TradeType[] | undefined,
  defaultTradeTypes: TradeType[]
): boolean => {
  const left = resolveEffectiveTradeTypes(first, defaultTradeTypes);
  const right = resolveEffectiveTradeTypes(second, defaultTradeTypes);

  return (
    left.length === right.length &&
    left.every((tradeType, index) => tradeType === right[index])
  );
};

export const getActiveTradeTypeSelection = (
  tradeTypes: TradeType[] | undefined,
  defaultTradeTypes: TradeType[]
): TradeType[] => {
  if (
    areTradeTypeSelectionsEqual(
      tradeTypes,
      defaultTradeTypes,
      defaultTradeTypes
    )
  ) {
    return [];
  }

  return resolveEffectiveTradeTypes(tradeTypes, defaultTradeTypes);
};

export const getTradeTypeFilterActiveCount = (
  tradeTypes: TradeType[] | undefined,
  defaultTradeTypes: TradeType[]
): number => getActiveTradeTypeSelection(tradeTypes, defaultTradeTypes).length;

export const normalizeDashboardTradeTypes = (
  tradeTypes?: TradeType[]
): TradeType[] => {
  const sanitized = sanitizeTradeTypes(tradeTypes).filter(
    (tradeType) => tradeType !== 'missed'
  );
  return sanitized.length > 0
    ? sanitized
    : [...DEFAULT_REGULAR_ONLY_TRADE_TYPES];
};

const normalizeReviewTradeTypes = (tradeTypes?: TradeType[]): TradeType[] => {
  const sanitized = sanitizeTradeTypes(tradeTypes).filter(
    (tradeType) => tradeType !== 'missed'
  );
  return sanitized.length > 0
    ? sanitized
    : [...DEFAULT_REGULAR_ONLY_TRADE_TYPES];
};

export const normalizeTradeLogTradeTypes = (
  tradeTypes?: TradeType[]
): TradeType[] => {
  const sanitized = sanitizeTradeTypes(tradeTypes);
  return sanitized.length > 0 ? sanitized : [...DEFAULT_ALL_TRADE_TYPES];
};

export const DEFAULT_DASHBOARD_FILTERS: FilterState = {
  dateRange: [null, null],
  accounts: [],
  tickers: [],
  setups: [],
  tags: [],
  mistakes: [],
  tradeTypes: [...DEFAULT_REGULAR_ONLY_TRADE_TYPES],
  statuses: [],
  customFieldFilters: {},
};

export const DEFAULT_TRADELOG_FILTERS: TradeLogFilters = {
  dateRange: [null, null],
  viewLevel: 'trades',
  tradeTypes: [...DEFAULT_ALL_TRADE_TYPES],
  statuses: [],
  accounts: [],
  tickers: [],
  setups: [],
  tags: [],
  mistakes: [],
  customFieldFilters: {},
};

export const DEFAULT_REVIEW_FILTERS: UnifiedFilters = {
  accounts: [],
  tickers: [],
  setups: [],
  tags: [],
  mistakes: [],
  tradeTypes: [...DEFAULT_REGULAR_ONLY_TRADE_TYPES],
  statuses: [],
  customFieldFilters: {},
};

export const createDashboardFilters = (): FilterState => ({
  ...DEFAULT_DASHBOARD_FILTERS,
  dateRange: [...DEFAULT_DASHBOARD_FILTERS.dateRange],
  accounts: [...DEFAULT_DASHBOARD_FILTERS.accounts],
  tickers: [...DEFAULT_DASHBOARD_FILTERS.tickers],
  setups: [...DEFAULT_DASHBOARD_FILTERS.setups],
  tags: [...DEFAULT_DASHBOARD_FILTERS.tags],
  mistakes: [...DEFAULT_DASHBOARD_FILTERS.mistakes],
  tradeTypes: [...DEFAULT_DASHBOARD_FILTERS.tradeTypes],
  statuses: [...DEFAULT_DASHBOARD_FILTERS.statuses],
  customFieldFilters: { ...DEFAULT_DASHBOARD_FILTERS.customFieldFilters },
});

export const createTradeLogFilters = (): TradeLogFilters => ({
  ...DEFAULT_TRADELOG_FILTERS,
  dateRange: [...DEFAULT_TRADELOG_FILTERS.dateRange],
  tradeTypes: [...DEFAULT_TRADELOG_FILTERS.tradeTypes],
  statuses: [...DEFAULT_TRADELOG_FILTERS.statuses],
  accounts: [...DEFAULT_TRADELOG_FILTERS.accounts],
  tickers: [...DEFAULT_TRADELOG_FILTERS.tickers],
  setups: [...DEFAULT_TRADELOG_FILTERS.setups],
  tags: [...DEFAULT_TRADELOG_FILTERS.tags],
  mistakes: [...DEFAULT_TRADELOG_FILTERS.mistakes],
  customFieldFilters: { ...DEFAULT_TRADELOG_FILTERS.customFieldFilters },
});

export const createReviewFilters = (): UnifiedFilters => ({
  ...DEFAULT_REVIEW_FILTERS,
  accounts: [...DEFAULT_REVIEW_FILTERS.accounts],
  tickers: [...DEFAULT_REVIEW_FILTERS.tickers],
  setups: [...DEFAULT_REVIEW_FILTERS.setups],
  tags: [...DEFAULT_REVIEW_FILTERS.tags],
  mistakes: [...DEFAULT_REVIEW_FILTERS.mistakes],
  tradeTypes: [...DEFAULT_REVIEW_FILTERS.tradeTypes],
  statuses: [...DEFAULT_REVIEW_FILTERS.statuses],
  customFieldFilters: { ...DEFAULT_REVIEW_FILTERS.customFieldFilters },
});

export const normalizeDashboardFilters = (
  filters?: Partial<FilterState> | null
): FilterState => {
  const defaults = createDashboardFilters();

  return {
    ...defaults,
    ...filters,
    dateRange: filters?.dateRange ?? defaults.dateRange,
    accounts: filters?.accounts ? [...filters.accounts] : defaults.accounts,
    tickers: filters?.tickers ? [...filters.tickers] : defaults.tickers,
    setups: filters?.setups ? [...filters.setups] : defaults.setups,
    tags: filters?.tags ? [...filters.tags] : defaults.tags,
    mistakes: filters?.mistakes ? [...filters.mistakes] : defaults.mistakes,
    tradeTypes: normalizeDashboardTradeTypes(filters?.tradeTypes),
    statuses: filters?.statuses ? [...filters.statuses] : defaults.statuses,
    customFieldFilters: {
      ...(filters?.customFieldFilters || defaults.customFieldFilters),
    },
  };
};

export const normalizeTradeLogFilters = (
  filters?: Partial<TradeLogFilters> | null
): TradeLogFilters => {
  const defaults = createTradeLogFilters();

  return {
    ...defaults,
    ...filters,
    dateRange: filters?.dateRange ?? defaults.dateRange,
    tradeTypes: normalizeTradeLogTradeTypes(filters?.tradeTypes),
    statuses: filters?.statuses ? [...filters.statuses] : defaults.statuses,
    accounts: filters?.accounts ? [...filters.accounts] : defaults.accounts,
    tickers: filters?.tickers ? [...filters.tickers] : defaults.tickers,
    setups: filters?.setups ? [...filters.setups] : defaults.setups,
    tags: filters?.tags ? [...filters.tags] : defaults.tags,
    mistakes: filters?.mistakes ? [...filters.mistakes] : defaults.mistakes,
    customFieldFilters: {
      ...(filters?.customFieldFilters || defaults.customFieldFilters),
    },
  };
};

export const normalizeReviewFilters = (
  filters?: Partial<UnifiedFilters> | null
): UnifiedFilters => {
  const defaults = createReviewFilters();

  return {
    ...defaults,
    ...filters,
    accounts: filters?.accounts ? [...filters.accounts] : defaults.accounts,
    tickers: filters?.tickers ? [...filters.tickers] : defaults.tickers,
    setups: filters?.setups ? [...filters.setups] : defaults.setups,
    tags: filters?.tags ? [...filters.tags] : defaults.tags,
    mistakes: filters?.mistakes ? [...filters.mistakes] : defaults.mistakes,
    tradeTypes: normalizeReviewTradeTypes(filters?.tradeTypes),
    statuses: filters?.statuses ? [...filters.statuses] : defaults.statuses,
    customFieldFilters: {
      ...(filters?.customFieldFilters || defaults.customFieldFilters),
    },
  };
};
