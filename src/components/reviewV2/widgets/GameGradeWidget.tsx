

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import { TFile } from 'obsidian';
import { hasTranslation, t } from '../../../lang/helpers';
import type JournalitPlugin from '../../../main';
import type {
  WeeklyGamePerformance,
  GradeDistribution,
} from '../../../services/monthly/types';
import type { MonthlyReviewService } from '../../../services/monthly/MonthlyReviewService';
import { InvalidContextMessage } from './InvalidContextMessage';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import {
  openReviewWidgetFile,
  shouldOpenReviewWidgetNotesInNewTab,
} from '../reviewWidgetNavigation';
import { resolveYearlyReviewYear } from '../../../utils/yearlyReviewYear';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';

type GameKind = 'mental' | 'technical';

export interface GameGradeWidgetConfig {
  showRating?: boolean; 
  pageSize?: number; 
}


export interface GameGradeMonth {
  month: number;
  year: number;
  monthName: string;
  gradeDistribution: GradeDistribution;
  rating?: number;
}

export interface GameGradePreviewData {
  weeks: WeeklyGamePerformance[];
  noteType?: AllowedNoteType;
  
  monthlyData?: GameGradeMonth[];
}

interface GameGradeWidgetProps {
  kind: GameKind;
  filePath: string;
  plugin: JournalitPlugin;
  config?: GameGradeWidgetConfig;
  preview?: boolean;
  previewData?: GameGradePreviewData;
}

const GAME_KIND_COPY = {
  mental: {
    nameKey: 'widget.mental-game.name',
    emptyKey: 'widget.empty.no-mental-game-data',
    logName: 'MentalGameWidget',
  },
  technical: {
    nameKey: 'widget.technical-game.name',
    emptyKey: 'widget.empty.no-technical-game-data',
    logName: 'TechnicalGameWidget',
  },
} as const;

function weekDistribution(
  week: WeeklyGamePerformance,
  kind: GameKind
): GradeDistribution {
  return kind === 'mental'
    ? week.mentalGradeDistribution
    : week.technicalGradeDistribution;
}

function weekRating(
  week: WeeklyGamePerformance,
  kind: GameKind
): number | undefined {
  return kind === 'mental' ? week.mentalRating : week.technicalRating;
}


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;


const ALLOWED_NOTE_TYPES = [
  'monthly-review',
  'quarterly-review',
  'yearly-review',
] as const;
type AllowedNoteType = (typeof ALLOWED_NOTE_TYPES)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function getAllowedNoteType(value: unknown): AllowedNoteType | null {
  switch (value) {
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
      return value;
    default:
      return null;
  }
}

function toDateInput(
  value: unknown
): Date | string | number | null | undefined {
  return value instanceof Date ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    value === null ||
    value === undefined
    ? value
    : undefined;
}

function getNumberValue(
  record: Record<string, unknown>,
  key: string
): number | undefined {
  const value = record[key];
  return typeof value === 'number' ? value : undefined;
}

function parseRecordDate(
  record: Record<string, unknown>,
  key: string
): Date | null {
  const value = record[key];
  return parseLocalDateSafe(toDateInput(value));
}

const DEFAULT_CONFIG: GameGradeWidgetConfig = {
  showRating: true,
  pageSize: 5,
};



const getMonthName = (monthIndex: number): string => {
  const key = `widget.header.month.${monthIndex}`;
  return hasTranslation(key) ? t(key) : key;
};

const formatRating = (rating: number | undefined): string => {
  if (rating === undefined || rating === null) return 'N/A';
  return rating.toFixed(1);
};

async function getMonthlyReviewService(
  plugin: JournalitPlugin
): Promise<MonthlyReviewService | undefined> {
  return plugin.serviceManager
    ? await plugin.serviceManager.getMonthlyReviewService()
    : plugin.monthlyReviewService;
}


function resolveReviewMonth(
  frontmatter: Record<string, unknown>
): { year: number; month: number } | null {
  let year = getNumberValue(frontmatter, 'year');
  let month = getNumberValue(frontmatter, 'month');
  if (!year || !month) {
    
    const date = parseRecordDate(frontmatter, 'date');
    if (date) {
      year = date.getFullYear();
      month = date.getMonth() + 1;
    }
  }
  return year && month ? { year, month } : null;
}


