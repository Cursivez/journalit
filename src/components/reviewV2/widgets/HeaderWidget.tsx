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
import { useReviewReadOnly } from '../ReviewReadOnlyContext';
import { InvalidContextMessage } from './InvalidContextMessage';
import type { UnifiedFilters } from '../../shared/filters/types';
import {
  FilterMenuButton,
  type LoadedFilterMenuOptions,
} from '../../shared/filters/menu/FilterMenu';
import { HeaderPreviewData } from '../../../types/reviewV2';
import { eventBus } from '../../../services/events/EventBus';
import { reviewChangeAffectsPath } from '../../../services/events/reviewChangedPaths';
import { useEventBus } from '../../../hooks/useEventBus';
import type {
  AccountChangedPayload,
  ReviewChangedPayload,
} from '../../../services/events/types';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonCircle } from '../../shared/SkeletonCircle';
import {
  getWeekNumberForDate,
  getWeekStartDaySetting,
  parseLocalDateSafe,
} from '../../../utils/dateUtils';
import { hasTranslation, t } from '../../../lang/helpers';
import { normalizeReviewFilters } from '../../../settings/viewFiltersDefaults';
import {
  type CustomFieldDefinition,
  isDiscreteCustomFieldFilterable,
} from '../../../types/customFields';
import { TradeLogService } from '../../../services/tradelog/TradeLogService';
import { remapAccountFilterFromAccountChange } from '../../shared/filters/remapSelectedAccounts';
import { persistViewFilter } from '../../shared/filters/viewFilterPersistence';
import { mergeClassNames } from '../../../utils/classNames';
import { sanitizeFilterCustomFields } from '../../shared/filters/sanitizeCustomFieldFilters';
import { loadTradeFilterMenuOptions } from '../../shared/filters/menu/loadTradeFilterMenuOptions';
import { openReviewLayoutSwitcher } from '../../../services/templates/openReviewLayoutSwitcher';
import { formatLocalizedReviewDate } from '../../../utils/localizedDateTime';
import { shareCaptureExcludeProps } from '../../../services/share/brandedCapture';
import {
  useGuideTarget,
  useGuideLeaf,
  useResolvedViewGuide,
} from '../../../guides/GuideRuntimeLayer';
import {
  REVIEW_HEADER_GUIDE_ID,
  REVIEW_HEADER_INTRO_TARGET_ID,
  REVIEW_HEADER_REVIEWED_TARGET_ID,
  REVIEW_HEADER_DATES_TARGET_ID,
  REVIEW_HEADER_CONTROLS_TARGET_ID,
} from '../../../guides/reviewHeaderGuideIds';

function frontmatterHeaderValueToString(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (value instanceof Date) return value.toISOString();
  return JSON.stringify(value);
}

interface HeaderWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  preview?: boolean;
  previewData?: HeaderPreviewData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined;
}

