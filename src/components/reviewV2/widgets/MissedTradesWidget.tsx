

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { TFile, Notice } from 'obsidian';
import { Plus, Ghost } from '../../shared/icons/ObsidianIcon';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { Tooltip } from '../../shared/Tooltip';
import { useEventBus } from '../../../hooks/useEventBus';
import { getTradingDay } from '../../../utils/tradingDayUtils';
import { parseLocalDateSafe } from '../../../utils/dateUtils';
import { t, TranslationKey } from '../../../lang/helpers';
import { parseDisplayText } from '../../../utils/tagSchema';
import type { TradeFormData } from '../../forms/trade/types';
import type JournalitPlugin from '../../../main';


const MAX_FRONTMATTER_RETRIES = 5;
const FRONTMATTER_RETRY_DELAY_MS = 100;


const SUPPORTED_TYPES = ['drc', 'weekly-review'];


const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const MAX_VISIBLE_SETUPS = 2;
const MAX_SETUP_LENGTH = 12;
const SUMMARY_PREVIEW_LENGTH = 140;


type MissedTradesWidgetConfig = object;

interface MissedTradesPreviewData {
  missedTrades: MissedTradeDisplayData[];
  noteType?: 'drc' | 'weekly-review';
}

interface MissedTradeFrontmatter {
  type?: string;
  isMissedTrade?: boolean;
  instrument?: string;
  ticker?: string;
  direction?: string;
  setup?: string | string[];
  setupIds?: string | string[];
  mistake?: string | string[];
  account?: string | string[];
  missedReason?: string;
  thesis?: string;
  entryTime?: string | Date;
  reviewed?: boolean;
}

export interface MissedTradeDisplayData {
  file: TFile | null;
  instrument: string;
  direction: string;
  setup: string[];
  mistake: string[];
  account: string[];
  missedReason?: string;
  thesis?: string;
  entryTime: Date;
  reviewed: boolean;
  path: string;
}

interface MissedTradesWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: MissedTradesWidgetConfig;
  
  preview?: boolean;
  
  previewData?: MissedTradesPreviewData;
}

const normalizeStringList = (value: unknown): string[] => {
  if (!value) return [];

  const normalized = Array.isArray(value) ? value : [value];

  return normalized
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
};

const getValidDate = (value: string | Date | undefined): Date => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
};

export const buildMissedTradeDisplayData = (
  frontmatter: MissedTradeFrontmatter | undefined,
  file: TFile
): MissedTradeDisplayData | null => {
  if (!frontmatter) return null;
  if (frontmatter.type !== 'missed-trade' && !frontmatter.isMissedTrade) {
    return null;
  }

  return {
    file,
    instrument:
      frontmatter.instrument || frontmatter.ticker || t('common.unknown'),
    direction: frontmatter.direction || t('common.unknown'),
    setup: normalizeStringList(frontmatter.setup ?? frontmatter.setupIds),
    mistake: normalizeStringList(frontmatter.mistake),
    account: normalizeStringList(frontmatter.account),
    missedReason: parseDisplayText(frontmatter.missedReason) || '',
    thesis: parseDisplayText(frontmatter.thesis) || '',
    entryTime: getValidDate(frontmatter.entryTime),
    reviewed: frontmatter.reviewed === true,
    path: file.path,
  };
};

const truncateSetup = (setup: string): string => {
  if (setup.length <= MAX_SETUP_LENGTH) return setup;
  return setup.substring(0, MAX_SETUP_LENGTH - 1) + '…';
};

const truncateSummary = (text: string | undefined): string => {
  if (!text) return '';

  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= SUMMARY_PREVIEW_LENGTH) {
    return normalized;
  }

  return normalized.substring(0, SUMMARY_PREVIEW_LENGTH - 1).trimEnd() + '…';
};

const SetupTooltipContent: React.FC<{ setup: string }> = ({ setup }) => (
  <div className="journalit-reviewv2-tooltip-content">{setup}</div>
);