function resolveQuarterMonths(
  frontmatter: Record<string, unknown>
): { year: number; month: number }[] {
  
  const quarterStart = parseRecordDate(frontmatter, 'quarterStart');
  const quarterEnd = parseRecordDate(frontmatter, 'quarterEnd');

  const months: { year: number; month: number }[] = [];
  if (quarterStart && quarterEnd) {
    const current = new Date(quarterStart);
    while (current <= quarterEnd) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1,
      });
      current.setMonth(current.getMonth() + 1);
    }
  } else {
    
    const date = parseRecordDate(frontmatter, 'date');
    if (date) {
      const quarter = Math.floor(date.getMonth() / 3);
      const year = date.getFullYear();
      for (let i = 0; i < 3; i++) {
        months.push({ year, month: quarter * 3 + i + 1 });
      }
    }
  }
  return months;
}

function aggregateMonth(
  weeksData: WeeklyGamePerformance[],
  year: number,
  month: number,
  kind: GameKind
): GameGradeMonth {
  const aggregated: GradeDistribution = { A: 0, B: 0, C: 0 };
  let totalRating = 0;
  let ratingCount = 0;

  for (const week of weeksData) {
    const distribution = weekDistribution(week, kind);
    aggregated.A += distribution.A;
    aggregated.B += distribution.B;
    aggregated.C += distribution.C;
    const rating = weekRating(week, kind);
    if (rating !== undefined) {
      totalRating += rating;
      ratingCount++;
    }
  }

  return {
    month,
    year,
    monthName: getMonthName(month - 1),
    gradeDistribution: aggregated,
    rating: ratingCount > 0 ? totalRating / ratingCount : undefined,
  };
}


async function loadGameGrades(
  monthlyService: MonthlyReviewService,
  frontmatter: Record<string, unknown>,
  type: AllowedNoteType,
  kind: GameKind
): Promise<{
  weeks?: WeeklyGamePerformance[];
  monthlyData?: GameGradeMonth[];
}> {
  if (type === 'monthly-review') {
    const reviewMonth = resolveReviewMonth(frontmatter);
    if (!reviewMonth) return {};
    return {
      weeks: await monthlyService.getWeeklyGamePerformance(
        reviewMonth.year,
        reviewMonth.month
      ),
    };
  }

  if (type === 'quarterly-review') {
    const weeklyResults = await Promise.all(
      resolveQuarterMonths(frontmatter).map(({ year, month }) =>
        monthlyService.getWeeklyGamePerformance(year, month)
      )
    );
    const allWeeks = weeklyResults.flat();
    
    allWeeks.sort(
      (a, b) =>
        new Date(a.weekStartDate).getTime() -
        new Date(b.weekStartDate).getTime()
    );
    return { weeks: allWeeks };
  }

  
  const year = resolveYearlyReviewYear(frontmatter, new Date().getFullYear());
  const monthlyResults = await Promise.all(
    Array.from({ length: 12 }, (_unused, index) =>
      monthlyService.getWeeklyGamePerformance(year, index + 1)
    )
  );
  return {
    monthlyData: monthlyResults.map((weeksData, index) =>
      aggregateMonth(weeksData, year, index + 1, kind)
    ),
  };
}

function emptyPeriodText(noteType: AllowedNoteType | null): string {
  if (noteType === 'yearly-review') return 'this year';
  if (noteType === 'quarterly-review') return 'this quarter';
  return 'this month';
}

function activateRowOnKey(event: React.KeyboardEvent<HTMLTableRowElement>) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

const COMPACT_CELL =
  'journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact';

const GameGradeCard: React.FC<{
  kind: GameKind;
  children: React.ReactNode;
}> = ({ kind, children }) => (
  <div>
    <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
      <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
        {t(GAME_KIND_COPY[kind].nameKey)}
      </div>
    </div>
    {children}
  </div>
);

const GameGradeHeaderRow: React.FC<{
  periodLabel: string;
  ratingLabel: string | null;
}> = ({ periodLabel, ratingLabel }) => (
  <thead>
    <tr>
      <th className="journalit-reviewv2-table-header-cell">{periodLabel}</th>
      <th className="journalit-reviewv2-table-header-cell">
        {t('widget.table.header.a-games')}
      </th>
      <th className="journalit-reviewv2-table-header-cell">
        {t('widget.table.header.b-games')}
      </th>
      <th className="journalit-reviewv2-table-header-cell">
        {t('widget.table.header.c-games')}
      </th>
      {ratingLabel !== null && (
        <th className="journalit-reviewv2-table-header-cell">{ratingLabel}</th>
      )}
    </tr>
  </thead>
);

