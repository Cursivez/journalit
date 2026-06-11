

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
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

interface MentalGameWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: MentalGameWidgetConfig;
  preview?: boolean;
  previewData?: MentalGamePreviewData;
}

interface MentalGameWidgetConfig {
  showRating?: boolean; 
  pageSize?: number; 
}


interface MentalMonthlyGameData {
  month: number;
  year: number;
  monthName: string;
  mentalGradeDistribution: GradeDistribution;
  mentalRating?: number;
}

interface MentalGamePreviewData {
  weeks: WeeklyGamePerformance[];
  noteType?: 'monthly-review' | 'quarterly-review' | 'yearly-review';
  
  monthlyData?: MentalMonthlyGameData[];
}


type MonthlyGameData = MentalMonthlyGameData;


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;


const ALLOWED_NOTE_TYPES = [
  'monthly-review',
  'quarterly-review',
  'yearly-review',
];

const DEFAULT_CONFIG: MentalGameWidgetConfig = {
  showRating: true,
  pageSize: 5,
};



const getMonthName = (monthIndex: number): string => {
  const key = `widget.header.month.${monthIndex}`;
  return hasTranslation(key) ? t(key) : key;
};

export const MentalGameWidget: React.FC<MentalGameWidgetProps> = React.memo(
  ({ filePath, plugin, config = {}, preview = false, previewData }) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    const [weeks, setWeeks] = useState<WeeklyGamePerformance[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyGameData[]>([]);
    const [loading, setLoading] = useState(true);
    const [noteType, setNoteType] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const retryCountRef = useRef(0);

    
    const isYearlyView = noteType === 'yearly-review';

    
    const displayData = isYearlyView ? monthlyData : weeks;
    const pageSize = mergedConfig.pageSize || 5;
    const totalItems = displayData.length;
    const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1;
    const isPaginated = pageSize > 0 && totalItems > pageSize;

    const effectiveCurrentPage = Math.min(
      currentPage,
      Math.max(0, totalPages - 1)
    );

    
    const paginatedData = useMemo(() => {
      if (!isPaginated) return displayData;
      const start = effectiveCurrentPage * pageSize;
      return displayData.slice(start, start + pageSize);
    }, [displayData, effectiveCurrentPage, pageSize, isPaginated]);

    
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
          setWeeks(previewData.weeks);
          if (previewData.noteType) {
            setNoteType(previewData.noteType);
          }
          
          if (previewData.monthlyData) {
            setMonthlyData(previewData.monthlyData);
          }
          setLoading(false);
          return;
        }

        try {
          const file = plugin.app.vault.getAbstractFileByPath(filePath);
          if (!(file instanceof TFile)) {
            setLoading(false);
            return;
          }

          const cache = plugin.app.metadataCache.getFileCache(file);
          const frontmatter = cache?.frontmatter;
          if (!frontmatter) {
            
            if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
              retryCountRef.current++;
              setTimeout(() => loadData(), FRONTMATTER_RETRY_DELAY_MS);
              return;
            }
            setLoading(false);
            return;
          }

          const type = frontmatter.type || null;
          setNoteType(type);

          
          if (!ALLOWED_NOTE_TYPES.includes(type)) {
            setLoading(false);
            return;
          }

          
          const monthlyService = plugin.serviceManager
            ? await plugin.serviceManager.getMonthlyReviewService()
            : plugin.monthlyReviewService;

          if (!monthlyService) {
            console.warn(
              '[MentalGameWidget] MonthlyReviewService not available'
            );
            setLoading(false);
            return;
          }

          
          if (type === 'monthly-review') {
            
            let year = frontmatter.year;
            let month = frontmatter.month;
            if (!year || !month) {
              
              const date = parseLocalDateSafe(frontmatter.date);
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
              setWeeks(data);
            }
          } else if (type === 'quarterly-review') {
            
            
            const quarterStart = frontmatter.quarterStart
              ? parseLocalDateSafe(frontmatter.quarterStart)
              : null;
            const quarterEnd = frontmatter.quarterEnd
              ? parseLocalDateSafe(frontmatter.quarterEnd)
              : null;

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
              
              const date = parseLocalDateSafe(frontmatter.date);
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
            setWeeks(allWeeks);
          } else if (type === 'yearly-review') {
            
            const parsedDate = parseLocalDateSafe(frontmatter.date);
            const year =
              frontmatter.year ||
              (parsedDate?.getFullYear() ?? new Date().getFullYear());

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
                  aggregated.A += week.mentalGradeDistribution.A;
                  aggregated.B += week.mentalGradeDistribution.B;
                  aggregated.C += week.mentalGradeDistribution.C;
                  if (week.mentalRating !== undefined) {
                    totalRating += week.mentalRating;
                    ratingCount++;
                  }
                }

                return {
                  month,
                  year,
                  monthName: getMonthName(month - 1),
                  mentalGradeDistribution: aggregated,
                  mentalRating:
                    ratingCount > 0 ? totalRating / ratingCount : undefined,
                };
              }
            );
            setMonthlyData(monthlyAggregated);
          }
        } catch (error) {
          console.error('[MentalGameWidget] Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();

      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          loadData();
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
        console.error('[MentalGameWidget] Error opening weekly review:', error);
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
          '[MentalGameWidget] Error opening monthly review:',
          error
        );
      }
    };

    const renderWithHeader = (children: React.ReactNode) => (
      <div>
        <div className="journalit-reviewv2-card-header journalit-reviewv2-card-header--center">
          <div className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
            {t('widget.mental-game.name')}
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
          widgetType={t('widget.mental-game.name')}
          reason={t('widget.invalid-context.monthly-quarterly-yearly')}
        />
      );
    }

    if (displayData.length === 0) {
      const periodText =
        noteType === 'yearly-review'
          ? 'this year'
          : noteType === 'quarterly-review'
            ? 'this quarter'
            : 'this month';
      return renderWithHeader(
        <div className="journalit-reviewv2-empty journalit-reviewv2-empty--large">
          {t('widget.empty.no-mental-game-data', { period: periodText })}
        </div>
      );
    }

    
    if (isYearlyView) {
      const paginatedMonths = paginatedData as MonthlyGameData[];
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
                  onClick={() => openMonthlyReview(monthData)}
                >
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                    {monthData.monthName}
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--a">
                    {monthData.mentalGradeDistribution.A}
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--b">
                    {monthData.mentalGradeDistribution.B}
                  </td>
                  <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact journalit-reviewv2-game-grade journalit-reviewv2-game-grade--c">
                    {monthData.mentalGradeDistribution.C}
                  </td>
                  {mergedConfig.showRating && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-table-cell--compact">
                      {formatRating(monthData.mentalRating)}
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
                    Math.min((effectiveCurrentPage + 1) * pageSize, totalItems)
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

    
    const paginatedWeeks = paginatedData as WeeklyGamePerformance[];
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
              const distribution = week.mentalGradeDistribution;
              const hasWeeklyReview = Boolean(week.weeklyReviewPath);

              return (
                <tr
                  key={`week-${week.weekNumber}-${week.weekStartDate}`}
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
                  onClick={() => hasWeeklyReview && openWeeklyReview(week)}
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
                      {formatRating(week.mentalRating)}
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

MentalGameWidget.displayName = 'MentalGameWidget';

export {};
