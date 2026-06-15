import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Sun,
  Calendar,
  CalendarCheck,
  CalendarRange,
  CalendarHeart,
  CircleCheckBig,
  ObsidianIconComponent,
} from '../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../main';
import { useEventBus } from '../../hooks/useEventBus';
import { t } from '../../lang/helpers';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { getAccountCount, getDisplayPnL } from '../../utils/pnlUtils';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { isTradeOpenWithContext } from '../../utils/tradeStatusUtils';

interface TradeSearchResult {
  type: 'trade';
  path: string;
  instrument: string;
  direction: string;
  optionType?: string;
  assetType?: string;
  tradeStatus: string;
  isOpen: boolean;
  entryTime: Date;
  pnl: number | null;
  currency?: string;
  account?: string[] | string;
  rMultiple?: number;
  riskAmount?: number;
}

interface ReviewSearchResult {
  type: 'review';
  path: string;
  reviewType:
    | 'drc'
    | 'weekly-review'
    | 'monthly-review'
    | 'quarterly-review'
    | 'yearly-review';
  dateInfo: string;
  reviewed: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function stringFrontmatterValue(
  frontmatter: Record<string, unknown>,
  key: string
): string | undefined {
  const value = frontmatter[key];
  return typeof value === 'string' ? value : undefined;
}

function numberFrontmatterValue(
  frontmatter: Record<string, unknown>,
  key: string
): number | undefined {
  const value = frontmatter[key];
  return typeof value === 'number' ? value : undefined;
}

function booleanFrontmatterValue(
  frontmatter: Record<string, unknown>,
  key: string
): boolean | undefined {
  const value = frontmatter[key];
  return typeof value === 'boolean' ? value : undefined;
}

function isReviewType(
  value: string
): value is ReviewSearchResult['reviewType'] {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return true;
    default:
      return false;
  }
}

type SidebarTrade = Record<string, unknown> & {
  path: string;
  instrument?: string;
  direction?: string;
  optionType?: string;
  assetType?: string;
  tradeStatus?: string;
  entryTime?: string | number | Date;
  exitTime?: string | Date | null;
  pnl?: number | null;
  directPnL?: number | null;
  currency?: string;
  account?: string[] | string;
  setup?: string[];
  mistake?: string[] | string;
  tags?: string[];
  useDirectPnLInput?: boolean;
  exits?: Array<Record<string, unknown>>;
  entries?: Array<Record<string, unknown>>;
  rMultiple?: number | null;
  riskAmount?: number | null;
  _originalPnlWasNull?: boolean;
};

const isSidebarTrade = (value: unknown): value is SidebarTrade =>
  isRecord(value) && typeof value.path === 'string' && value.path.length > 0;

type SearchResult = TradeSearchResult | ReviewSearchResult;

interface ReviewSearchIndexEntry {
  normalizedSearchableText: string;
  searchableTokens: string[];
}

const REVIEW_ICONS: Record<string, ObsidianIconComponent> = {
  drc: Sun,
  'weekly-review': CalendarRange,
  'monthly-review': Calendar,
  'quarterly-review': CalendarCheck,
  'yearly-review': CalendarHeart,
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SEARCH_TOKENS = new Set(
  MONTH_NAMES.flatMap((month) => [
    month.toLowerCase(),
    month.slice(0, 3).toLowerCase(),
  ])
);

function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, '$1')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isDaySpecificQueryTokens(tokens: string[]): boolean {
  const hasDay = tokens.some((token) => {
    if (!/^\d{1,2}$/.test(token)) {
      return false;
    }

    const day = Number(token);
    return day >= 1 && day <= 31;
  });

  const hasMonth = tokens.some((token) => MONTH_SEARCH_TOKENS.has(token));
  return hasDay && hasMonth;
}