const OverflowSetupsTooltip: React.FC<{
  setups: string[];
  title: string;
}> = ({ setups, title }) => (
  <div className="badge-tooltip setups-tooltip">
    <div className="tooltip-title">{title}</div>
    {setups.map((setup) => (
      <div key={setup} className="tooltip-item">
        • {setup}
      </div>
    ))}
  </div>
);

const MissedTradeSetupTags: React.FC<{
  setups: string[];
  additionalSetupsLabel: string;
}> = ({ setups, additionalSetupsLabel }) => {
  if (setups.length === 0) return null;

  const visibleSetups = setups.slice(0, MAX_VISIBLE_SETUPS);
  const remainingCount = setups.length - MAX_VISIBLE_SETUPS;
  const overflowSetups = setups.slice(MAX_VISIBLE_SETUPS);

  return (
    <div className="journalit-reviewv2-missed-setup-tags">
      {visibleSetups.map((setup) => {
        const isTruncated = setup.length > MAX_SETUP_LENGTH;
        const tag = (
          <span key={setup} className="journalit-reviewv2-missed-setup-tag">
            {truncateSetup(setup)}
          </span>
        );

        return isTruncated ? (
          <Tooltip
            key={setup}
            content={<SetupTooltipContent setup={setup} />}
            delay={0}
            preferredPosition="top"
          >
            {tag}
          </Tooltip>
        ) : (
          tag
        );
      })}
      {remainingCount > 0 && (
        <Tooltip
          content={
            <OverflowSetupsTooltip
              setups={overflowSetups}
              title={additionalSetupsLabel}
            />
          }
          delay={0}
          preferredPosition="top"
        >
          <span className="journalit-reviewv2-missed-setup-overflow">
            +{remainingCount}
          </span>
        </Tooltip>
      )}
    </div>
  );
};

const MissedTradeDetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="journalit-reviewv2-missed-detail-row">
    <span className="journalit-reviewv2-missed-detail-label">{label}</span>
    <span className="journalit-reviewv2-missed-detail-value">{value}</span>
  </div>
);

const MissedTradeSummaryRow: React.FC<{
  label: string;
  value: string | undefined;
}> = ({ label, value }) => {
  const summary = truncateSummary(value);
  if (!summary) return null;

  return (
    <div className="journalit-reviewv2-missed-summary-row">
      <span className="journalit-reviewv2-missed-summary-label">{label}</span>
      <span className="journalit-reviewv2-missed-summary-value">{summary}</span>
    </div>
  );
};

const formatEntryTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const getDirectionClass = (direction: string) => {
  const dir = direction.toLowerCase();
  if (dir === 'long' || dir === 'buy') {
    return 'journalit-reviewv2-missed-card--long';
  }
  if (dir === 'short' || dir === 'sell') {
    return 'journalit-reviewv2-missed-card--short';
  }
  return 'journalit-reviewv2-missed-card--neutral';
};

const getDirectionLabel = (direction: string): string => {
  const normalizedDirection = direction.toLowerCase();
  if (normalizedDirection === 'long' || normalizedDirection === 'buy') {
    return t('form.field.direction.long');
  }
  if (normalizedDirection === 'short' || normalizedDirection === 'sell') {
    return t('form.field.direction.short');
  }
  return direction;
};

const getDayName = (date: Date): string => {
  return DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1];
};

export const groupMissedTradesByDay = (
  trades: MissedTradeDisplayData[]
): Map<string, MissedTradeDisplayData[]> => {
  const grouped = new Map<string, MissedTradeDisplayData[]>();

  for (const day of DAYS_OF_WEEK) {
    grouped.set(day, []);
  }

  for (const trade of trades) {
    const dayName = getDayName(trade.entryTime);
    const dayTrades = grouped.get(dayName) || [];
    dayTrades.push(trade);
    grouped.set(dayName, dayTrades);
  }

  for (const day of DAYS_OF_WEEK) {
    if (grouped.get(day)?.length === 0) {
      grouped.delete(day);
    }
  }

  return grouped;
};

