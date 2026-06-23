

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
import JournalitPlugin from '../../../main';
import type {
  WeeklyGamePerformance,
  GradeDistribution,
} from '../../../services/monthly/types';
import { InvalidContextMessage } from './InvalidContextMessage';
import { SkeletonBox } from '../../shared';
import { parseLocalDateSafe } from '../../../utils/dateUtils';

interface TechnicalGameWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TechnicalGameWidgetConfig;
  preview?: boolean;
  previewData?: TechnicalGamePreviewData;
}

interface TechnicalGameWidgetConfig {
  showRating?: boolean; 
  pageSize?: number; 
}


interface TechnicalMonthlyGameData {
  month: number;
  year: number;
  monthName: string;
  technicalGradeDistribution: GradeDistribution;
  technicalRating?: number;
}

interface TechnicalGamePreviewData {
  weeks: WeeklyGamePerformance[];
  noteType?: 'monthly-review' | 'quarterly-review' | 'yearly-review';
  
  monthlyData?: TechnicalMonthlyGameData[];
}


type MonthlyGameData = TechnicalMonthlyGameData;


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

const DEFAULT_CONFIG: TechnicalGameWidgetConfig = {
  showRating: true,
  pageSize: 5,
};



const getMonthName = (monthIndex: number): string => {
  const key = `widget.header.month.${monthIndex}`;
  return hasTranslation(key) ? t(key) : key;
};