function getTokenizedSearchScore(
  searchableTokens: string[],
  queryTokens: string[]
): number {
  if (queryTokens.length === 0) {
    return 0;
  }

  let totalScore = 0;

  for (const queryToken of queryTokens) {
    let tokenScore = 0;
    const isNumericToken = /^\d+$/.test(queryToken);

    for (const searchableToken of searchableTokens) {
      if (isNumericToken) {
        if (queryToken.length <= 2) {
          if (searchableToken === queryToken) {
            tokenScore = Math.max(tokenScore, 170);
          }
          continue;
        }

        if (searchableToken === queryToken) {
          tokenScore = Math.max(tokenScore, 170);
        } else if (searchableToken.startsWith(queryToken)) {
          tokenScore = Math.max(tokenScore, 120);
        }
        continue;
      }

      if (searchableToken === queryToken) {
        tokenScore = Math.max(tokenScore, 150);
      } else if (searchableToken.startsWith(queryToken)) {
        tokenScore = Math.max(tokenScore, 110);
      }
    }

    if (tokenScore === 0) {
      return 0;
    }

    totalScore += tokenScore;
  }

  return totalScore;
}

function getTradeIcon(
  pnl: number | null,
  isPnlMasked: boolean
): ObsidianIconComponent {
  if (isPnlMasked || pnl === null) return Clock;
  if (pnl > 0) return TrendingUp;
  if (pnl < 0) return TrendingDown;
  return Minus;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getReviewDateInfo(
  reviewType: string,
  frontmatter: Record<string, unknown>
): string {
  switch (reviewType) {
    case 'drc': {
      const dateStr = stringFrontmatterValue(frontmatter, 'date');
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-').map(Number);
      const parsed = new Date(y, m - 1, d);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    case 'weekly-review': {
      const week = stringFrontmatterValue(frontmatter, 'week');
      const month = stringFrontmatterValue(frontmatter, 'month');
      const year = stringFrontmatterValue(frontmatter, 'year');
      const dateStr = stringFrontmatterValue(frontmatter, 'date');
      const weekNum = week ? String(week).replace(/^W/i, '') : '';
      const parts: string[] = [];
      if (weekNum) parts.push(`Week ${weekNum}`);

      let monthName = '';
      let yearText = year ? String(year) : '';

      const monthNum = month ? parseInt(String(month), 10) : NaN;
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        monthName = MONTH_NAMES[monthNum - 1];
      }

      if ((!monthName || !yearText) && dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const parsed = new Date(y, m - 1, d);
        if (!isNaN(parsed.getTime())) {
          if (!monthName) {
            monthName = parsed.toLocaleDateString('en-US', { month: 'long' });
          }
          if (!yearText) {
            yearText = String(parsed.getFullYear());
          }
        }
      }

      if (monthName && yearText) parts.push(`${monthName} ${yearText}`);
      else if (yearText) parts.push(yearText);

      return parts.join(' \u00B7 ');
    }
    case 'monthly-review': {
      const monthNum = numberFrontmatterValue(frontmatter, 'month');
      const year = numberFrontmatterValue(frontmatter, 'year');
      const monthName =
        typeof monthNum === 'number' ? MONTH_NAMES[monthNum - 1] : '';
      if (monthName && year) return `${monthName} ${year}`;
      if (year) return String(year);
      return monthName || '';
    }
    case 'quarterly-review': {
      const quarter = numberFrontmatterValue(frontmatter, 'quarter');
      const year = numberFrontmatterValue(frontmatter, 'year');
      if (quarter && year) return `Q${quarter} ${year} Review`;
      if (year) return `${year} Review`;
      return quarter ? `Q${quarter} Review` : '';
    }
    case 'yearly-review':
      return frontmatter.year
        ? `${frontmatterValueToSearchString(frontmatter.year)} Review`
        : '';
    default:
      return '';
  }
}

function frontmatterValueToSearchString(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

function getDateSearchTerms(date: Date, includeWeekday: boolean): string[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const monthLong = date.toLocaleDateString('en-US', { month: 'long' });
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' });

  const terms: string[] = [
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    `${monthLong} ${day} ${year}`,
    `${monthShort} ${day} ${year}`,
    `${monthLong} ${day}`,
    `${monthShort} ${day}`,
    `${day} ${monthLong} ${year}`,
    `${day} ${monthShort} ${year}`,
    `${monthLong}`,
    `${monthShort}`,
    `${year}`,
    `${day}`,
  ];

  if (includeWeekday) {
    const weekdayLong = date.toLocaleDateString('en-US', { weekday: 'long' });
    const weekdayShort = date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
    terms.push(
      `${weekdayLong} ${monthLong} ${day} ${year}`,
      `${weekdayShort} ${monthLong} ${day} ${year}`,
      `${weekdayLong}`,
      `${weekdayShort}`
    );
  }

  return terms;
}

function getReviewSearchableText(
  reviewType: string,
  frontmatter: Record<string, unknown>,
  dateInfo: string
): string {
  const parts: string[] = [dateInfo];

  if (frontmatter.date) {
    parts.push(frontmatterValueToSearchString(frontmatter.date));
    const [y, m, d] = frontmatterValueToSearchString(frontmatter.date)
      .split('-')
      .map((value) => parseInt(value, 10));
    const parsed = new Date(y, m - 1, d);
    if (!isNaN(parsed.getTime())) {
      parts.push(...getDateSearchTerms(parsed, reviewType === 'drc'));
    }
  }

  if (frontmatter.week) {
    const weekRaw = frontmatterValueToSearchString(frontmatter.week);
    const weekNum = weekRaw.replace(/^W/i, '');
    parts.push(weekRaw, `week ${weekNum}`, `w${weekNum}`);
  }

  if (frontmatter.month) {
    const monthNum = parseInt(
      frontmatterValueToSearchString(frontmatter.month),
      10
    );
    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
      parts.push(
        MONTH_NAMES[monthNum - 1],
        MONTH_NAMES[monthNum - 1].slice(0, 3)
      );
    }
    parts.push(frontmatterValueToSearchString(frontmatter.month));
  }

  if (frontmatter.year)
    parts.push(frontmatterValueToSearchString(frontmatter.year));

  if (frontmatter.quarter) {
    const quarterValue = frontmatterValueToSearchString(frontmatter.quarter);
    parts.push(quarterValue, `q${quarterValue}`, `quarter ${quarterValue}`);
  }

  const typeLabels: Record<string, string> = {
    drc: 'daily drc review',
    'weekly-review': 'weekly review',
    'monthly-review': 'monthly review',
    'quarterly-review': 'quarterly review',
    'yearly-review': 'yearly review',
  };
  if (typeLabels[reviewType]) parts.push(typeLabels[reviewType]);

  return parts.join(' ').toLowerCase();
}

const MISSED_TRADE_PATH_RE = /-M\d+\.md$/;

function getFieldMatchScore(
  value: string,
  query: string,
  weights: {
    exact: number;
    startsWith: number;
    wordStartsWith: number;
    includes: number;
  }
): number {
  if (!value) return 0;
  if (value === query) return weights.exact;
  if (value.startsWith(query)) return weights.startsWith;

  const words = value.split(/[^a-z0-9]+/).filter(Boolean);
  if (words.some((word) => word.startsWith(query))) {
    return weights.wordStartsWith;
  }

  if (value.includes(query)) return weights.includes;
  return 0;
}

interface SidebarSearchProps {
  plugin: JournalitPlugin;
  onActiveChange: (active: boolean) => void;
}

interface SidebarSearchInputProps {
  query: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

interface SidebarSearchResultsProps {
  tradeResults: TradeSearchResult[];
  reviewResults: ReviewSearchResult[];
  currentSelectedIndex: number;
  resultItemRefs: React.RefObject<Array<HTMLDivElement | null>>;
  isPnlMasked: boolean;
  applyAccountCountMultiplier: boolean;
  defaultRiskAmount?: number;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  onResultClick: (path: string) => void;
  onMouseLeave: () => void;
}

const SidebarSearchInput: React.FC<SidebarSearchInputProps> = ({
  query,
  inputRef,
  onInputChange,
  onInputKeyDown,
  onClear,
}) => (
  <div className="journalit-nav-search">
    <div className="journalit-nav-search-input-wrapper">
      <div className="journalit-nav-search-icon">
        <Search size={14} />
      </div>
      <input
        ref={inputRef}
        className="journalit-nav-search-input"
        type="text"
        placeholder={t('navigation.search.placeholder')}
        value={query}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
      />
      {query && (
        <button
          className="journalit-nav-search-clear"
          onClick={onClear}
          aria-label={t('navigation.search.clear')}
          type="button"
        >
          <X size={12} />
        </button>
      )}
    </div>
  </div>
);

const SidebarSearchResults: React.FC<SidebarSearchResultsProps> = ({
  tradeResults,
  reviewResults,
  currentSelectedIndex,
  resultItemRefs,
  isPnlMasked,
  applyAccountCountMultiplier,
  defaultRiskAmount,
  formatValue,
  onResultClick,
  onMouseLeave,
}) => (
  <div className="journalit-nav-search-results" onMouseLeave={onMouseLeave}>
    {tradeResults.length > 0 && (
      <>
        <div className="journalit-nav-search-section-header">
          {t('navigation.search.section.trades')}
        </div>
        {tradeResults.map((result, index) => {
          const IconComponent = getTradeIcon(
            result.isOpen ? null : result.pnl,
            isPnlMasked
          );
          const usesOptionType =
            result.assetType === 'options' && !!result.optionType;
          const directionLabel = usesOptionType
            ? result.optionType!
            : result.direction;
          const globalIndex = index;
          const accountCount = getAccountCount({ account: result.account });
          const displayPnL = getDisplayPnL(
            result.pnl ?? undefined,
            accountCount,
            applyAccountCountMultiplier
          );
          const effectiveR = calculateEffectiveRMultiple(
            result.pnl ?? undefined,
            result.rMultiple,
            result.riskAmount,
            defaultRiskAmount
          );

          return (
            <div
              key={result.path}
              ref={(el) => {
                resultItemRefs.current[globalIndex] = el;
              }}
              className={`journalit-nav-search-result ${currentSelectedIndex === globalIndex ? 'is-selected' : ''}`}
              onClick={() => onResultClick(result.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onResultClick(result.path);
                }
              }}
            >
              <div className="journalit-nav-search-result-icon">
                <IconComponent size={16} />
              </div>
              <div className="journalit-nav-search-result-text">
                <div className="journalit-nav-search-result-primary">
                  {result.instrument}
                </div>
                <div className="journalit-nav-search-result-secondary">
                  {directionLabel.toUpperCase()} &middot;{' '}
                  {formatShortDate(result.entryTime)}
                  {result.currency ? ` · ${result.currency}` : ''}
                </div>
              </div>
              {result.isOpen ? (
                <span className="journalit-nav-search-result-badge">
                  {t('navigation.search.trade-open')}
                </span>
              ) : (
                <span
                  className="journalit-nav-search-result-pnl"
                  data-positive={
                    !isPnlMasked && displayPnL > 0
                      ? 'true'
                      : !isPnlMasked && displayPnL < 0
                        ? 'false'
                        : undefined
                  }
                  data-neutral={
                    !isPnlMasked && displayPnL === 0 ? 'true' : undefined
                  }
                >
                  {formatValue({
                    kind: 'pnl',
                    value: displayPnL,
                    currencyCode: result.currency,
                    rMultiple: effectiveR,
                  })}
                </span>
              )}
            </div>
          );
        })}
      </>
    )}

    {reviewResults.length > 0 && (
      <>
        <div className="journalit-nav-search-section-header">
          {t('navigation.search.section.reviews')}
        </div>
        {reviewResults.map((result, index) => {
          const IconComponent = REVIEW_ICONS[result.reviewType] || Calendar;
          const globalIndex = tradeResults.length + index;
          return (
            <div
              key={result.path}
              ref={(el) => {
                resultItemRefs.current[globalIndex] = el;
              }}
              className={`journalit-nav-search-result ${currentSelectedIndex === globalIndex ? 'is-selected' : ''}`}
              onClick={() => onResultClick(result.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onResultClick(result.path);
                }
              }}
            >
              <div className="journalit-nav-search-result-icon">
                <IconComponent size={16} />
              </div>
              <div className="journalit-nav-search-result-text">
                <div className="journalit-nav-search-result-primary">
                  {result.dateInfo}
                </div>
              </div>
              {result.reviewed && (
                <div className="journalit-nav-search-result-reviewed">
                  <CircleCheckBig size={14} />
                </div>
              )}
            </div>
          );
        })}
      </>
    )}
  </div>
);