export const MissedTradesWidget: React.FC<MissedTradesWidgetProps> = memo(
  ({ filePath, plugin, config: _config, preview, previewData }) => {
    const [missedTrades, setMissedTrades] = useState<MissedTradeDisplayData[]>(
      []
    );
    const [loading, setLoading] = useState(true);
    const [isValidContext, setIsValidContext] = useState(true);
    const [noteType, setNoteType] = useState<'drc' | 'weekly-review' | null>(
      null
    );
    const [noteDate, setNoteDate] = useState<Date | null>(null);
    const retryCountRef = useRef(0);

    const loadMissedTrades = useCallback(async () => {
      if (preview && previewData) {
        setMissedTrades(previewData.missedTrades);
        setNoteType(previewData.noteType || 'drc');
        setLoading(false);
        setIsValidContext(true);
        return;
      }

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof TFile)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const cache = plugin.app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!frontmatter) {
        if (retryCountRef.current < MAX_FRONTMATTER_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => loadMissedTrades(), FRONTMATTER_RETRY_DELAY_MS);
          return;
        }
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      const type = frontmatter.type;
      if (!SUPPORTED_TYPES.includes(type)) {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      setNoteType(type as 'drc' | 'weekly-review');

      let startDate: Date;
      let endDate: Date;

      if (type === 'drc') {
        const drcDate = parseLocalDateSafe(frontmatter.date);
        if (!drcDate) {
          setIsValidContext(false);
          setLoading(false);
          return;
        }
        const tradingDay = getTradingDay(drcDate, plugin);
        setNoteDate(tradingDay);
        startDate = new Date(tradingDay);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(tradingDay);
        endDate.setHours(23, 59, 59, 999);
      } else if (type === 'weekly-review') {
        if (frontmatter.weekStart && frontmatter.weekEnd) {
          const parsedStart = parseLocalDateSafe(frontmatter.weekStart);
          const parsedEnd = parseLocalDateSafe(frontmatter.weekEnd);
          if (!parsedStart || !parsedEnd) {
            setIsValidContext(false);
            setLoading(false);
            return;
          }
          startDate = parsedStart;
          endDate = parsedEnd;
          endDate.setHours(23, 59, 59, 999);
          setNoteDate(startDate);
        } else {
          const weekDate = parseLocalDateSafe(frontmatter.date);
          if (!weekDate) {
            setIsValidContext(false);
            setLoading(false);
            return;
          }
          setNoteDate(weekDate);
          startDate = new Date(weekDate);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(weekDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          endDate.setHours(23, 59, 59, 999);
        }
      } else {
        setIsValidContext(false);
        setLoading(false);
        return;
      }

      try {
        const missedTradeService = plugin.serviceManager
          ? await plugin.serviceManager.getMissedTradeService()
          : plugin.missedTradeService;

        if (!missedTradeService) {
          console.warn(
            '[MissedTradesWidget] MissedTradeService not available yet'
          );
          setMissedTrades([]);
          setIsValidContext(true);
          setLoading(false);
          return;
        }

        const missedTradeFiles = await missedTradeService.getMissedTrades(
          startDate,
          endDate
        );

        const processedMissedTrades = missedTradeFiles
          .map((mtFile) => {
            const mtCache = plugin.app.metadataCache.getFileCache(mtFile);
            return buildMissedTradeDisplayData(
              mtCache?.frontmatter as MissedTradeFrontmatter | undefined,
              mtFile
            );
          })
          .filter((trade): trade is MissedTradeDisplayData => trade !== null)
          .sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());

        setMissedTrades(processedMissedTrades);
      } catch (error) {
        console.error(
          '[MissedTradesWidget] Error loading missed trades:',
          error
        );
        setMissedTrades([]);
      }

      setIsValidContext(true);
      setLoading(false);
    }, [filePath, plugin, preview, previewData]);

    useEffect(() => {
      retryCountRef.current = 0;
      loadMissedTrades();
    }, [loadMissedTrades]);

    const handleMissedTradeChanged = useCallback(() => {
      loadMissedTrades();
    }, [loadMissedTrades]);

    useEventBus('missed-trade:changed', handleMissedTradeChanged, !preview);

    const handleOpenMissedTrade = useCallback(
      (path: string) => {
        plugin.app.workspace.openLinkText(path, '', true);
      },
      [plugin]
    );

    const handleCreateMissedTrade = useCallback(async () => {
      if (!noteDate) {
        new Notice(t('widget.missed-trades.error-no-date'));
        return;
      }

      try {
        const initialData: Partial<TradeFormData> = {
          isMissedTrade: true,
          entryTime: noteDate,
        };

        try {
          const { TradeFormModal } =
            await import('../../forms/trade/TradeFormModal');
          const modal = new TradeFormModal({
            app: plugin.app,
            plugin: plugin,
            isEditMode: false,
            initialData,
          });
          modal.open();
        } catch {
          plugin.viewManager?.openTradeFormView(initialData);
        }
      } catch (error) {
        console.error('[MissedTradesWidget] Error opening trade form:', error);
        new Notice(t('widget.missed-trades.error-open-form'));
      }
    }, [plugin, noteDate]);

    if (loading) {
      return (
        <div className="journalit-reviewv2-card-wrapper">
          <div className="journalit-reviewv2-card journalit-reviewv2-card--centered journalit-reviewv2-card--compact">
            <div className="journalit-reviewv2-missed-header">
              <SkeletonBox width={100} height={14} borderRadius="4px" />
            </div>
            <div className="journalit-reviewv2-missed-list">
              {['first', 'second'].map((key) => (
                <div key={key} className="journalit-reviewv2-missed-card">
                  <div className="journalit-reviewv2-missed-card-meta">
                    <SkeletonBox width={120} height={14} borderRadius="4px" />
                    <SkeletonBox width={60} height={16} borderRadius="10px" />
                    <SkeletonBox width={56} height={16} borderRadius="10px" />
                  </div>
                  <div className="journalit-reviewv2-missed-details">
                    <SkeletonBox width={180} height={10} borderRadius="4px" />
                    <SkeletonBox width={140} height={10} borderRadius="4px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (!isValidContext) {
      return (
        <div className="journalit-reviewv2-empty">
          {t('widget.missed-trades.invalid-context')}
        </div>
      );
    }

    const renderMissedTradeCard = (trade: MissedTradeDisplayData) => {
      const directionClass = getDirectionClass(trade.direction);
      const accountLabel = trade.account.join(', ');

      return (
        <div
          key={trade.path}
          onClick={() => handleOpenMissedTrade(trade.path)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
              return;
            }

            event.preventDefault();
            handleOpenMissedTrade(trade.path);
          }}
          role="button"
          tabIndex={0}
          className={`journalit-reviewv2-missed-card ${directionClass}`}
        >
          <div className="journalit-reviewv2-missed-card-header">
            <div className="journalit-reviewv2-missed-card-meta">
              <div className="journalit-reviewv2-missed-card-meta-top-row">
                <div className="journalit-reviewv2-missed-card-meta-top">
                  <h4 className="journalit-reviewv2-missed-instrument">
                    {trade.instrument}
                  </h4>
                  <span className="journalit-reviewv2-missed-direction">
                    {getDirectionLabel(trade.direction)}
                  </span>
                  <span className="journalit-reviewv2-missed-time">
                    {formatEntryTime(trade.entryTime)}
                  </span>
                </div>
                {trade.reviewed && (
                  <div className="journalit-reviewv2-missed-statuses">
                    <span className="journalit-reviewv2-missed-reviewed-status">
                      <span
                        className="journalit-reviewv2-missed-reviewed-dot"
                        aria-hidden="true"
                      />
                      <span className="journalit-reviewv2-missed-reviewed-text">
                        {t('trade.review.reviewed')}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              {trade.setup.length > 0 && (
                <div className="journalit-reviewv2-missed-card-meta-bottom">
                  <MissedTradeSetupTags
                    setups={trade.setup}
                    additionalSetupsLabel={t(
                      'widget.missed-trades.additional-setups'
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {(accountLabel || trade.mistake.length > 0) && (
            <div className="journalit-reviewv2-missed-details">
              {accountLabel && (
                <MissedTradeDetailRow
                  label={t('trade.metadata.account')}
                  value={accountLabel}
                />
              )}
              {trade.mistake.length > 0 && (
                <MissedTradeDetailRow
                  label={t('trade.metadata.mistakes')}
                  value={trade.mistake.join(', ')}
                />
              )}
            </div>
          )}

          {(trade.missedReason || trade.thesis) && (
            <div className="journalit-reviewv2-missed-summary">
              <MissedTradeSummaryRow
                label={t('drc.missed-trades.label.reason')}
                value={trade.missedReason}
              />
              <MissedTradeSummaryRow
                label={t('trade.details.thesis')}
                value={trade.thesis}
              />
            </div>
          )}
        </div>
      );
    };

    const renderDaySection = (
      dayName: string,
      trades: MissedTradeDisplayData[]
    ) => (
      <div key={dayName} className="journalit-reviewv2-missed-day">
        <div className="journalit-reviewv2-missed-day-title">
          {t(`common.day.${dayName.toLowerCase()}` as TranslationKey)}
        </div>
        <div className="journalit-reviewv2-missed-day-list">
          {trades.map(renderMissedTradeCard)}
        </div>
      </div>
    );

    const emptyLabel =
      noteType === 'drc'
        ? t('widget.missed-trades.no-trades-today')
        : t('widget.missed-trades.no-trades-week');

    const groupedTrades =
      noteType === 'weekly-review'
        ? groupMissedTradesByDay(missedTrades)
        : null;

    return (
      <div className="journalit-reviewv2-card-wrapper">
        <div
          className={`journalit-reviewv2-card journalit-reviewv2-card--centered journalit-reviewv2-card--compact${
            missedTrades.length === 0
              ? ' journalit-reviewv2-missed-card-shell--empty'
              : ''
          }`}
        >
          <div className="journalit-reviewv2-missed-header">
            <span className="journalit-reviewv2-card-title journalit-reviewv2-card-title--uppercase">
              {t('widget.missed-trades.title')}{' '}
              {missedTrades.length > 0 && `(${missedTrades.length})`}
            </span>
            {missedTrades.length === 0 && (
              <span className="journalit-reviewv2-missed-empty-inline">
                <Ghost
                  size={14}
                  className="journalit-reviewv2-missed-empty-inline-icon"
                  aria-hidden="true"
                />
                {emptyLabel}
              </span>
            )}
            {!preview && noteType === 'drc' && (
              <button
                onClick={handleCreateMissedTrade}
                className="journalit-reviewv2-missed-add"
                aria-label={t('widget.missed-trades.add-aria')}
              >
                <Plus size={12} />
                {t('widget.missed-trades.add-button')}
              </button>
            )}
          </div>

          {missedTrades.length === 0 ? null : noteType === 'weekly-review' &&
            groupedTrades ? (
            <div>
              {DAYS_OF_WEEK.filter((day) => groupedTrades.has(day)).map((day) =>
                renderDaySection(day, groupedTrades.get(day) || [])
              )}
            </div>
          ) : (
            <div className="journalit-reviewv2-missed-list">
              {missedTrades.map(renderMissedTradeCard)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

MissedTradesWidget.displayName = 'MissedTradesWidget';

export {};