function isHeaderDataType(value: unknown): value is HeaderData['type'] {
  switch (value) {
    case 'drc':
    case 'weekly-review':
    case 'monthly-review':
    case 'quarterly-review':
    case 'yearly-review':
    case 'trade':
      return true;
    default:
      return false;
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

function getBooleanValue(
  record: Record<string, unknown> | undefined,
  key: string
): boolean {
  const value = record?.[key];
  return typeof value === 'boolean' ? value : false;
}

function getStringValue(
  record: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
}

function parseHeaderDateValue(value: unknown): Date | null {
  return parseLocalDateSafe(toDateInput(value));
}

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
    const entryRecord = asRecord(entry);
    if (entryRecord) {
      const time = entryRecord.time;
      if (time) {
        const parsedDate = parseHeaderDateValue(time);
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

const ReviewHeaderGuideResolution: React.FC = () => {
  useResolvedViewGuide(REVIEW_HEADER_GUIDE_ID);
  return null;
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

export const HeaderWidget: React.FC<HeaderWidgetProps> = React.memo(
  ({ filePath, plugin, preview, previewData }) => {
    const embeddedReadOnly = useReviewReadOnly();
    const readOnly = preview || embeddedReadOnly;
    const [headerData, setHeaderData] = useState<HeaderData | null>(null);
    const [loading, setLoading] = useState(true);
    const introGuideTarget = useGuideTarget(REVIEW_HEADER_INTRO_TARGET_ID);
    const reviewedGuideTarget = useGuideTarget(
      REVIEW_HEADER_REVIEWED_TARGET_ID
    );
    const datesGuideTarget = useGuideTarget(REVIEW_HEADER_DATES_TARGET_ID);
    const controlsGuideTarget = useGuideTarget(
      REVIEW_HEADER_CONTROLS_TARGET_ID
    );
    const guideLeaf = useGuideLeaf();
    const headerDataRef = useRef<HeaderData | null>(null);
    
    const [filters, setFilters] = useState<UnifiedFilters>(() => {
      return normalizeReviewFilters(
        plugin.uiStateManager.getState().viewFilters?.reviews
      );
    });
    const filtersRef = useRef(filters);
    const applyFilters = useCallback((nextFilters: UnifiedFilters) => {
      filtersRef.current = nextFilters;
      setFilters(nextFilters);
    }, []);
    const [reviewed, setReviewed] = useState<boolean>(false);
    const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(
      () => plugin.customFieldsService?.getFields() || []
    );
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<number | null>(null);

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

    
    
    const sanitizedFilters = useMemo(
      () => sanitizeFilterCustomFields(filters, discreteCustomFields),
      [discreteCustomFields, filters]
    );

    useEffect(() => {
      
      if (readOnly) return;
      const currentFilters = filtersRef.current;
      const sanitized = sanitizeFilterCustomFields(
        currentFilters,
        discreteCustomFields
      );
      if (sanitized === currentFilters) {
        return;
      }

      const mergedFilters = normalizeReviewFilters(sanitized);
      applyFilters(mergedFilters);

      persistViewFilter(plugin.uiStateManager, 'reviews', mergedFilters);

      eventBus.publish('filter:changed', {
        filePath,
        filters: mergedFilters,
      });

      eventBus.publish('review:filter-sync', {
        sourceFilePath: filePath,
        filters: mergedFilters,
      });
    }, [
      applyFilters,
      discreteCustomFields,
      filePath,
      filters.customFieldFilters,
      filters.exclusions,
      filters.matchModes,
      plugin,
      readOnly,
    ]);

    
    const loadReviewedStatus = useCallback(() => {
      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = asRecord(cache?.frontmatter);
      if (!frontmatter) return;

      
      if (
        ![
          'drc',
          'weekly-review',
          'monthly-review',
          'quarterly-review',
          'yearly-review',
        ].includes(String(frontmatter.type))
      )
        return;

      if (frontmatter.type === 'drc') {
        const eodReview = asRecord(frontmatter.endOfDayReview);
        setReviewed(getBooleanValue(eodReview, 'reviewed'));
      } else {
        setReviewed(getBooleanValue(frontmatter, 'reviewed'));
      }
    }, [filePath, plugin]);

    
    const handleDataChange = useCallback(
      (payload: ReviewChangedPayload) => {
        if (reviewChangeAffectsPath(payload, filePath)) {
          loadReviewedStatus();
        }
      },
      [filePath, loadReviewedStatus]
    );

    useEventBus('review:changed', handleDataChange);

    
    const handleFilterSync = useCallback(
      (payload: { sourceFilePath: string; filters: UnifiedFilters }) => {
        
        if (payload.sourceFilePath !== filePath) {
          const nextFilters = normalizeReviewFilters(payload.filters);
          applyFilters(nextFilters);
        }
      },
      [applyFilters, filePath]
    );

    useEventBus('review:filter-sync', handleFilterSync);

    const handleAccountChanged = useCallback(
      (payload: AccountChangedPayload) => {
        const normalizedPreviousFilters = normalizeReviewFilters(
          filtersRef.current
        );
        const remappedFilters = remapAccountFilterFromAccountChange(
          normalizedPreviousFilters,
          payload
        );

        if (remappedFilters === normalizedPreviousFilters) return;

        const nextFilters = normalizeReviewFilters(remappedFilters);
        applyFilters(nextFilters);

        persistViewFilter(plugin.uiStateManager, 'reviews', nextFilters);

        eventBus.publish('review:filter-sync', {
          sourceFilePath: filePath,
          filters: nextFilters,
        });
      },
      [applyFilters, filePath, plugin]
    );

    
    
    useEventBus('account:changed', handleAccountChanged);

    const formatWeeklyDate = useCallback(
      (date: Date, frontmatter: Record<string, unknown>): string => {
        const weekStartDay = getWeekStartDaySetting(plugin);
        const weekNumber = getWeekNumberForDate(date, weekStartDay);
        
        const week = frontmatter.week
          ? frontmatterHeaderValueToString(frontmatter.week)
          : `W${weekNumber}`;

        
        
        
        const year = frontmatter.year
          ? frontmatterHeaderValueToString(frontmatter.year)
          : date.getFullYear();
        const monthIndex = frontmatter.month
          ? parseInt(frontmatterHeaderValueToString(frontmatter.month), 10) - 1
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
            title = formatLocalizedReviewDate(date, 'full');
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
            title = formatLocalizedReviewDate(date, 'full');
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
            window.clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = window.setTimeout(
            () => void loadHeaderData(),
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

      
      if (!isHeaderDataType(frontmatter.type)) {
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

      
      
      const date = parseHeaderDateValue(dateStr);
      if (!date) {
        logger.debug('[HeaderWidget] Invalid date:', dateStr, 'for:', filePath);
        setLoading(false);
        return;
      }

      
      let title = '';
      let subtitle: string | undefined;

      switch (frontmatter.type) {
        case 'drc':
          title = formatLocalizedReviewDate(date, 'full');
          break;
        case 'weekly-review':
          title = formatWeeklyDate(date, frontmatter);
          break;
        case 'monthly-review':
          title = formatMonthlyDate(date, frontmatter);
          break;
        case 'quarterly-review': {
          
          
          const quarter =
            typeof frontmatter.quarter === 'number'
              ? frontmatter.quarter
              : Math.ceil((date.getMonth() + 1) / 3);
          const qYear =
            typeof frontmatter.year === 'number' ||
            typeof frontmatter.year === 'string'
              ? frontmatter.year
              : date.getFullYear();
          title = `Q${quarter} ${qYear}`;
          break;
        }
        case 'yearly-review':
          
          title = `${typeof frontmatter.year === 'number' || typeof frontmatter.year === 'string' ? frontmatter.year : date.getFullYear()}`;
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
        const nextFilters = normalizeReviewFilters(persistedFilters);
        applyFilters(nextFilters);
      }

      
      if (
        [
          'drc',
          'weekly-review',
          'monthly-review',
          'quarterly-review',
          'yearly-review',
        ].includes(String(frontmatter.type))
      ) {
        if (frontmatter.type === 'drc') {
          const eodReview = asRecord(frontmatter.endOfDayReview);
          setReviewed(getBooleanValue(eodReview, 'reviewed'));
        } else {
          setReviewed(getBooleanValue(frontmatter, 'reviewed'));
        }
      }

      setLoading(false);
    }, [
      applyFilters,
      filePath,
      plugin,
      preview,
      previewData,
      retryCountRef,
      retryTimeoutRef,
      formatWeeklyDate,
      formatMonthlyDate,
      formatTradeHeader,
      formatTradeSubtitle,
    ]);

    useEffect(() => {
      retryCountRef.current = 0;
      void loadHeaderData();

      
      const handleMetadataChange = (file: TFile) => {
        if (file.path === filePath) {
          
          loadReviewedStatus();
          if (!headerDataRef.current) {
            void loadHeaderData();
          }
        }
      };

      plugin.app.metadataCache.on('changed', handleMetadataChange);

      return () => {
        plugin.app.metadataCache.off('changed', handleMetadataChange);
        if (retryTimeoutRef.current !== null) {
          window.clearTimeout(retryTimeoutRef.current);
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
      if (readOnly || !headerData) return;

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) return;

      const newReviewed = !reviewed;
      const newReviewedAt = newReviewed ? new Date().toISOString() : null;

      
      setReviewed(newReviewed);

      try {
        if (headerData.type === 'drc') {
          
          const cache = plugin.app.metadataCache.getFileCache(file);
          const currentEodReview =
            asRecord(cache?.frontmatter?.endOfDayReview) ?? {};
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
      const sameDayTrades = allTrades.flatMap((trade) => {
        const tradeRecord = asRecord(trade);
        if (!tradeRecord) return [];
        
        if (!tradeRecord.entryTime) return [];
        const tradeDate = new Date(toDateInput(tradeRecord.entryTime) ?? 0);
        return tradeDate.getFullYear() === headerData!.date.getFullYear() &&
          tradeDate.getMonth() === headerData!.date.getMonth() &&
          tradeDate.getDate() === headerData!.date.getDate()
          ? [tradeRecord]
          : [];
      });

      
      sameDayTrades.sort((a, b) => {
        const dateA = new Date(toDateInput(a.entryTime) ?? 0);
        const dateB = new Date(toDateInput(b.entryTime) ?? 0);
        return dateA.getTime() - dateB.getTime();
      });

      
      const currentIndex = sameDayTrades.findIndex(
        (trade) => getStringValue(trade, 'filePath') === filePath
      );
      if (currentIndex === -1) return null;

      
      const targetIndex = currentIndex + offset;
      if (targetIndex < 0 || targetIndex >= sameDayTrades.length) {
        return null;
      }

      return getStringValue(sameDayTrades[targetIndex], 'filePath') || null;
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

    const loadFilterMenuOptions =
      useCallback(async (): Promise<LoadedFilterMenuOptions> => {
        
        const tradeLogService = new TradeLogService(plugin);
        try {
          return await loadTradeFilterMenuOptions({
            plugin,
            tradeLogService,
            logPrefix: '[ReviewHeaderWidget]',
          });
        } finally {
          tradeLogService.destroy();
        }
      }, [plugin]);

    const handleFilterMenuChange = useCallback(
      (newFilters: UnifiedFilters) => {
        const mergedFilters = normalizeReviewFilters(
          sanitizeFilterCustomFields(newFilters, discreteCustomFields)
        );
        applyFilters(mergedFilters);

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
      [applyFilters, discreteCustomFields, filePath, plugin]
    );

    const handleSwitchTemplate = useCallback(() => {
      if (readOnly) return;
      void openReviewLayoutSwitcher(plugin, filePath);
    }, [filePath, plugin, readOnly]);

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
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
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
                  void handleRelatedReviewClick(path, 'weekly');
                }}
              >
                {t('widget.header.week', { number: String(weekNum) })}
              </button>
              <span className="context-separator">·</span>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
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
                  void handleRelatedReviewClick(path, 'monthly');
                }}
              >
                {monthName}
              </button>
            </>
          );

        case 'weekly-review':
          return (
            <>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
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
                  void handleRelatedReviewClick(path, 'monthly', contextDate);
                }}
              >
                {monthName}
              </button>
              <span className="context-separator">·</span>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  void (async () => {
                    if (preview) return;
                    const quarterlyService =
                      await plugin.serviceManager.getQuarterlyReviewService();
                    const path =
                      await quarterlyService.getQuarterlyReviewPath(
                        contextDate
                      );
                    void handleRelatedReviewClick(
                      path,
                      'quarterly',
                      contextDate
                    );
                  })();
                }}
              >
                {quarterLabel}
              </button>
              <span className="context-separator">·</span>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  void (async () => {
                    if (preview) return;
                    const yearlyService =
                      await plugin.serviceManager.getYearlyReviewService();
                    const path =
                      await yearlyService.getYearlyReviewPath(contextDate);
                    void handleRelatedReviewClick(path, 'yearly', contextDate);
                  })();
                }}
              >
                {year}
              </button>
            </>
          );

        case 'monthly-review':
          return (
            <>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  void (async () => {
                    if (preview) return;
                    const quarterlyService =
                      await plugin.serviceManager.getQuarterlyReviewService();
                    const path =
                      await quarterlyService.getQuarterlyReviewPath(
                        contextDate
                      );
                    void handleRelatedReviewClick(
                      path,
                      'quarterly',
                      contextDate
                    );
                  })();
                }}
              >
                {quarterLabel}
              </button>
              <span className="context-separator">·</span>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  void (async () => {
                    if (preview) return;
                    const yearlyService =
                      await plugin.serviceManager.getYearlyReviewService();
                    const path =
                      await yearlyService.getYearlyReviewPath(contextDate);
                    void handleRelatedReviewClick(path, 'yearly', contextDate);
                  })();
                }}
              >
                {year}
              </button>
            </>
          );

        case 'quarterly-review':
          return (
            <>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  void (async () => {
                    if (preview) return;
                    const yearlyService =
                      await plugin.serviceManager.getYearlyReviewService();
                    const path =
                      await yearlyService.getYearlyReviewPath(contextDate);
                    void handleRelatedReviewClick(path, 'yearly', contextDate);
                  })();
                }}
              >
                {year}
              </button>
            </>
          );

        case 'yearly-review':
          
          return (
            <>
              {[1, 2, 3, 4].map((q, idx) => (
                <React.Fragment key={q}>
                  {idx > 0 && <span className="context-separator">·</span>}
                  <button
                    type="button"
                    className={mergeClassNames(
                      'journalit-native-button journalit-native-button--unstyled',
                      `context-link ${preview ? 'disabled' : ''}`
                    )}
                    aria-disabled={preview || undefined}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      e.currentTarget.click();
                    }}
                    onClick={() => {
                      void (async () => {
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
                        void handleRelatedReviewClick(
                          path,
                          'quarterly',
                          quarterDate
                        );
                      })();
                    }}
                  >
                    {t('widget.header.quarter', { number: String(q) })}
                  </button>
                </React.Fragment>
              ))}
            </>
          );

        case 'trade':
          return (
            <>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
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
                  void handleRelatedReviewClick(path, 'drc');
                }}
              >
                {t('widget.header.drc')}
              </button>
              <span className="context-separator">·</span>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `context-link ${preview ? 'disabled' : ''}`
                )}
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
                  void handleRelatedReviewClick(path, 'weekly');
                }}
              >
                {t('widget.header.week', { number: String(weekNum) })}
              </button>
            </>
          );

        default:
          return null;
      }
    };

    
    return (
      <div ref={introGuideTarget} className="journalit-header-content layout-e">
        {!readOnly &&
          headerData.type !== 'trade' &&
          guideLeaf?.view.getViewType() === 'markdown' && (
            <ReviewHeaderGuideResolution />
          )}
        <div className="journalit-header-main">
          <div className="journalit-header-title">
            {headerData.type === 'drc' ? (
              <span className="journalit-header-title-text journalit-header-title-text--responsive-date">
                <span className="journalit-header-date-full">
                  {headerData.title}
                </span>
                <span className="journalit-header-date-medium">
                  {formatLocalizedReviewDate(headerData.date, 'medium')}
                </span>
                <span className="journalit-header-date-short">
                  {formatLocalizedReviewDate(headerData.date, 'short')}
                </span>
              </span>
            ) : (
              <span className="journalit-header-title-text">
                {headerData.title}
              </span>
            )}
            
            {headerData.type !== 'trade' && (
              <button
                ref={reviewedGuideTarget}
                type="button"
                {...shareCaptureExcludeProps}
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `reviewed-indicator ${
                    readOnly ? 'reviewed-indicator--disabled' : ''
                  }`
                )}
                disabled={readOnly}
                aria-disabled={readOnly || undefined}
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
                onClick={() => void toggleReviewedStatus()}
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
              </button>
            )}
          </div>
          {headerData.subtitle && (
            <div className="journalit-header-subtitle">
              {headerData.subtitle}
            </div>
          )}
          <div className="journalit-header-bottom-row">
            <div ref={datesGuideTarget} className="journalit-header-context">
              {getContextLinks()}
            </div>
            <div
              ref={controlsGuideTarget}
              className="journalit-header-subtle-controls"
              {...shareCaptureExcludeProps}
            >
              {headerData.type !== 'trade' && (
                <FilterMenuButton
                  plugin={plugin}
                  context="review"
                  filters={sanitizedFilters}
                  onChange={handleFilterMenuChange}
                  loadOptions={loadFilterMenuOptions}
                  renderTrigger={({ onClick, isOpen, activeFilterCount }) => (
                    <button
                      type="button"
                      className="journalit-header-icon-button"
                      onClick={onClick}
                      disabled={readOnly}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
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
                />
              )}
              {headerData.type !== 'trade' && (
                <button
                  type="button"
                  className="journalit-header-icon-button"
                  onClick={handleSwitchTemplate}
                  disabled={readOnly}
                  aria-label={t('template.switch-title')}
                >
                  <Repeat2 size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `nav-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (!preview) void handleNavigate(-1);
                }}
              >
                {t('widget.header.nav.prev')}
              </button>
              <button
                type="button"
                className={mergeClassNames(
                  'journalit-native-button journalit-native-button--unstyled',
                  `nav-link ${preview ? 'disabled' : ''}`
                )}
                aria-disabled={preview || undefined}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return;
                  e.preventDefault();
                  e.currentTarget.click();
                }}
                onClick={() => {
                  if (!preview) void handleNavigate(1);
                }}
              >
                {t('widget.header.nav.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

HeaderWidget.displayName = 'HeaderWidget';