const useSidebarSearchData = (plugin: JournalitPlugin) => {
  const [dataRefreshVersion, setDataRefreshVersion] = useState(0);
  const tradesRef = useRef<SidebarTrade[]>([]);
  const reviewsRef = useRef<ReviewSearchResult[]>([]);
  const tradeDateTokensRef = useRef<Map<string, string[]>>(new Map());
  const reviewSearchIndexRef = useRef<Map<string, ReviewSearchIndexEntry>>(
    new Map()
  );

  const loadTrades = useCallback(async () => {
    try {
      const allTrades = (await plugin.tradeService.getTradeData()) as unknown[];
      const filteredTrades = allTrades.filter(
        (trade): trade is SidebarTrade => {
          if (!isSidebarTrade(trade)) return false;
          if (!plugin.app.vault.getAbstractFileByPath(trade.path)) return false;
          const fm = plugin.app.metadataCache.getCache(trade.path)
            ?.frontmatter as Record<string, unknown> | undefined;
          if (fm?.type === 'missed-trade') return false;
          if (MISSED_TRADE_PATH_RE.test(trade.path)) return false;
          return true;
        }
      );

      const tradeDateTokens = new Map<string, string[]>();
      for (const trade of filteredTrades) {
        const entryDate = new Date(trade.entryTime ?? 0);
        if (isNaN(entryDate.getTime())) {
          tradeDateTokens.set(trade.path, []);
          continue;
        }
        const normalizedDateSearchText = normalizeSearchText(
          getDateSearchTerms(entryDate, true).join(' ')
        );
        tradeDateTokens.set(
          trade.path,
          normalizedDateSearchText.split(' ').filter(Boolean)
        );
      }

      tradesRef.current = filteredTrades;
      tradeDateTokensRef.current = tradeDateTokens;
      setDataRefreshVersion((prev) => prev + 1);
    } catch {
      tradesRef.current = [];
      tradeDateTokensRef.current = new Map();
      setDataRefreshVersion((prev) => prev + 1);
    }
  }, [plugin]);

  const loadReviews = useCallback(() => {
    const files = plugin.app.vault.getMarkdownFiles();
    const reviewResults: ReviewSearchResult[] = [];
    const reviewSearchIndex = new Map<string, ReviewSearchIndexEntry>();

    for (const file of files) {
      const cache = plugin.app.metadataCache.getFileCache(file);
      const fm = cache?.frontmatter;
      if (
        !isRecord(fm) ||
        typeof fm.type !== 'string' ||
        !isReviewType(fm.type)
      ) {
        continue;
      }
      const reviewType = fm.type;
      const eodReview = isRecord(fm.endOfDayReview) ? fm.endOfDayReview : {};
      const reviewed =
        reviewType === 'drc'
          ? (booleanFrontmatterValue(eodReview, 'reviewed') ?? false)
          : (booleanFrontmatterValue(fm, 'reviewed') ?? false);
      const dateInfo = getReviewDateInfo(reviewType, fm);
      reviewResults.push({
        type: 'review',
        path: file.path,
        reviewType,
        dateInfo,
        reviewed,
      });
      const searchableText = [
        file.basename,
        getReviewSearchableText(reviewType, fm, dateInfo),
      ].join(' ');
      const normalizedSearchableText = normalizeSearchText(searchableText);
      reviewSearchIndex.set(file.path, {
        normalizedSearchableText,
        searchableTokens: normalizedSearchableText.split(' ').filter(Boolean),
      });
    }

    reviewsRef.current = reviewResults;
    reviewSearchIndexRef.current = reviewSearchIndex;
    setDataRefreshVersion((prev) => prev + 1);
  }, [plugin]);

  useEffect(() => {
    void loadTrades();
    loadReviews();
  }, [loadTrades, loadReviews]);

  const handleTradeChanged = useCallback(() => {
    void loadTrades();
  }, [loadTrades]);
  const handleReviewChanged = useCallback(() => {
    loadReviews();
  }, [loadReviews]);

  useEventBus('trade:changed', handleTradeChanged);
  useEventBus('backtest-trade:changed', handleTradeChanged);
  useEventBus('review:changed', handleReviewChanged);

  return {
    dataRefreshVersion,
    tradesRef,
    reviewsRef,
    tradeDateTokensRef,
    reviewSearchIndexRef,
  };
};