export const TechnicalGameWidget: React.FC<TechnicalGameWidgetProps> =
  React.memo(
    ({ filePath, plugin, config = {}, preview = false, previewData }) => {
      const mergedConfig = { ...DEFAULT_CONFIG, ...config };

      const [dataState, dispatchDataState] = useReducer(
        (
          state: {
            weeks: WeeklyGamePerformance[];
            monthlyData: MonthlyGameData[];
            loading: boolean;
            noteType: AllowedNoteType | null;
          },
          update: Partial<{
            weeks: WeeklyGamePerformance[];
            monthlyData: MonthlyGameData[];
            loading: boolean;
            noteType: AllowedNoteType | null;
          }>
        ) => ({ ...state, ...update }),
        { weeks: [], monthlyData: [], loading: true, noteType: null }
      );
      const { weeks, monthlyData, loading, noteType } = dataState;
      const [currentPage, setCurrentPage] = useState(0);
      const retryCountRef = useRef(0);

      
      const isYearlyView = noteType === 'yearly-review';

      
      const pageSize = mergedConfig.pageSize || 5;
      const totalItems = isYearlyView ? monthlyData.length : weeks.length;
      const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
      const isPaginated = pageSize > 0 && totalItems > pageSize;

      const effectiveCurrentPage = Math.min(
        currentPage,
        Math.max(0, totalPages - 1)
      );

      const paginatedMonths = useMemo(() => {
        if (!isYearlyView) return [];
        if (!isPaginated) return monthlyData;
        const start = effectiveCurrentPage * pageSize;
        return monthlyData.slice(start, start + pageSize);
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
        const start = effectiveCurrentPage * pageSize;
        return weeks.slice(start, start + pageSize);
      }, [weeks, effectiveCurrentPage, pageSize, isPaginated, isYearlyView]);

      
      const goToPrevPage = useCallback(() => {
        setCurrentPage(Math.max(0, effectiveCurrentPage - 1));
      }, [effectiveCurrentPage]);

      const goToNextPage = useCallback(() => {
        setCurrentPage(Math.min(totalPages - 1, effectiveCurrentPage + 1));
      }, [effectiveCurrentPage, totalPages]);

      
      useEffect(() => {
        retryCountRef.current = 0;

        const loadData = async () => {
          
          if (preview && previewData) {
            dispatchDataState({
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
              dispatchDataState({ loading: false });
              return;
            }

            const cache = plugin.app.metadataCache.getFileCache(file);
            const frontmatter = asRecord(cache?.frontmatter);
            if (!frontmatter) {
              
              if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
                retryCountRef.current++;
                window.setTimeout(
                  () => void loadData(),
                  FRONTMATTER_RETRY_DELAY_MS
                );
                return;
              }
              dispatchDataState({ loading: false });
              return;
            }

            const type = getAllowedNoteType(frontmatter.type);
            dispatchDataState({ noteType: type });

            
            if (!type) {
              dispatchDataState({ loading: false });
              return;
            }

            
            const monthlyService = plugin.serviceManager
              ? await plugin.serviceManager.getMonthlyReviewService()
              : plugin.monthlyReviewService;

            if (!monthlyService) {
              console.warn(
                '[TechnicalGameWidget] MonthlyReviewService not available'
              );
              dispatchDataState({ loading: false });
              return;
            }

            
            if (type === 'monthly-review') {
              
              let year = getNumberValue(frontmatter, 'year');
              let month = getNumberValue(frontmatter, 'month');
              if (!year || !month) {
                
                const date = parseRecordDate(frontmatter, 'date');
                if (date) {
                  year = date.getFullYear();
                  month = date.getMonth() + 1;
                }
              }
              if (year && month) {
                const data = await monthlyService.getWeeklyGamePerformance(
                  year,
                  month
                );
                dispatchDataState({ weeks: data });
              }
            } else if (type === 'quarterly-review') {
              
              
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

              
              const weeklyResults = await Promise.all(
                months.map(({ year, month }) =>
                  monthlyService.getWeeklyGamePerformance(year, month)
                )
              );
              const allWeeks = weeklyResults.flat();
              
              allWeeks.sort(
                (a, b) =>
                  new Date(a.weekStartDate).getTime() -
                  new Date(b.weekStartDate).getTime()
              );
              dispatchDataState({ weeks: allWeeks });
            } else if (type === 'yearly-review') {
              
              const parsedDate = parseRecordDate(frontmatter, 'date');
              const year =
                getNumberValue(frontmatter, 'year') ??
                parsedDate?.getFullYear() ??
                new Date().getFullYear();

              const monthlyResults = await Promise.all(
                Array.from({ length: 12 }, (_unused, index) => {
                  const month = index + 1;
                  return monthlyService.getWeeklyGamePerformance(year, month);
                })
              );
              const monthlyAggregated: MonthlyGameData[] = monthlyResults.map(
                (weeksData, index) => {
                  const month = index + 1;
                  
                  const aggregated: GradeDistribution = { A: 0, B: 0, C: 0 };
                  let totalRating = 0;
                  let ratingCount = 0;

                  for (const week of weeksData) {
                    aggregated.A += week.technicalGradeDistribution.A;
                    aggregated.B += week.technicalGradeDistribution.B;
                    aggregated.C += week.technicalGradeDistribution.C;
                    if (week.technicalRating !== undefined) {
                      totalRating += week.technicalRating;
                      ratingCount++;
                    }
                  }

                  return {
                    month,
                    year,
                    monthName: getMonthName(month - 1),
                    technicalGradeDistribution: aggregated,
                    technicalRating:
                      ratingCount > 0 ? totalRating / ratingCount : undefined,
                  };
                }
              );
              dispatchDataState({ monthlyData: monthlyAggregated });
            }
          } catch (error) {
            console.error('[TechnicalGameWidget] Error loading data:', error);
          } finally {
            dispatchDataState({ loading: false });
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
          plugin.app.metadataCache.off('changed', handleMetadataChange);
        };
      }, [filePath, plugin, preview, previewData]);

      
      const formatRating = (rating: number | undefined): string => {
        if (rating === undefined || rating === null) return 'N/A';
        return rating.toFixed(1);
      };

      
      const openWeeklyReview = async (week: WeeklyGamePerformance) => {
        if (preview) return;
        try {
          if (!week.weeklyReviewPath) return;
          const file = plugin.app.vault.getAbstractFileByPath(
            week.weeklyReviewPath
          );
          if (file) {
            await plugin.openFile(week.weeklyReviewPath, true);
          } else if (
            plugin.settings?.weekly?.autoCreateWeeklyReviewOnNavigation
          ) {
            await plugin.weeklyReviewService?.createWeeklyReview(
              week.weekStartDate
            );
            await plugin.openFile(week.weeklyReviewPath, true);
          }
        } catch (error) {
          console.error(
            '[TechnicalGameWidget] Error opening weekly review:',
            error
          );
        }
      };

      
      const openMonthlyReview = async (monthData: MonthlyGameData) => {
        if (preview) return;
        try {
          const monthlyService = plugin.serviceManager
            ? await plugin.serviceManager.getMonthlyReviewService()
            : plugin.monthlyReviewService;
          if (monthlyService) {
            await monthlyService.openMonthlyReview(
              new Date(monthData.year, monthData.month - 1, 1)
            );
          }
        } catch (error) {
          console.error(
            '[TechnicalGameWidget] Error opening monthly review:',
            error
          );
        }
      };

      const renderWithHeader = (children: React.ReactNode) => (
        <div>
          <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
            <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
              {t('widget.technical-game.name')}
            </div>
          </div>
          {children}
        </div>
      );

      if (loading) {
        const rowCount = Math.min(pageSize, 5);
        return renderWithHeader(
          <table className="journalit-reviewv2-table journalit-reviewv2-table--compact">
            <thead>
              <tr>
                <th className="journalit-reviewv2-table-header-cell">
                  {isYearlyView
                    ? t('widget.table.header.month')
                    : t('widget.table.header.week')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.a-games')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.b-games')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.c-games')}
                </th>
                {mergedConfig.showRating && (
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.rating')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <tr
                  key={i}
                  className="journalit-reviewv2-table-row journalit-reviewv2-table-row--static"
                >
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    <SkeletonBox width={30} height={14} borderRadius="4px" />
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    <SkeletonBox width={20} height={14} borderRadius="4px" />
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    <SkeletonBox width={20} height={14} borderRadius="4px" />
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    <SkeletonBox width={20} height={14} borderRadius="4px" />
                  </td>
                  {mergedConfig.showRating && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                      <SkeletonBox width={30} height={14} borderRadius="4px" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }

      
      if (!preview && noteType && !ALLOWED_NOTE_TYPES.includes(noteType)) {
        return (
          <InvalidContextMessage
            widgetType={t('widget.technical-game.name')}
            reason={t('widget.invalid-context.monthly-quarterly-yearly')}
          />
        );
      }

      if (totalItems === 0) {
        const periodText =
          noteType === 'yearly-review'
            ? 'this year'
            : noteType === 'quarterly-review'
              ? 'this quarter'
              : 'this month';
        return renderWithHeader(
          <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
            {t('widget.empty.no-technical-game-data', { period: periodText })}
          </div>
        );
      }

      
      if (isYearlyView) {
        return renderWithHeader(
          <>
            <table className="journalit-reviewv2-table journalit-reviewv2-table--compact journalit-game-performance-table">
              <thead>
                <tr>
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.month')}
                  </th>
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.a-games')}
                  </th>
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.b-games')}
                  </th>
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.c-games')}
                  </th>
                  {mergedConfig.showRating && (
                    <th className="journalit-reviewv2-table-header-cell">
                      {t('widget.table.header.avg-rating')}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedMonths.map((monthData) => (
                  <tr
                    key={`month-${monthData.month}`}
                    className="journalit-reviewv2-table-row journalit-reviewv2-table-row--interactive journalit-game-performance-row"
                    onClick={() => void openMonthlyReview(monthData)}
                  >
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                      {monthData.monthName}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--a">
                      {monthData.technicalGradeDistribution.A}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--b">
                      {monthData.technicalGradeDistribution.B}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--c">
                      {monthData.technicalGradeDistribution.C}
                    </td>
                    {mergedConfig.showRating && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                        {formatRating(monthData.technicalRating)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {isPaginated && (
              <div className="journalit-reviewv2-pagination journalit-reviewv2-pagination--after-table">
                <span>
                  {t('widget.pagination.showing', {
                    start: String(effectiveCurrentPage * pageSize + 1),
                    end: String(
                      Math.min(
                        (effectiveCurrentPage + 1) * pageSize,
                        totalItems
                      )
                    ),
                    total: String(totalItems),
                    items: 'months',
                  })}
                </span>
                <div className="journalit-reviewv2-pagination-controls">
                  <button
                    onClick={goToPrevPage}
                    disabled={effectiveCurrentPage === 0}
                    className="journalit-reviewv2-pagination-button"
                  >
                    {t('widget.pagination.prev')}
                  </button>
                  <span className="journalit-reviewv2-pagination-status">
                    {t('widget.pagination.page', {
                      current: String(effectiveCurrentPage + 1),
                      total: String(totalPages),
                    })}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={effectiveCurrentPage >= totalPages - 1}
                    className="journalit-reviewv2-pagination-button"
                  >
                    {t('widget.pagination.next')}
                  </button>
                </div>
              </div>
            )}
          </>
        );
      }

      
      return renderWithHeader(
        <>
          <table className="journalit-reviewv2-table journalit-reviewv2-table--compact journalit-game-performance-table">
            <thead>
              <tr>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.week')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.a-games')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.b-games')}
                </th>
                <th className="journalit-reviewv2-table-header-cell">
                  {t('widget.table.header.c-games')}
                </th>
                {mergedConfig.showRating && (
                  <th className="journalit-reviewv2-table-header-cell">
                    {t('widget.table.header.rating')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedWeeks.map((week) => {
                const distribution = week.technicalGradeDistribution;
                const hasWeeklyReview = Boolean(week.weeklyReviewPath);

                return (
                  <tr
                    key={`week-${week.weekNumber}-${week.weekStartDate.toISOString()}`}
                    className={[
                      'journalit-reviewv2-table-row',
                      'journalit-reviewv2-table-row--interactive',
                      'journalit-game-performance-row',
                      hasWeeklyReview
                        ? ''
                        : 'journalit-game-performance-row--disabled',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (hasWeeklyReview) void openWeeklyReview(week);
                    }}
                  >
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                      W{week.weekNumber}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--a">
                      {distribution.A}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--b">
                      {distribution.B}
                    </td>
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--c">
                      {distribution.C}
                    </td>
                    {mergedConfig.showRating && (
                      <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                        {formatRating(week.technicalRating)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {isPaginated && (
            <div className="journalit-reviewv2-pagination journalit-reviewv2-pagination--after-table">
              <span>
                {t('widget.pagination.showing', {
                  start: String(effectiveCurrentPage * pageSize + 1),
                  end: String(
                    Math.min((effectiveCurrentPage + 1) * pageSize, totalItems)
                  ),
                  total: String(totalItems),
                  items: 'weeks',
                })}
              </span>
              <div className="journalit-reviewv2-pagination-controls">
                <button
                  onClick={goToPrevPage}
                  disabled={effectiveCurrentPage === 0}
                  className="journalit-reviewv2-pagination-button"
                >
                  {t('widget.pagination.prev')}
                </button>
                <span className="journalit-reviewv2-pagination-status">
                  {t('widget.pagination.page', {
                    current: String(effectiveCurrentPage + 1),
                    total: String(totalPages),
                  })}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={effectiveCurrentPage >= totalPages - 1}
                  className="journalit-reviewv2-pagination-button"
                >
                  {t('widget.pagination.next')}
                </button>
              </div>
            </div>
          )}
        </>
      );
    }
  );

TechnicalGameWidget.displayName = 'TechnicalGameWidget';

export {};
