import { logger } from '../../../utils/logger';


import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { TFile } from 'obsidian';
import {
  CheckCircle2,
  Circle,
  Funnel,
  Repeat2,
} from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { InvalidContextMessage } from './InvalidContextMessage';
import { openFilterModal, UnifiedFilters } from '../../shared/filters';
import type { AvailableCustomFieldFilter } from '../../shared/filters/types';
import { HeaderPreviewData } from '../../../types/reviewV2';
import { eventBus } from '../../../services/events/EventBus';
import { useEventBus } from '../../../hooks';
import type {
  AccountChangedPayload,
  ReviewChangedPayload,
} from '../../../services/events/types';
import { SkeletonBox, SkeletonCircle } from '../../shared';
import {
  getWeekNumberForDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { hasTranslation, t } from '../../../lang/helpers';
import {
  createReviewFilters,
  getTradeTypeFilterActiveCount,
  normalizeReviewFilters,
} from '../../../settings/viewFiltersDefaults';
import {
  type CustomFieldDefinition,
  type CustomFieldFilterSelections,
  isDiscreteCustomFieldFilterable,
} from '../../../types/customFields';
import { TradeLogService } from '../../../services/tradelog';
import { remapAccountFilterFromAccountChange } from '../../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../../shared/filters/viewFilterPersistence';

interface HeaderWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: HeaderPreviewData;
}

const sanitizeCustomFieldFilters = (
  customFieldFilters: CustomFieldFilterSelections | undefined,
  customFields: CustomFieldDefinition[]
): CustomFieldFilterSelections => {
  const filterableFieldIds = new Set<string>();
  for (const field of customFields) {
    if (isDiscreteCustomFieldFilterable(field)) {
      filterableFieldIds.add(field.id);
    }
  }

  return Object.fromEntries(
    Object.entries(customFieldFilters || {}).flatMap(([fieldId, values]) => {
      if (!filterableFieldIds.has(fieldId) || !Array.isArray(values)) {
        return [];
      }

      const sanitizedValues = [...new Set(values.filter(Boolean))];
      return sanitizedValues.length > 0 ? [[fieldId, sanitizedValues]] : [];
    })
  );
};

export const getHeaderDateValue = (
  frontmatter: Record<string, unknown>
): unknown => {
  if (frontmatter.type !== 'trade') {
    return frontmatter.date;
  }

  if (frontmatter.entryTime) {
    return frontmatter.entryTime;
  }

  if (!Array.isArray(frontmatter.entries)) {
    return undefined;
  }

  let earliest: { value: unknown; time: number } | null = null;
  for (const entry of frontmatter.entries) {
    if (entry && typeof entry === 'object') {
      const time = (entry as { time?: unknown }).time;
      if (time) {
        const parsedDate = parseLocalDateSafe(
          time as Date | string | number | null | undefined
        );
        const parsedTime = parsedDate?.getTime();
        if (parsedTime !== undefined && Number.isFinite(parsedTime)) {
          if (!earliest || parsedTime < earliest.time) {
            earliest = { value: time, time: parsedTime };
          }
        }
      }
    }
  }

  return earliest?.value;
};

interface HeaderData {
  type:
    | 'drc'
    | 'weekly-review'
    | 'monthly-review'
    | 'quarterly-review'
    | 'yearly-review'
    | 'trade';
  date: Date;
  title: string;
  subtitle?: string;
}


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 150;