interface SidebarSearchExecutionContext {
  searchQuery: string;
  plugin: JournalitPlugin;
  tradesRef: React.RefObject<SidebarTrade[]>;
  reviewsRef: React.RefObject<ReviewSearchResult[]>;
  tradeDateTokensRef: React.RefObject<Map<string, string[]>>;
  reviewSearchIndexRef: React.RefObject<Map<string, ReviewSearchIndexEntry>>;
  setResults: React.Dispatch<React.SetStateAction<SearchResult[]>>;
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

const performSidebarSearch = ({
  searchQuery,
  plugin,
  tradesRef,
  reviewsRef,
  tradeDateTokensRef,
  reviewSearchIndexRef,
  setResults,
  setHasSearched,
}: SidebarSearchExecutionContext): void => {
  if (!searchQuery.trim()) {
    setResults([]);
    setHasSearched(false);
    return;
  }

  const qRaw = searchQuery.toLowerCase().trim();
  const qNormalized = normalizeSearchText(searchQuery);
  const queryTokens = qNormalized.split(' ').filter(Boolean);
  const isDaySpecificDateSearch = isDaySpecificQueryTokens(queryTokens);
  const matched: SearchResult[] = [];

  const scoredTrades: Array<{ score: number; result: TradeSearchResult }> = [];

  const breakEvenRangeMin = plugin.settings?.trade?.breakEvenRangeMin ?? 0;
  const breakEvenRangeMax = plugin.settings?.trade?.breakEvenRangeMax ?? 0;

  for (const trade of tradesRef.current) {
    const frontmatter = plugin.app.metadataCache.getCache(trade.path)
      ?.frontmatter as Record<string, unknown> | undefined;

    const basename = trade.path
      ? trade.path.split('/').pop()?.replace(/\.md$/, '') || ''
      : '';
    const accountStr = Array.isArray(trade.account)
      ? trade.account.join(' ')
      : '';
    const setupStr = Array.isArray(trade.setup) ? trade.setup.join(' ') : '';
    const mistakeStr = Array.isArray(trade.mistake)
      ? trade.mistake.join(' ')
      : trade.mistake
        ? String(trade.mistake)
        : '';
    const tagsStr = Array.isArray(trade.tags) ? trade.tags.join(' ') : '';

    const frontmatterOptionType =
      typeof frontmatter?.optionType === 'string'
        ? frontmatter.optionType
        : typeof frontmatter?.optiontype === 'string'
          ? frontmatter.optiontype
          : '';
    const optionTypeRaw = (
      trade.optionType || frontmatterOptionType
    ).toLowerCase();

    const rawPnl = trade.useDirectPnLInput
      ? (trade.directPnL ?? null)
      : (trade.pnl ?? null);
    const tradeCurrency =
      typeof frontmatter?.currency === 'string'
        ? frontmatter.currency
        : typeof trade.currency === 'string'
          ? trade.currency
          : undefined;

    const isOpen = isTradeOpenWithContext({
      tradeStatus: trade.tradeStatus,
      exitTime: trade.exitTime,
      pnl: rawPnl,
      useDirectPnLInput: trade.useDirectPnLInput,
      exits: trade.exits,
      entries: trade.entries,
    });

    const statusKeywords = ['open', 'closed'];
    if (isOpen) {
      statusKeywords.length = 0;
      statusKeywords.push('open');
    } else {
      statusKeywords.length = 0;
      statusKeywords.push('closed');
      const pnlForStatus = rawPnl ?? 0;
      if (pnlForStatus > breakEvenRangeMax) {
        statusKeywords.push('win', 'profit');
      } else if (pnlForStatus < breakEvenRangeMin) {
        statusKeywords.push('loss');
      } else {
        statusKeywords.push('breakeven', 'break even', 'break-even');
      }
    }

    const instrument = String(trade.instrument || '').toLowerCase();
    const direction = String(trade.direction || '').toLowerCase();
    const account = accountStr.toLowerCase();
    const setup = setupStr.toLowerCase();
    const mistake = mistakeStr.toLowerCase();
    const tags = tagsStr.toLowerCase();
    const base = basename.toLowerCase();
    const status = statusKeywords.join(' ').toLowerCase();

    let tradeDateTokenScore = 0;
    if (isDaySpecificDateSearch) {
      const tradeDateTokens = tradeDateTokensRef.current.get(trade.path) || [];
      tradeDateTokenScore = getTokenizedSearchScore(
        tradeDateTokens,
        queryTokens
      );

      if (tradeDateTokenScore === 0) {
        continue;
      }
    }

    let score = 0;
    score += getFieldMatchScore(instrument, qRaw, {
      exact: 2000,
      startsWith: 1600,
      wordStartsWith: 1400,
      includes: 800,
    });
    score += getFieldMatchScore(base, qRaw, {
      exact: 900,
      startsWith: 700,
      wordStartsWith: 600,
      includes: 400,
    });
    score += getFieldMatchScore(optionTypeRaw, qRaw, {
      exact: 700,
      startsWith: 550,
      wordStartsWith: 500,
      includes: 350,
    });
    score += getFieldMatchScore(direction, qRaw, {
      exact: 500,
      startsWith: 350,
      wordStartsWith: 300,
      includes: 200,
    });
    score += getFieldMatchScore(status, qRaw, {
      exact: 650,
      startsWith: 520,
      wordStartsWith: 470,
      includes: 360,
    });
    score += getFieldMatchScore(account, qRaw, {
      exact: 250,
      startsWith: 180,
      wordStartsWith: 150,
      includes: 100,
    });
    score += getFieldMatchScore(setup, qRaw, {
      exact: 250,
      startsWith: 180,
      wordStartsWith: 150,
      includes: 100,
    });
    score += getFieldMatchScore(mistake, qRaw, {
      exact: 250,
      startsWith: 180,
      wordStartsWith: 150,
      includes: 100,
    });
    score += getFieldMatchScore(tags, qRaw, {
      exact: 200,
      startsWith: 140,
      wordStartsWith: 120,
      includes: 80,
    });

    const tradeSearchableText = normalizeSearchText(
      [
        instrument,
        direction,
        optionTypeRaw,
        status,
        account,
        setup,
        mistake,
        tags,
        tradeCurrency || '',
        base,
      ].join(' ')
    );
    const tradeTokenScore = getTokenizedSearchScore(
      tradeSearchableText.split(' ').filter(Boolean),
      queryTokens
    );

    score += tradeTokenScore;
    score += Math.round(tradeDateTokenScore * 0.8);

    if (score <= 0) continue;

    scoredTrades.push({
      score,
      result: {
        type: 'trade',
        path: trade.path,
        instrument: trade.instrument || '',
        direction: trade.direction || '',
        optionType: optionTypeRaw || undefined,
        assetType:
          trade.assetType ||
          (typeof frontmatter?.assetType === 'string'
            ? frontmatter.assetType
            : undefined),
        tradeStatus: trade.tradeStatus || '',
        isOpen,
        entryTime: trade.entryTime ? new Date(trade.entryTime) : new Date(),
        pnl: rawPnl,
        currency: tradeCurrency,
        account: trade.account,
        rMultiple:
          trade.rMultiple !== undefined && trade.rMultiple !== null
            ? Number(trade.rMultiple)
            : undefined,
        riskAmount:
          trade.riskAmount !== undefined && trade.riskAmount !== null
            ? Number(trade.riskAmount)
            : undefined,
      },
    });
  }

  scoredTrades
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .forEach(({ result }) => matched.push(result));

  const scoredReviews: Array<{
    score: number;
    result: ReviewSearchResult;
  }> = [];

  for (const review of reviewsRef.current) {
    const indexedReview = reviewSearchIndexRef.current.get(review.path);
    if (!indexedReview) {
      continue;
    }

    const tokenScore = getTokenizedSearchScore(
      indexedReview.searchableTokens,
      queryTokens
    );
    if (tokenScore <= 0) {
      continue;
    }

    let score =
      tokenScore +
      getFieldMatchScore(indexedReview.normalizedSearchableText, qNormalized, {
        exact: 900,
        startsWith: 700,
        wordStartsWith: 550,
        includes: 300,
      });

    if (isDaySpecificDateSearch) {
      if (review.reviewType === 'drc') {
        score += 250;
      } else if (review.reviewType === 'weekly-review') {
        score += 80;
      } else {
        score -= 200;
      }
    }

    scoredReviews.push({ score, result: review });
  }

  scoredReviews
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, 50 - matched.length))
    .forEach(({ result }) => matched.push(result));

  setResults(matched);
  setHasSearched(true);
};