const GradeCells: React.FC<{
  distribution: GradeDistribution;
  rating: number | undefined;
  showRating: boolean;
}> = ({ distribution, rating, showRating }) => (
  <>
    <td
      className={`${COMPACT_CELL} journalit-reviewv2-game-grade journalit-reviewv2-game-grade--a`}
    >
      {distribution.A}
    </td>
    <td
      className={`${COMPACT_CELL} journalit-reviewv2-game-grade journalit-reviewv2-game-grade--b`}
    >
      {distribution.B}
    </td>
    <td
      className={`${COMPACT_CELL} journalit-reviewv2-game-grade journalit-reviewv2-game-grade--c`}
    >
      {distribution.C}
    </td>
    {showRating && <td className={COMPACT_CELL}>{formatRating(rating)}</td>}
  </>
);

const GameGradeSkeletonTable: React.FC<{
  isYearlyView: boolean;
  showRating: boolean;
  rowCount: number;
}> = ({ isYearlyView, showRating, rowCount }) => (
  <table className="journalit-reviewv2-table journalit-reviewv2-table--compact">
    <GameGradeHeaderRow
      periodLabel={
        isYearlyView
          ? t('widget.table.header.month')
          : t('widget.table.header.week')
      }
      ratingLabel={showRating ? t('widget.table.header.rating') : null}
    />
    <tbody>
      {Array.from({ length: rowCount }).map((_, i) => (
        <tr
          key={i}
          className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
        >
          <td className={COMPACT_CELL}>
            <SkeletonBox width={30} height={14} borderRadius="4px" />
          </td>
          <td className={COMPACT_CELL}>
            <SkeletonBox width={20} height={14} borderRadius="4px" />
          </td>
          <td className={COMPACT_CELL}>
            <SkeletonBox width={20} height={14} borderRadius="4px" />
          </td>
          <td className={COMPACT_CELL}>
            <SkeletonBox width={20} height={14} borderRadius="4px" />
          </td>
          {showRating && (
            <td className={COMPACT_CELL}>
              <SkeletonBox width={30} height={14} borderRadius="4px" />
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

const MonthRows: React.FC<{
  months: GameGradeMonth[];
  showRating: boolean;
  onOpen: (month: GameGradeMonth) => void;
}> = ({ months, showRating, onOpen }) => (
  <tbody>
    {months.map((monthData) => (
      <tr
        tabIndex={0}
        onKeyDown={activateRowOnKey}
        key={`month-${monthData.month}`}
        className="journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive journalit-game-performance-row"
        onClick={() => onOpen(monthData)}
      >
        <td className={COMPACT_CELL}>{monthData.monthName}</td>
        <GradeCells
          distribution={monthData.gradeDistribution}
          rating={monthData.rating}
          showRating={showRating}
        />
      </tr>
    ))}
  </tbody>
);

const WeekRows: React.FC<{
  kind: GameKind;
  weeks: WeeklyGamePerformance[];
  showRating: boolean;
  onOpen: (week: WeeklyGamePerformance) => void;
}> = ({ kind, weeks, showRating, onOpen }) => (
  <tbody>
    {weeks.map((week) => {
      const hasWeeklyReview = Boolean(week.weeklyReviewPath);
      return (
        <tr
          tabIndex={0}
          onKeyDown={activateRowOnKey}
          key={`week-${week.weekNumber}-${week.weekStartDate.toISOString()}`}
          className={[
            'journalit-reviewv2-table-row',
            'journalit-reviewv2-table-row--interactive',
            'journalit-game-performance-row',
            hasWeeklyReview ? '' : 'journalit-game-performance-row--disabled',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            if (hasWeeklyReview) onOpen(week);
          }}
        >
          <td className={COMPACT_CELL}>W{week.weekNumber}</td>
          <GradeCells
            distribution={weekDistribution(week, kind)}
            rating={weekRating(week, kind)}
            showRating={showRating}
          />
        </tr>
      );
    })}
  </tbody>
);

const GameGradePagination: React.FC<{
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: 'weeks' | 'months';
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, pageSize, totalItems, totalPages, items, onPrev, onNext }) => (
  <div className="journalit-reviewv2-pagination journalit-reviewv2-pagination--after-table">
    <span>
      {t('widget.pagination.showing', {
        start: String(page * pageSize + 1),
        end: String(Math.min((page + 1) * pageSize, totalItems)),
        total: String(totalItems),
        items,
      })}
    </span>
    <div
      className="journalit-reviewv2-pagination-controls"
      {...shareCaptureExcludeProps}
    >
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="journalit-reviewv2-pagination-button"
      >
        {t('widget.pagination.prev')}
      </button>
      <span className="journalit-reviewv2-pagination-status">
        {t('widget.pagination.page', {
          current: String(page + 1),
          total: String(totalPages),
        })}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages - 1}
        className="journalit-reviewv2-pagination-button"
      >
        {t('widget.pagination.next')}
      </button>
    </div>
  </div>
);

interface GameGradeDataState {
  weeks: WeeklyGamePerformance[];
  monthlyData: GameGradeMonth[];
  loading: boolean;
  noteType: AllowedNoteType | null;
}

const INITIAL_DATA_STATE: GameGradeDataState = {
  weeks: [],
  monthlyData: [],
  loading: true,
  noteType: null,
};

function dataStateReducer(
  state: GameGradeDataState,
  update: Partial<GameGradeDataState>
): GameGradeDataState {
  return { ...state, ...update };
}


function useGameGradeData(
  kind: GameKind,
  filePath: string,
  plugin: JournalitPlugin,
  preview: boolean,
  previewData: GameGradePreviewData | undefined
): GameGradeDataState {
  const [dataState, dispatchDataState] = useReducer(
    dataStateReducer,
    INITIAL_DATA_STATE
  );
  const retryCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimeout: number | null = null;
    retryCountRef.current = 0;
    const dispatchCurrent = (update: Partial<GameGradeDataState>) => {
      if (!cancelled) dispatchDataState(update);
    };
    const logName = GAME_KIND_COPY[kind].logName;

    const loadData = async () => {
      if (cancelled) return;
      
      if (preview && previewData) {
        dispatchCurrent({
          weeks: previewData.weeks,
          noteType: previewData.noteType ?? null,
          monthlyData: previewData.monthlyData ?? [],
          loading: false,
        });
        return;
      }

      try {
        const file = plugin.app.vault.getAbstractFileByPath(filePath);
        if (!(file instanceof TFile)) {
          dispatchCurrent({ loading: false });
          return;
        }

        const cache = plugin.app.metadataCache.getFileCache(file);
        const frontmatter = asRecord(cache?.frontmatter);
        if (!frontmatter) {
          
          if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
            retryCountRef.current++;
            retryTimeout = window.setTimeout(
              () => void loadData(),
              FRONTMATTER_RETRY_DELAY_MS
            );
            return;
          }
          dispatchCurrent({ loading: false });
          return;
        }

        const type = getAllowedNoteType(frontmatter.type);
        dispatchCurrent({ noteType: type });

        
        if (!type) {
          dispatchCurrent({ loading: false });
          return;
        }

        const monthlyService = await getMonthlyReviewService(plugin);
        if (!monthlyService) {
          console.warn(`[${logName}] MonthlyReviewService not available`);
          dispatchCurrent({ loading: false });
          return;
        }

        dispatchCurrent(
          await loadGameGrades(monthlyService, frontmatter, type, kind)
        );
      } catch (error) {
        console.error(`[${logName}] Error loading data:`, error);
      } finally {
        dispatchCurrent({ loading: false });
      }
    };

    void loadData();

    
    const handleMetadataChange = (file: TFile) => {
      if (file.path === filePath) {
        void loadData();
      }
    };

    plugin.app.metadataCache.on('changed', handleMetadataChange);

    return () => {
      cancelled = true;
      if (retryTimeout !== null) window.clearTimeout(retryTimeout);
      plugin.app.metadataCache.off('changed', handleMetadataChange);
    };
  }, [kind, filePath, plugin, preview, previewData]);

  return dataState;
}

function pageWindow(totalItems: number, pageSize: number, currentPage: number) {
  const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
  return {
    totalPages,
    isPaginated: pageSize > 0 && totalItems > pageSize,
    
    effectiveCurrentPage: Math.min(currentPage, Math.max(0, totalPages - 1)),
  };
}

function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

export const GameGradeWidget: React.FC<GameGradeWidgetProps> = React.memo(
  ({ kind, filePath, plugin, config = {}, preview = false, previewData }) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const showRating = Boolean(mergedConfig.showRating);
    const { weeks, monthlyData, loading, noteType } = useGameGradeData(
      kind,
      filePath,
      plugin,
      preview,
      previewData
    );
    const [currentPage, setCurrentPage] = useState(0);

    
    const isYearlyView = noteType === 'yearly-review';
    const pageSize = mergedConfig.pageSize || 5;
    const totalItems = isYearlyView ? monthlyData.length : weeks.length;
    const { totalPages, isPaginated, effectiveCurrentPage } = pageWindow(
      totalItems,
      pageSize,
      currentPage
    );

    const paginatedMonths = useMemo(() => {
      if (!isYearlyView) return [];
      if (!isPaginated) return monthlyData;
      return paginate(monthlyData, effectiveCurrentPage, pageSize);
    }, [
      monthlyData,
      effectiveCurrentPage,
      pageSize,
      isPaginated,
      isYearlyView,
    ]);

    const paginatedWeeks = useMemo(() => {
      if (isYearlyView) return [];
      if (!isPaginated) return weeks;
      return paginate(weeks, effectiveCurrentPage, pageSize);
    }, [weeks, effectiveCurrentPage, pageSize, isPaginated, isYearlyView]);

    const goToPrevPage = useCallback(() => {
      setCurrentPage(Math.max(0, effectiveCurrentPage - 1));
    }, [effectiveCurrentPage]);

    const goToNextPage = useCallback(() => {
      setCurrentPage(Math.min(totalPages - 1, effectiveCurrentPage + 1));
    }, [effectiveCurrentPage, totalPages]);

    const openWeeklyReview = async (week: WeeklyGamePerformance) => {
      if (preview) return;
      try {
        if (!week.weeklyReviewPath) return;
        const file = plugin.app.vault.getAbstractFileByPath(
          week.weeklyReviewPath
        );
        if (file) {
          await openReviewWidgetFile(plugin, week.weeklyReviewPath);
        } else if (
          plugin.settings?.weekly?.autoCreateWeeklyReviewOnNavigation
        ) {
          await plugin.weeklyReviewService?.createWeeklyReview(
            week.weekStartDate
          );
          await openReviewWidgetFile(plugin, week.weeklyReviewPath);
        }
      } catch (error) {
        console.error(
          `[${GAME_KIND_COPY[kind].logName}] Error opening weekly review:`,
          error
        );
      }
    };

    const openMonthlyReview = async (monthData: GameGradeMonth) => {
      if (preview) return;
      try {
        const monthlyService = await getMonthlyReviewService(plugin);
        if (monthlyService) {
          await monthlyService.openMonthlyReview(
            new Date(monthData.year, monthData.month - 1, 1),
            shouldOpenReviewWidgetNotesInNewTab(plugin)
          );
        }
      } catch (error) {
        console.error(
          `[${GAME_KIND_COPY[kind].logName}] Error opening monthly review:`,
          error
        );
      }
    };

    if (loading) {
      return (
        <GameGradeCard kind={kind}>
          <GameGradeSkeletonTable
            isYearlyView={isYearlyView}
            showRating={showRating}
            rowCount={Math.min(pageSize, 5)}
          />
        </GameGradeCard>
      );
    }

    
    if (!preview && noteType && !ALLOWED_NOTE_TYPES.includes(noteType)) {
      return (
        <InvalidContextMessage
          widgetType={t(GAME_KIND_COPY[kind].nameKey)}
          reason={t('widget.invalid-context.monthly-quarterly-yearly')}
        />
      );
    }

    if (totalItems === 0) {
      return (
        <GameGradeCard kind={kind}>
          <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
            {t(GAME_KIND_COPY[kind].emptyKey, {
              period: emptyPeriodText(noteType),
            })}
          </div>
        </GameGradeCard>
      );
    }

    return (
      <GameGradeCard kind={kind}>
        <table className="journalit-reviewv2-table journalit-reviewv2-table--compact journalit-game-performance-table">
          <GameGradeHeaderRow
            periodLabel={
              isYearlyView
                ? t('widget.table.header.month')
                : t('widget.table.header.week')
            }
            ratingLabel={
              showRating
                ? t(
                    isYearlyView
                      ? 'widget.table.header.avg-rating'
                      : 'widget.table.header.rating'
                  )
                : null
            }
          />
          {isYearlyView ? (
            <MonthRows
              months={paginatedMonths}
              showRating={showRating}
              onOpen={(monthData) => void openMonthlyReview(monthData)}
            />
          ) : (
            <WeekRows
              kind={kind}
              weeks={paginatedWeeks}
              showRating={showRating}
              onOpen={(week) => void openWeeklyReview(week)}
            />
          )}
        </table>
        {isPaginated && (
          <GameGradePagination
            page={effectiveCurrentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            items={isYearlyView ? 'months' : 'weeks'}
            onPrev={goToPrevPage}
            onNext={goToNextPage}
          />
        )}
      </GameGradeCard>
    );
  }
);

GameGradeWidget.displayName = 'GameGradeWidget';