export const HeaderWidget: React.FC<HeaderWidgetProps> = React.memo(
  ({ filePath, plugin, preview, previewData }) => {
    const [headerData, setHeaderData] = useState<HeaderData | null>(null);
    const [loading, setLoading] = useState(true);
    const headerDataRef = useRef<HeaderData | null>(null);
    
    const [filters, setFilters] = useState<UnifiedFilters>(() => {
      return normalizeReviewFilters(
        plugin.uiStateManager.getState().viewFilters?.reviews
      );
    });
    const [reviewed, setReviewed] = useState<boolean>(false);
    const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(
      () => plugin.customFieldsService?.getFields() || []
    );
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      headerDataRef.current = headerData;
    }, [headerData]);

    useEffect(() => {
      const handleCustomFieldsChanged = () => {
        setCustomFields(plugin.customFieldsService?.getFields() || []);
      };

      handleCustomFieldsChanged();
      plugin.app.workspace.on(
        'journalit-custom-fields-changed',
        handleCustomFieldsChanged
      );

      return () => {
        plugin.app.workspace.off(
          'journalit-custom-fields-changed',
          handleCustomFieldsChanged
        );
      };
    }, [plugin]);

    const discreteCustomFields = useMemo(
      () => customFields.filter(isDiscreteCustomFieldFilterable),
      [customFields]
    );

    const sanitizedCustomFieldFilters = useMemo(
      () =>
        sanitizeCustomFieldFilters(
          filters.customFieldFilters,
          discreteCustomFields
        ),
      [filters.customFieldFilters, discreteCustomFields]
    );

    useEffect(() => {
      if (
        JSON.stringify(filters.customFieldFilters || {}) ===
        JSON.stringify(sanitizedCustomFieldFilters)
      ) {
        return;
      }

      const mergedFilters = normalizeReviewFilters({
        ...filters,
        customFieldFilters: sanitizedCustomFieldFilters,
      });

      setFilters(mergedFilters);

      persistViewFilter(plugin.uiStateManager, 'reviews', mergedFilters);

      eventBus.publish('filter:changed', {
        filePath,
        filters: mergedFilters,
      });

      eventBus.publish('review:filter-sync', {
        sourceFilePath: filePath,
        filters: mergedFilters,
      });
    }, [plugin, filters, sanitizedCustomFieldFilters, filePath]);

    
    const loadReviewedStatus = useCallback(() => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;
      if (!frontmatter) return;

      
      if (
        ![
          'drc',
          'weekly-review',
          'monthly-review',
          'quarterly-review',
          'yearly-review',
        ].includes(frontmatter.type)
      )
        return;

      if (frontmatter.type === 'drc') {
        const eodReview = frontmatter.endOfDayReview || {};
        setReviewed(eodReview.reviewed ?? false);
      } else {
        setReviewed(frontmatter.reviewed ?? false);
      }
    }, [filePath, plugin]);

    
    const handleDataChange = useCallback(
      (payload: ReviewChangedPayload) => {
        if (payload.filePath === filePath) {
          loadReviewedStatus();
        }
      },
      [filePath, loadReviewedStatus]
    );

    useEventBus('review:changed', handleDataChange);

    
    const handleFilterSync = useCallback(
      (payload: { sourceFilePath: string; filters: UnifiedFilters }) => {
        
        if (payload.sourceFilePath !== filePath) {
          setFilters(normalizeReviewFilters(payload.filters));
        }
      },
      [filePath]
    );

    useEventBus('review:filter-sync', handleFilterSync);

    const handleAccountChanged = useCallback(
      (payload: AccountChangedPayload) => {
        setFilters((previousFilters) => {
          const normalizedPreviousFilters =
            normalizeReviewFilters(previousFilters);
          const remappedFilters = remapAccountFilterFromAccountChange(
            normalizedPreviousFilters,
            payload
          );

          if (remappedFilters === normalizedPreviousFilters) {
            return previousFilters;
          }

          const nextFilters = normalizeReviewFilters(remappedFilters);

          persistViewFilter(plugin.uiStateManager, 'reviews', nextFilters);

          eventBus.publish('review:filter-sync', {
            sourceFilePath: filePath,
            filters: nextFilters,
          });

          return nextFilters;
        });
      },
      [filePath, plugin]
    );

    useEventBus('account:changed', handleAccountChanged);

    
    const formatDRCDate = useCallback((date: Date): string => {
      const dayKey = `widget.header.day.${date.getDay()}`;
      const monthKey = `widget.header.month.${date.getMonth()}`;
      const dayName = hasTranslation(dayKey) ? t(dayKey) : dayKey;
      const monthName = hasTranslation(monthKey) ? t(monthKey) : monthKey;
      const day = date.getDate();
      const year = date.getFullYear();

      return `${dayName}, ${monthName} ${day}, ${year}`;
    }, []);

    const formatWeeklyDate = useCallback(
      (date: Date, frontmatter: Record<string, unknown>): string => {
        const weekStartDay = getWeekStartDaySetting(plugin);
        const weekNumber = getWeekNumberForDate(date, weekStartDay);
        
        const week = frontmatter.week || `W${weekNumber}`;

        
        
        
        const year = frontmatter.year || date.getFullYear();
        const monthIndex = frontmatter.month
          ? parseInt(String(frontmatter.month), 10) - 1
          : date.getMonth();
        const monthKey = `widget.header.month.${monthIndex}`;
        const monthName = hasTranslation(monthKey) ? t(monthKey) : monthKey;

        return `${week} - ${monthName} ${year}`;
      },
      [plugin]
    );

    const formatMonthlyDate = useCallback(
      (date: Date, frontmatter: Record<string, unknown>): string => {
        
        const fmMonth =
          typeof frontmatter.month === 'number' ? frontmatter.month : null;
        const monthIndex = fmMonth !== null ? fmMonth - 1 : date.getMonth();
        const monthKey = `widget.header.month.${monthIndex}`;
        const monthName = hasTranslation(monthKey) ? t(monthKey) : monthKey;
        const fmYear =
          typeof frontmatter.year === 'number' ? frontmatter.year : null;
        const year = fmYear ?? date.getFullYear();

        return `${monthName} ${year}`;
      },
      []
    );

    const formatTradeHeader = useCallback(
      (frontmatter: Record<string, unknown>, _date: Date): string => {
        const instrument =
          typeof frontmatter.instrument === 'string'
            ? frontmatter.instrument
            : t('widget.header.unknown-instrument');
        const direction =
          typeof frontmatter.direction === 'string'
            ? frontmatter.direction
            : '';

        return direction ? `${instrument} ${direction}` : instrument;
      },
      []
    );

    const formatTradeSubtitle = useCallback((date: Date): string => {
      const monthKey = `widget.header.month-short.${date.getMonth()}`;
      const monthName = hasTranslation(monthKey) ? t(monthKey) : monthKey;
      const day = date.getDate();
      const year = date.getFullYear();

      return `${monthName} ${day}, ${year}`;
    }, []);

    const loadHeaderData = useCallback(async () => {
      
      if (preview && previewData) {
        const typeMap: {
          [key: string]:
            | 'drc'
            | 'weekly-review'
            | 'monthly-review'
            | 'quarterly-review'
            | 'yearly-review'
            | 'trade';
        } = {
          drc: 'drc',
          weekly: 'weekly-review',
          monthly: 'monthly-review',
          quarterly: 'quarterly-review',
          yearly: 'yearly-review',
        };

        
        const reviewType = typeMap[previewData.reviewType] || 'drc';
        const date = previewData.date;
        let title: string;
        const mockFrontmatter: Record<string, unknown> = {};

        switch (previewData.reviewType) {
          case 'drc':
            title = formatDRCDate(date);
            break;
          case 'weekly':
            title = formatWeeklyDate(date, mockFrontmatter);
            break;
          case 'monthly':
            title = formatMonthlyDate(date, mockFrontmatter);
            break;
          case 'quarterly': {
            
            const quarter = Math.ceil((date.getMonth() + 1) / 3);
            title =
              t('widget.header.quarter', { number: String(quarter) }) +
              ` ${date.getFullYear()}`;
            break;
          }
          case 'yearly':
            
            title = String(date.getFullYear());
            break;
          default:
            title = formatDRCDate(date);
        }

        setHeaderData({
          type: reviewType,
          date: previewData.date,
          title,
          subtitle: undefined,
        });
        setLoading(false);
        return;
      }

      
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
          if (retryTimeoutRef.current !== null) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(
            () => loadHeaderData(),
            FRONTMATTER_RETRY_DELAY_MS
          );
          return;
        }
        logger.debug(
          '[HeaderWidget] No frontmatter found for:',
          filePath,
          '(after retries)'
        );
        setLoading(false);
        return;
      }

      
      const validTypes = [
        'drc',
        'weekly-review',
        'monthly-review',
        'quarterly-review',
        'yearly-review',
        'trade',
      ];
      if (!validTypes.includes(frontmatter.type)) {
        logger.debug(
          '[HeaderWidget] Invalid type:',
          frontmatter.type,
          'for:',
          filePath
        );
        setLoading(false);
        return;
      }

      const dateStr = getHeaderDateValue(frontmatter);

      if (!dateStr) {
        logger.debug(
          '[HeaderWidget] Missing date field for:',
          filePath,
          'frontmatter:',
          frontmatter
        );
        setLoading(false);
        return;
      }

      
      
      const date = parseLocalDateSafe(
        dateStr as Date | string | number | null | undefined
      );
      if (!date) {
        logger.debug('[HeaderWidget] Invalid date:', dateStr, 'for:', filePath);
        setLoading(false);
        return;
      }

      
      let title = '';
      let subtitle: string | undefined;

      switch (frontmatter.type) {
        case 'drc':
          title = formatDRCDate(date);
          break;
        case 'weekly-review':
          title = formatWeeklyDate(date, frontmatter);
          break;
        case 'monthly-review':
          title = formatMonthlyDate(date, frontmatter);
          break;
        case 'quarterly-review': {
          
          
          const quarter =
            frontmatter.quarter || Math.ceil((date.getMonth() + 1) / 3);
          const qYear = frontmatter.year || date.getFullYear();
          title = `Q${quarter} ${qYear}`;
          break;
        }
        case 'yearly-review':
          
          title = `${frontmatter.year || date.getFullYear()}`;
          break;
        case 'trade':
          title = formatTradeHeader(frontmatter, date);
          subtitle = formatTradeSubtitle(date);
          break;
      }

      setHeaderData({
        type: frontmatter.type,
        date,
        title,
        subtitle,
      });

      
      const persistedFilters =
        plugin.uiStateManager.getState().viewFilters?.reviews;
      if (persistedFilters) {
        setFilters(normalizeReviewFilters(persistedFilters));
      }

      
      if (
        [
          'drc',
          'weekly-review',
          'monthly-review',
          'quarterly-review',
          'yearly-review',
        ].includes(frontmatter.type)
      ) {
        if (frontmatter.type === 'drc') {
          const eodReview = frontmatter.endOfDayReview || {};
          setReviewed(eodReview.reviewed ?? false);
        } else {
          setReviewed(frontmatter.reviewed ?? false);
        }
      }

      setLoading(false);
    }, [
      filePath,
      plugin,
      preview,
      previewData,
      retryCountRef,
      retryTimeoutRef,
      formatDRCDate,
      formatWeeklyDate,
      formatMonthlyDate,
      formatTradeHeader,
      formatTradeSubtitle,
    ]);

    useEffect(() => {
      retryCountRef.current = 0;
      loadHeaderData();

      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          
          loadReviewedStatus();
          if (!headerDataRef.current) {
            loadHeaderData();
          }
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        if (retryTimeoutRef.current !== null) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      };
    }, [
      filePath,
      preview,
      previewData,
      loadHeaderData,
      loadReviewedStatus,
      plugin.app.metadataCache,
    ]);

    const toggleReviewedStatus = async () => {
      if (preview || !headerData) return;

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const newReviewed = !reviewed;
      const newReviewedAt = newReviewed ? new Date().toISOString() : null;

      
      setReviewed(newReviewed);

      try {
        if (headerData.type === 'drc') {
          
          const cache = plugin.app.metadataCache.getFileCache(file);
          const currentEodReview = cache?.frontmatter?.endOfDayReview || {};
          await plugin.drcService.updateDRCFrontmatter(
            filePath,
            {
              endOfDayReview: {
                ...currentEodReview,
                reviewed: newReviewed,
                reviewedAt: newReviewedAt,
              },
            },
            'user-input'
          );
        } else if (headerData.type === 'weekly-review') {
          await plugin.weeklyReviewService.updateWeeklyReviewFrontmatter(
            filePath,
            {
              reviewed: newReviewed,
              reviewedAt: newReviewedAt,
            }
          );
        } else if (headerData.type === 'monthly-review') {
          await plugin.monthlyReviewService.updateMonthlyReviewFrontmatter(
            filePath,
            {
              reviewed: newReviewed,
              reviewedAt: newReviewedAt,
            }
          );
        } else if (headerData.type === 'quarterly-review') {
          const quarterlyService =
            await plugin.serviceManager.getQuarterlyReviewService();
          await quarterlyService.updateQuarterlyReviewFrontmatter(filePath, {
            reviewed: newReviewed,
            reviewedAt: newReviewedAt,
          });
        } else if (headerData.type === 'yearly-review') {
          const yearlyService =
            await plugin.serviceManager.getYearlyReviewService();
          await yearlyService.updateYearlyReviewFrontmatter(filePath, {
            reviewed: newReviewed,
            reviewedAt: newReviewedAt,
          });
        }

        
        const typeMap: Record<
          string,
          'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
        > = {
          drc: 'drc',
          'weekly-review': 'weekly',
          'monthly-review': 'monthly',
          'quarterly-review': 'quarterly',
          'yearly-review': 'yearly',
        };
        const normalizedType = typeMap[headerData.type] ?? 'drc';
        eventBus.publish('review:changed', {
          action: 'updated',
          type: normalizedType,
          filePath,
        });
      } catch (error) {
        console.error(
          '[HeaderWidget] Failed to toggle reviewed status:',
          error
        );
        
        setReviewed(!newReviewed);
      }
    };

    const getFrontmatterNumber = (
      frontmatter: Record<string, unknown>,
      key: string
    ): number | null => {
      const value = frontmatter[key];

      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }

      return null;
    };

    const getContextDate = (): Date => {
      if (!headerData) return new Date();

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        return headerData.date;
      }

      const frontmatter =
        plugin.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!frontmatter || typeof frontmatter !== 'object') {
        return headerData.date;
      }

      const fm = frontmatter as Record<string, unknown>;
      const fmYear = getFrontmatterNumber(fm, 'year');
      const fmMonth = getFrontmatterNumber(fm, 'month');
      const fmQuarter = getFrontmatterNumber(fm, 'quarter');

      switch (headerData.type) {
        case 'weekly-review':
        case 'monthly-review':
          if (
            fmYear !== null &&
            fmMonth !== null &&
            fmMonth >= 1 &&
            fmMonth <= 12
          ) {
            return new Date(fmYear, fmMonth - 1, 15);
          }
          return headerData.date;
        case 'quarterly-review':
          if (
            fmYear !== null &&
            fmQuarter !== null &&
            fmQuarter >= 1 &&
            fmQuarter <= 4
          ) {
            return new Date(fmYear, (fmQuarter - 1) * 3 + 1, 15);
          }
          return headerData.date;
        case 'yearly-review':
          if (fmYear !== null) {
            return new Date(fmYear, 6, 1);
          }
          return headerData.date;
        default:
          return headerData.date;
      }
    };

    const handleNavigate = async (offset: number) => {
      if (!headerData || preview) return;

      let adjacentPath: string | null = null;
      const navigationDate =
        headerData.type === 'monthly-review' ||
        headerData.type === 'quarterly-review' ||
        headerData.type === 'yearly-review'
          ? getContextDate()
          : headerData.date;

      try {
        switch (headerData.type) {
          case 'drc':
            adjacentPath = await plugin.drcService.getAdjacentDRC(
              navigationDate,
              offset
            );
            break;
          case 'weekly-review':
            adjacentPath =
              await plugin.weeklyReviewService.getAdjacentWeeklyReview(
                navigationDate,
                offset
              );
            break;
          case 'monthly-review':
            adjacentPath =
              await plugin.monthlyReviewService.getAdjacentMonthlyReview(
                navigationDate,
                offset
              );
            break;
          case 'quarterly-review': {
            const quarterlyService =
              await plugin.serviceManager.getQuarterlyReviewService();
            adjacentPath = await quarterlyService.getAdjacentQuarterlyReview(
              navigationDate,
              offset
            );
            break;
          }
          case 'yearly-review': {
            const yearlyService =
              await plugin.serviceManager.getYearlyReviewService();
            adjacentPath = await yearlyService.getAdjacentYearlyReview(
              navigationDate,
              offset
            );
            break;
          }
          case 'trade':
            
            adjacentPath = await getAdjacentTrade(offset);
            break;
        }

        if (adjacentPath) {
          await plugin.app.workspace.openLinkText(adjacentPath, filePath);
        }
      } catch (error) {
        console.error('Failed to navigate:', error);
      }
    };

    const getAdjacentTrade = async (offset: number): Promise<string | null> => {
      
      const allTrades = await plugin.tradeService.getTradeData({
        fresh: false,
      });
      const sameDayTrades = allTrades.filter((trade) => {
        
        if (!trade.entryTime) return false;
        const tradeDate = new Date(trade.entryTime);
        return (
          tradeDate.getFullYear() === headerData!.date.getFullYear() &&
          tradeDate.getMonth() === headerData!.date.getMonth() &&
          tradeDate.getDate() === headerData!.date.getDate()
        );
      });

      
      sameDayTrades.sort((a, b) => {
        const dateA = new Date(a.entryTime || 0);
        const dateB = new Date(b.entryTime || 0);
        return dateA.getTime() - dateB.getTime();
      });

      
      const currentIndex = sameDayTrades.findIndex(
        (trade) => trade.filePath === filePath
      );
      if (currentIndex === -1) return null;

      
      const targetIndex = currentIndex + offset;
      if (targetIndex < 0 || targetIndex >= sameDayTrades.length) {
        return null;
      }

      return sameDayTrades[targetIndex].filePath || null;
    };

    const handleRelatedReviewClick = async (
      reviewPath: string,
      reviewType: 'drc' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
      targetDate?: Date
    ) => {
      if (preview) return;
      try {
        
        const exists = await plugin.app.vault.adapter.exists(reviewPath);
        if (!exists) {
          
          
          const date = targetDate ?? headerData?.date ?? new Date();
          switch (reviewType) {
            case 'drc':
              await plugin.drcService.createDRC(date);
              break;
            case 'weekly':
              await plugin.weeklyReviewService.createWeeklyReview(date);
              break;
            case 'monthly':
              await plugin.monthlyReviewService.createMonthlyReview(date);
              break;
            case 'quarterly': {
              const quarterlyService =
                await plugin.serviceManager.getQuarterlyReviewService();
              await quarterlyService.createQuarterlyReview(date);
              break;
            }
            case 'yearly': {
              const yearlyService =
                await plugin.serviceManager.getYearlyReviewService();
              await yearlyService.createYearlyReview(date);
              break;
            }
          }
        }
        await plugin.app.workspace.openLinkText(reviewPath, filePath);
      } catch (error) {
        console.error('Failed to open related review:', error);
      }
    };

    const handleOpenFilterModal = useCallback(async () => {
      if (!plugin?.app) return;

      let availableAccounts: string[] = [];
      let availableCustomFieldFilters: AvailableCustomFieldFilter[] = [];

      let tradeLogService: TradeLogService | null = null;
      try {
        tradeLogService = new TradeLogService(plugin);
        [availableAccounts, availableCustomFieldFilters] = await Promise.all([
          tradeLogService.getUniqueAccounts(),
          tradeLogService.getAvailableCustomFieldFilters(discreteCustomFields),
        ]);
      } catch (error) {
        console.error(
          '[ReviewHeaderWidget] Failed to load custom field filter options:',
          error
        );
      } finally {
        tradeLogService?.destroy();
      }

      openFilterModal({
        app: plugin.app,
        plugin,
        context: 'review',
        currentFilters: {
          ...filters,
          customFieldFilters: sanitizedCustomFieldFilters,
        },
        availableAccounts,
        availableCustomFieldFilters,
        onApply: async (newFilters: UnifiedFilters) => {
          const mergedFilters = normalizeReviewFilters({
            ...newFilters,
            customFieldFilters: sanitizeCustomFieldFilters(
              newFilters.customFieldFilters,
              discreteCustomFields
            ),
          });

          setFilters(mergedFilters);

          persistViewFilter(plugin.uiStateManager, 'reviews', mergedFilters);

          
          eventBus.publish('filter:changed', {
            filePath,
            filters: mergedFilters,
          });

          
          eventBus.publish('review:filter-sync', {
            sourceFilePath: filePath,
            filters: mergedFilters,
          });
        },
        onClose: () => {},
      });
    }, [
      plugin,
      filters,
      filePath,
      discreteCustomFields,
      sanitizedCustomFieldFilters,
    ]);

    const handleSwitchTemplate = useCallback(() => {
      if (preview) return;
      plugin.app.commands?.executeCommandById('journalit:switch-template');
    }, [plugin, preview]);

    const activeFilterCount = useMemo(() => {
      return (
        (filters.accounts?.length || 0) +
        (filters.tickers?.length || 0) +
        (filters.setups?.length || 0) +
        (filters.tags?.length || 0) +
        (filters.mistakes?.length || 0) +
        getTradeTypeFilterActiveCount(
          filters.tradeTypes,
          createReviewFilters().tradeTypes
        ) +
        (filters.statuses?.length || 0) +
        Object.values(sanitizedCustomFieldFilters).filter(
          (values) => values.length > 0
        ).length
      );
    }, [filters, sanitizedCustomFieldFilters]);

    if (loading) {
      
      return (
        <div className="journalit-header-content layout-e">
          <div className="journalit-header-main">
            
            <div className="journalit-header-skeleton-title">
              <SkeletonBox width={200} height={24} borderRadius="4px" />
              <SkeletonCircle size={20} />
            </div>
            
            <div className="journalit-header-skeleton-links">
              <SkeletonBox width={50} height={14} borderRadius="4px" />
              <SkeletonBox width={80} height={14} borderRadius="4px" />
            </div>
          </div>
          <div className="journalit-header-subtle-controls">
            <SkeletonBox width={28} height={28} borderRadius="4px" />
            <SkeletonBox width={45} height={14} borderRadius="4px" />
            <SkeletonBox width={45} height={14} borderRadius="4px" />
          </div>
        </div>
      );
    }

    if (!headerData) {
      return (
        <InvalidContextMessage
          widgetType={t('widget.header.name')}
          reason={t('widget.header.invalid-context')}
        />
      );
    }

    
    const getContextLinks = () => {
      const contextDate = getContextDate();
      const weekStartDay = getWeekStartDaySetting(plugin);
      const weekNum = getWeekNumberForDate(headerData.date, weekStartDay);
      const monthKey = `widget.header.month.${contextDate.getMonth()}`;
      const monthName = hasTranslation(monthKey) ? t(monthKey) : monthKey;
      const year = contextDate.getFullYear().toString();
      const quarter = Math.ceil((contextDate.getMonth() + 1) / 3);
      const quarterLabel = t('widget.header.quarter', {
        number: String(quarter),
      });

      switch (headerData.type) {
        case 'drc':
          return (
            <>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (preview) return;
                  const path = plugin.weeklyReviewService.getWeeklyReviewPath(
                    headerData.date
                  );
                  handleRelatedReviewClick(path, 'weekly');
                }}
              >
                {t('widget.header.week', { number: String(weekNum) })}
              </span>
              <span className="context-separator">·</span>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (preview) return;
                  const path =
                    plugin.monthlyReviewService.getMonthlyReviewPath(
                      contextDate
                    );
                  handleRelatedReviewClick(path, 'monthly');
                }}
              >
                {monthName}
              </span>
            </>
          );

        case 'weekly-review':
          return (
            <>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (preview) return;
                  const path =
                    plugin.monthlyReviewService.getMonthlyReviewPath(
                      contextDate
                    );
                  handleRelatedReviewClick(path, 'monthly', contextDate);
                }}
              >
                {monthName}
              </span>
              <span className="context-separator">·</span>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={async () => {
                  if (preview) return;
                  const quarterlyService =
                    await plugin.serviceManager.getQuarterlyReviewService();
                  const path =
                    await quarterlyService.getQuarterlyReviewPath(contextDate);
                  handleRelatedReviewClick(path, 'quarterly', contextDate);
                }}
              >
                {quarterLabel}
              </span>
              <span className="context-separator">·</span>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={async () => {
                  if (preview) return;
                  const yearlyService =
                    await plugin.serviceManager.getYearlyReviewService();
                  const path =
                    await yearlyService.getYearlyReviewPath(contextDate);
                  handleRelatedReviewClick(path, 'yearly', contextDate);
                }}
              >
                {year}
              </span>
            </>
          );

        case 'monthly-review':
          return (
            <>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={async () => {
                  if (preview) return;
                  const quarterlyService =
                    await plugin.serviceManager.getQuarterlyReviewService();
                  const path =
                    await quarterlyService.getQuarterlyReviewPath(contextDate);
                  handleRelatedReviewClick(path, 'quarterly', contextDate);
                }}
              >
                {quarterLabel}
              </span>
              <span className="context-separator">·</span>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={async () => {
                  if (preview) return;
                  const yearlyService =
                    await plugin.serviceManager.getYearlyReviewService();
                  const path =
                    await yearlyService.getYearlyReviewPath(contextDate);
                  handleRelatedReviewClick(path, 'yearly', contextDate);
                }}
              >
                {year}
              </span>
            </>
          );

        case 'quarterly-review':
          return (
            <>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={async () => {
                  if (preview) return;
                  const yearlyService =
                    await plugin.serviceManager.getYearlyReviewService();
                  const path =
                    await yearlyService.getYearlyReviewPath(contextDate);
                  handleRelatedReviewClick(path, 'yearly', contextDate);
                }}
              >
                {year}
              </span>
            </>
          );

        case 'yearly-review':
          
          return (
            <>
              {[1, 2, 3, 4].map((q, idx) => (
                <React.Fragment key={q}>
                  {idx > 0 && <span className="context-separator">·</span>}
                  <span
                    className={`context-link ${preview ? 'disabled' : ''}`}
                    role="button"
                    tabIndex={preview ? -1 : 0}
                    aria-disabled={preview || undefined}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      e.currentTarget.click();
                    }}
                    onClick={async () => {
                      if (preview) return;
                      const quarterlyService =
                        await plugin.serviceManager.getQuarterlyReviewService();
                      
                      const quarterDate = new Date(
                        contextDate.getFullYear(),
                        (q - 1) * 3 + 1,
                        15
                      );
                      const path =
                        await quarterlyService.getQuarterlyReviewPath(
                          quarterDate
                        );
                      handleRelatedReviewClick(path, 'quarterly', quarterDate);
                    }}
                  >
                    {t('widget.header.quarter', { number: String(q) })}
                  </span>
                </React.Fragment>
              ))}
            </>
          );

        case 'trade':
          return (
            <>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (preview) return;
                  const path = plugin.drcService.getDRCNotePath(
                    headerData.date
                  );
                  handleRelatedReviewClick(path, 'drc');
                }}
              >
                {t('widget.header.drc')}
              </span>
              <span className="context-separator">·</span>
              <span
                className={`context-link ${preview ? 'disabled' : ''}`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (preview) return;
                  const path = plugin.weeklyReviewService.getWeeklyReviewPath(
                    headerData.date
                  );
                  handleRelatedReviewClick(path, 'weekly');
                }}
              >
                {t('widget.header.week', { number: String(weekNum) })}
              </span>
            </>
          );

        default:
          return null;
      }
    };

    
    return (
      <div className="journalit-header-content layout-e">
        <div className="journalit-header-main">
          <div className="journalit-header-title">
            <span className="journalit-header-title-text">
              {headerData.title}
            </span>
            
            {headerData.type !== 'trade' && (
              <span
                className={`reviewed-indicator clickable-icon ${
                  preview ? 'reviewed-indicator--disabled' : ''
                }`}
                role="button"
                tabIndex={preview ? -1 : 0}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                aria-label={
                  reviewed
                    ? t('widget.header.aria.mark-not-reviewed')
                    : t('widget.header.aria.mark-reviewed')
                }
                onClick={toggleReviewedStatus}
              >
                {reviewed ? (
                  <CheckCircle2
                    size={20}
                    className="journalit-header-reviewed-icon"
                  />
                ) : (
                  <Circle
                    size={20}
                    className="journalit-header-unreviewed-icon"
                  />
                )}
              </span>
            )}
          </div>
          {headerData.subtitle && (
            <div className="journalit-header-subtitle">
              {headerData.subtitle}
            </div>
          )}
          <div className="journalit-header-context">{getContextLinks()}</div>
        </div>
        <div className="journalit-header-subtle-controls">
          {headerData.type !== 'trade' && (
            <button
              type="button"
              className="journalit-header-icon-button"
              onClick={handleOpenFilterModal}
              disabled={preview}
              aria-label={
                preview
                  ? t('shared.filter.disabled-preview')
                  : t('shared.filter.open')
              }
            >
              <Funnel size={16} aria-hidden="true" />
              {!preview && activeFilterCount > 0 && (
                <span
                  className="journalit-header-filter-badge"
                  aria-label={t('shared.filter.active-count', {
                    count: activeFilterCount.toString(),
                  })}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
          {headerData.type !== 'trade' && (
            <button
              type="button"
              className="journalit-header-icon-button"
              onClick={handleSwitchTemplate}
              disabled={preview}
              aria-label={t('command.switch-template')}
            >
              <Repeat2 size={16} aria-hidden="true" />
            </button>
          )}
          <span
            className={`nav-link ${preview ? 'disabled' : ''}`}
            role="button"
            tabIndex={preview ? -1 : 0}
            aria-disabled={preview || undefined}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              e.currentTarget.click();
            }}
            onClick={() => !preview && handleNavigate(-1)}
          >
            {t('widget.header.nav.prev')}
          </span>
          <span
            className={`nav-link ${preview ? 'disabled' : ''}`}
            role="button"
            tabIndex={preview ? -1 : 0}
            aria-disabled={preview || undefined}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              e.currentTarget.click();
            }}
            onClick={() => !preview && handleNavigate(1)}
          >
            {t('widget.header.nav.next')}
          </span>
        </div>
      </div>
    );
  }
);

HeaderWidget.displayName = 'HeaderWidget';