export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  plugin,
  onActiveChange,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceRef = useRef<number | null>(null);
  const queryRef = useRef('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const {
    dataRefreshVersion,
    tradesRef,
    reviewsRef,
    tradeDateTokensRef,
    reviewSearchIndexRef,
  } = useSidebarSearchData(plugin);

  const performSearch = useCallback(
    (searchQuery: string) => {
      performSidebarSearch({
        searchQuery,
        plugin,
        tradesRef,
        reviewsRef,
        tradeDateTokensRef,
        reviewSearchIndexRef,
        setResults,
        setHasSearched,
      });
    },
    [plugin, reviewSearchIndexRef, reviewsRef, tradeDateTokensRef, tradesRef]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const trimmedValue = value.trim();

      setQuery(value);
      queryRef.current = value;
      setSelectedIndex(-1);

      const isActive = trimmedValue.length > 0;
      onActiveChange(isActive);

      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      if (!isActive) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      debounceRef.current = window.setTimeout(() => {
        performSearch(trimmedValue);
      }, 220);
    },
    [performSearch, onActiveChange]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    queryRef.current = '';
    setResults([]);
    setHasSearched(false);
    setSelectedIndex(-1);
    onActiveChange(false);
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
  }, [onActiveChange]);

  const handleResultClick = useCallback(
    (path: string) => {
      const tabBehavior =
        plugin.settings.navigation?.tabBehavior || 'replaceActiveTab';
      const createNewLeaf = tabBehavior !== 'replaceActiveTab';

      void (async () => {
        await plugin.openFile(path, createNewLeaf, false, 'sidebar');
        window.setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })();
    },
    [plugin]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const applyAccountCountMultiplier = false;
  const defaultRiskAmount = plugin.settings?.trade?.defaultRiskAmount;

  const tradeResults = useMemo(
    () => results.filter((r): r is TradeSearchResult => r.type === 'trade'),
    [results]
  );

  const reviewResults = useMemo(
    () => results.filter((r): r is ReviewSearchResult => r.type === 'review'),
    [results]
  );

  const orderedResults = useMemo(
    () => [...tradeResults, ...reviewResults],
    [tradeResults, reviewResults]
  );

  const currentSelectedIndex =
    orderedResults.length === 0
      ? -1
      : selectedIndex < 0
        ? -1
        : Math.min(selectedIndex, orderedResults.length - 1);

  useEffect(() => {
    if (currentSelectedIndex < 0) return;
    resultItemRefs.current[currentSelectedIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [currentSelectedIndex]);

  useEffect(() => {
    const trimmedQuery = queryRef.current.trim();
    if (!trimmedQuery) {
      return;
    }

    performSearch(trimmedQuery);
  }, [dataRefreshVersion, performSearch]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
        inputRef.current?.blur();
        return;
      }

      if (orderedResults.length === 0) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const targetIndex =
          currentSelectedIndex >= 0 ? currentSelectedIndex : 0;
        const target = orderedResults[targetIndex];
        if (target) {
          handleResultClick(target.path);
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(
          currentSelectedIndex < 0
            ? 0
            : Math.min(currentSelectedIndex + 1, orderedResults.length - 1)
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          currentSelectedIndex < 0
            ? orderedResults.length - 1
            : Math.max(currentSelectedIndex - 1, 0)
        );
      }
    },
    [handleClear, handleResultClick, orderedResults, currentSelectedIndex]
  );

  const hasActiveQuery = query.trim().length > 0;

  return (
    <>
      <SidebarSearchInput
        query={query}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onInputKeyDown={handleInputKeyDown}
        onClear={handleClear}
      />

      {hasActiveQuery && hasSearched && results.length === 0 && (
        <div className="journalit-nav-search-results">
          <div className="journalit-nav-search-empty">
            {t('navigation.search.empty')}
          </div>
        </div>
      )}

      {hasActiveQuery && results.length > 0 && (
        <SidebarSearchResults
          tradeResults={tradeResults}
          reviewResults={reviewResults}
          currentSelectedIndex={currentSelectedIndex}
          resultItemRefs={resultItemRefs}
          isPnlMasked={isPnlMasked}
          applyAccountCountMultiplier={applyAccountCountMultiplier}
          defaultRiskAmount={defaultRiskAmount}
          formatValue={formatValue}
          onResultClick={handleResultClick}
          onMouseLeave={() => setSelectedIndex(-1)}
        />
      )}
    </>
  );
};
