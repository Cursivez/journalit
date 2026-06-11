

import React, {
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { TFile } from 'obsidian';
import { Users } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import {
  getEffectivePnL,
  getResolvedWeightedAverageExitPrice,
  getFirstEntryTime,
  getWeightedAverageEntryPrice,
  hasRealizedStoredPnL,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import { FullscreenPortal } from '../../image/FullscreenPortal';
import { FullscreenImageViewer } from '../../image/FullscreenImageViewer';
import { ExcalidrawMediaEmbed } from '../../image/ExcalidrawMediaEmbed';
import { Image } from '../../shared/icons/ObsidianIcon';
import { imageService } from '../../../services/image/ImageService';
import {
  isExcalidrawMediaPath,
  resolveMediaDisplayPath,
} from '../../../utils/imageMediaUtils';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { SetupsBadge, MistakesBadge } from '../../shared/badges';
import { SkeletonBox } from '../../shared';
import { Tooltip } from '../../shared/Tooltip';
import type { ImageNavigationContext } from '../../../types/image';
import { TradesPreviewData } from '../../../types/reviewV2';
import type { CachedReviewData } from '../../../services/reviewV2/ReviewDataCache';
import { useReviewTrades } from '../hooks/useReviewData';
import { t } from '../../../lang/helpers';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { calculateDirectionalPriceDiff } from '../../../utils/pnlCalculation';
import {
  getDistinctAccountNames,
  getTradeAccountNames,
} from './shared/accountDisplay';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { getReviewTradeDate } from '../utils/reviewTradeDates';

const calculateFallbackGrossPnL = (
  trade: CachedReviewData['trades'][number]
): number | null => {
  const entryPrice = getWeightedAverageEntryPrice(trade);
  const exitPrice = getResolvedWeightedAverageExitPrice(trade);

  if (entryPrice === null || exitPrice === null) {
    return null;
  }

  const positionSize = Number(trade.positionSize);
  if (!Number.isFinite(positionSize)) {
    return null;
  }

  const priceDiff = calculateDirectionalPriceDiff(
    { assetType: trade.assetType, direction: trade.direction },
    entryPrice,
    exitPrice
  );

  return priceDiff === null ? null : priceDiff * positionSize;
};

const AccountsTooltipContent = React.memo<{ accounts: string[] }>(
  ({ accounts }) => (
    <div className="accounts-tooltip">
      {accounts.map((account) => (
        <div key={account} className="tooltip-item">
          • {account}
        </div>
      ))}
    </div>
  )
);

AccountsTooltipContent.displayName = 'AccountsTooltipContent';

const SingleAccountCell = React.memo<{ account: string }>(({ account }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return undefined;

    const updateTruncation = () => {
      const cell = node.closest('td');
      const cellRect = cell?.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const range = node.ownerDocument.createRange();
      range.selectNodeContents(node);
      const contentWidth = range.getBoundingClientRect().width;
      range.detach();
      const computedStyle =
        node.ownerDocument.defaultView?.getComputedStyle(node);
      const horizontalPadding = computedStyle
        ? parseFloat(computedStyle.paddingLeft || '0') +
          parseFloat(computedStyle.paddingRight || '0')
        : 0;
      const fullPillWidth = contentWidth + horizontalPadding;
      const availableCellWidth = cell ? cell.clientWidth : node.clientWidth;

      setIsTruncated(
        node.scrollWidth > node.clientWidth + 1 ||
          fullPillWidth > node.clientWidth + 1 ||
          fullPillWidth > availableCellWidth + 1 ||
          (cellRect ? nodeRect.right > cellRect.right + 1 : false)
      );
    };

    updateTruncation();

    const ResizeObserverCtor = node.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverCtor) return undefined;

    const observer = new ResizeObserverCtor(updateTruncation);
    observer.observe(node);
    const cell = node.closest('td');
    if (cell) observer.observe(cell);
    return () => observer.disconnect();
  }, [account]);

  const accountText = (
    <span ref={textRef} className="trade-account-text">
      {account}
    </span>
  );

  return (
    <Tooltip
      content={account}
      delay={0}
      disabled={!isTruncated}
      preferredPosition="top"
      className="journalit-reviewv2-compact-value-tooltip"
      triggerClassName="journalit-reviewv2-account-tooltip-trigger"
    >
      {accountText}
    </Tooltip>
  );
});

SingleAccountCell.displayName = 'SingleAccountCell';

const TruncatedValueTooltip = React.memo<{
  value: string;
  className?: string;
  tooltipClassName?: string;
}>(({ value, className = '', tooltipClassName = '' }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) return undefined;

    const updateTruncation = () => {
      setIsTruncated(node.scrollWidth > node.clientWidth + 1);
    };

    updateTruncation();

    const ResizeObserverCtor = node.ownerDocument.defaultView?.ResizeObserver;
    if (!ResizeObserverCtor) return undefined;

    const observer = new ResizeObserverCtor(updateTruncation);
    observer.observe(node);
    const cell = node.closest('td');
    if (cell) observer.observe(cell);
    return () => observer.disconnect();
  }, [value]);

  return (
    <Tooltip
      content={value}
      delay={0}
      disabled={!isTruncated}
      instantHide={true}
      preferredPosition="top"
      className={tooltipClassName}
      triggerClassName="journalit-reviewv2-truncated-value-trigger"
    >
      <span ref={textRef} className={className}>
        {value}
      </span>
    </Tooltip>
  );
});

TruncatedValueTooltip.displayName = 'TruncatedValueTooltip';

const isDrcReviewType = (type: unknown): boolean => type === 'drc';

interface TradeTableWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: TradeTableWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
  tradesOverride?: CachedReviewData['trades'];
  loadingOverride?: boolean;
  emptyMessage?: string;
}

export interface TradeTableWidgetConfig {
  columns?: {
    images?: boolean;
    time?: boolean;
    ticker?: boolean;
    direction?: boolean;
    setup?: boolean;
    mistakes?: boolean;
    pnl?: boolean;
    rMultiple?: boolean;
    account?: boolean;
  };
  showOpenTrades?: boolean;
  pageSize?: number; 
}

const DEFAULT_CONFIG: TradeTableWidgetConfig = {
  columns: {
    images: true,
    time: true,
    ticker: true,
    direction: true,
    setup: true,
    mistakes: true,
    pnl: true,
    rMultiple: false,
    account: true,
  },
  showOpenTrades: true,
  pageSize: 20, 
};

export const TradeTableWidget: React.FC<TradeTableWidgetProps> = React.memo(
  ({
    filePath,
    plugin,
    config = {},
    preview = false,
    previewData,
    tradesOverride,
    loadingOverride,
    emptyMessage,
  }) => {
    const mergedConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      columns: { ...DEFAULT_CONFIG.columns, ...config?.columns },
    };

    const { currency } = useCurrency();
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const tradeDateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const applyAccountCountMultiplier = false;
    const breakEvenSettings = plugin?.settings?.trade;

    
    const {
      trades: cachedTrades,
      loading: cacheLoading,
      noteType: cachedNoteType,
    } = useReviewTrades(filePath, plugin);

    const noteFrontmatter = useMemo(() => {
      if (previewData?.noteType || cachedNoteType || !plugin.app) return null;

      const file = plugin.app.vault.getAbstractFileByPath(filePath);
      return file instanceof TFile
        ? plugin.app.metadataCache.getFileCache(file)?.frontmatter
        : null;
    }, [cachedNoteType, filePath, plugin.app, previewData?.noteType]);
    const effectiveNoteType =
      previewData?.noteType ?? cachedNoteType ?? noteFrontmatter?.type;
    const shouldShowEntryTime = effectiveNoteType
      ? isDrcReviewType(effectiveNoteType)
      : true;

    
    const trades =
      tradesOverride !== undefined
        ? tradesOverride
        : preview && previewData
          ? previewData.trades
          : cachedTrades;
    const loading =
      loadingOverride !== undefined
        ? loadingOverride
        : preview
          ? false
          : cacheLoading;

    
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [currentTradeImages, setCurrentTradeImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentTradeId, setCurrentTradeId] = useState<string | number>('');
    const [currentTradeSourcePath, setCurrentTradeSourcePath] = useState('');

    
    const openNote = useCallback(
      (path: string) => {
        plugin.openFile(path, false);
      },
      [plugin]
    );

    
    const handleImageClick = useCallback(
      (
        imagePath: string,
        tradeId: string | number,
        tradeImages: string[],
        sourcePath: string
      ): void => {
        const imageIndex = tradeImages.indexOf(imagePath);
        setCurrentTradeImages(tradeImages);
        setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
        setCurrentTradeId(tradeId);
        setCurrentTradeSourcePath(sourcePath);
        setIsFullscreenOpen(true);
      },
      []
    );

    
    const closeFullscreen = useCallback(() => {
      setIsFullscreenOpen(false);
    }, []);

    
    const handleImageNavigate = useCallback(
      (index: number) => {
        if (index >= 0 && index < currentTradeImages.length) {
          setCurrentImageIndex(index);
        }
      },
      [currentTradeImages.length]
    );

    
    const navigationContext: ImageNavigationContext | undefined =
      useMemo(() => {
        if (currentTradeImages.length <= 1) return undefined;

        return {
          images: currentTradeImages,
          currentIndex: currentImageIndex,
          onNavigate: handleImageNavigate,
          altPrefix: `Trade ${currentTradeId} Image`,
          useResolveMediaPath: true,
          sourcePath: currentTradeSourcePath,
        };
      }, [
        currentTradeImages,
        currentImageIndex,
        handleImageNavigate,
        currentTradeId,
        currentTradeSourcePath,
      ]);

    
    const displayTrades = useMemo(() => {
      if (mergedConfig.showOpenTrades) {
        return trades;
      }

      return trades.filter(
        (trade) =>
          !isTradeOpenWithContext({
            tradeStatus: trade.tradeStatus,
            exitTime: trade.exitTime,
            pnl: trade._originalPnlWasNull ? null : trade.pnl,
            useDirectPnLInput: trade.useDirectPnLInput,
            exits: trade.exits,
            entries: trade.entries,
          })
      );
    }, [trades, mergedConfig.showOpenTrades]);

    
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = mergedConfig.pageSize || 20;
    const totalTrades = displayTrades.length;
    const totalPages = pageSize > 0 ? Math.ceil(totalTrades / pageSize) : 1;
    const isPaginated = pageSize > 0 && totalTrades > pageSize;
    const effectiveCurrentPage = Math.min(
      currentPage,
      Math.max(0, totalPages - 1)
    );
    const paginationCurrentPage = String(effectiveCurrentPage + 1).padStart(
      String(totalPages).length,
      '0'
    );
    const paginationStart = String(
      effectiveCurrentPage * pageSize + 1
    ).padStart(String(totalTrades).length, '0');
    const paginationEnd = String(
      Math.min((effectiveCurrentPage + 1) * pageSize, totalTrades)
    ).padStart(String(totalTrades).length, '0');

    
    const sortedTrades = useMemo(() => {
      return [...displayTrades].sort(
        (a, b) =>
          new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
      );
    }, [displayTrades]);

    const paginatedTrades = useMemo(() => {
      if (!isPaginated) return sortedTrades;
      const start = effectiveCurrentPage * pageSize;
      return sortedTrades.slice(start, start + pageSize);
    }, [sortedTrades, effectiveCurrentPage, pageSize, isPaginated]);

    const showAccountColumn = useMemo(() => {
      if (mergedConfig.columns?.account === false) return false;

      const distinctNamedAccounts = getDistinctAccountNames(displayTrades);
      if (distinctNamedAccounts.length > 1) return true;

      return (
        distinctNamedAccounts.length === 1 &&
        displayTrades.some((trade) => getTradeAccountNames(trade).length === 0)
      );
    }, [displayTrades, mergedConfig.columns?.account]);

    
    const goToPrevPage = useCallback(() => {
      setCurrentPage(Math.max(0, effectiveCurrentPage - 1));
    }, [effectiveCurrentPage]);

    const goToNextPage = useCallback(() => {
      setCurrentPage(Math.min(totalPages - 1, effectiveCurrentPage + 1));
    }, [effectiveCurrentPage, totalPages]);

    if (loading) {
      const { columns } = mergedConfig;
      const rowCount = 5; 
      return (
        <div className="weekly-review-trades-table journalit-reviewv2-table-wrapper">
          <table className="journalit-reviewv2-table">
            <thead>
              <tr>
                {columns?.images && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-images">
                    {t('widget.trade-table.column.images')}
                  </th>
                )}
                {columns?.time && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-time">
                    {shouldShowEntryTime
                      ? t('widget.trade-table.column.entry')
                      : t('widget.trade-table.column.date')}
                  </th>
                )}
                {showAccountColumn && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-account">
                    {t('widget.trade-table.column.account')}
                  </th>
                )}
                {columns?.ticker && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-ticker">
                    {t('widget.trade-table.column.ticker')}
                  </th>
                )}
                {columns?.pnl && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                    {t('widget.trade-table.column.pnl')}
                  </th>
                )}
                {columns?.direction && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-direction">
                    {t('widget.trade-table.column.direction')}
                  </th>
                )}
                {columns?.setup && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-setup">
                    {t('widget.trade-table.column.setups')}
                  </th>
                )}
                {columns?.mistakes && (
                  <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-mistakes">
                    {t('widget.trade-table.column.mistakes')}
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
                  {columns?.images && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-images">
                      <SkeletonBox width={48} height={36} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.time && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-time">
                      <div className="journalit-reviewv2-skeleton-time">
                        <SkeletonBox
                          width={45}
                          height={14}
                          borderRadius="4px"
                        />
                        <SkeletonBox
                          width={35}
                          height={10}
                          borderRadius="4px"
                        />
                      </div>
                    </td>
                  )}
                  {showAccountColumn && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-account">
                      <SkeletonBox width={70} height={18} borderRadius="9px" />
                    </td>
                  )}
                  {columns?.ticker && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-ticker">
                      <SkeletonBox width={50} height={16} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.pnl && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-pnl">
                      <SkeletonBox width={60} height={16} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.direction && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-direction">
                      <SkeletonBox width={45} height={14} borderRadius="4px" />
                    </td>
                  )}
                  {columns?.setup && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-setup">
                      <div className="journalit-reviewv2-skeleton-tags">
                        <SkeletonBox
                          width={50}
                          height={20}
                          borderRadius="10px"
                        />
                        {i % 2 === 0 && (
                          <SkeletonBox
                            width={40}
                            height={20}
                            borderRadius="10px"
                          />
                        )}
                      </div>
                    </td>
                  )}
                  {columns?.mistakes && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-mistakes">
                      {i % 3 === 0 && (
                        <SkeletonBox
                          width={55}
                          height={20}
                          borderRadius="10px"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (displayTrades.length === 0) {
      return (
        <div className="journalit-reviewv2-empty">
          {emptyMessage || t('widget.trade-table.empty')}
        </div>
      );
    }

    const { columns } = mergedConfig;

    
    const formatDuration = (entryTime: Date, exitTime: Date): string => {
      const diffMs = exitTime.getTime() - entryTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        const remainingHours = diffHours % 24;
        return t('widget.trade-table.duration.days-hours', {
          days: String(diffDays),
          hours: String(remainingHours),
        });
      } else if (diffHours > 0) {
        const remainingMins = diffMins % 60;
        return t('widget.trade-table.duration.hours-mins', {
          hours: String(diffHours),
          mins: String(remainingMins),
        });
      } else {
        return t('widget.trade-table.duration.mins', {
          mins: String(diffMins),
        });
      }
    };

    
    const formatEntryTime = (date: Date): string => {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    };

    return (
      <div className="weekly-review-trades-table journalit-reviewv2-table-wrapper">
        <table className="journalit-reviewv2-table">
          <thead>
            <tr>
              {columns?.images && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-images">
                  {t('widget.trade-table.column.images')}
                </th>
              )}
              {columns?.time && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-time">
                  {shouldShowEntryTime
                    ? t('widget.trade-table.column.entry')
                    : t('widget.trade-table.column.date')}
                </th>
              )}
              {showAccountColumn && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-account">
                  {t('widget.trade-table.column.account')}
                </th>
              )}
              {columns?.ticker && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-ticker">
                  {t('widget.trade-table.column.ticker')}
                </th>
              )}
              {columns?.pnl && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-pnl">
                  {t('widget.trade-table.column.pnl')}
                </th>
              )}
              {columns?.direction && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-direction">
                  {t('widget.trade-table.column.direction')}
                </th>
              )}
              {columns?.setup && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-setup">
                  {t('widget.trade-table.column.setups')}
                </th>
              )}
              {columns?.mistakes && (
                <th className="journalit-reviewv2-table-header-cell journalit-reviewv2-col-mistakes">
                  {t('widget.trade-table.column.mistakes')}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.map((trade, index) => {
              const tradeId = trade.id || `index-${index}`;

              
              const isOpen = isTradeOpenWithContext({
                tradeStatus: trade.tradeStatus,
                exitTime: trade.exitTime,
                pnl: trade._originalPnlWasNull ? null : trade.pnl,
                useDirectPnLInput: trade.useDirectPnLInput,
                exits: trade.exits,
                entries: trade.entries,
              });

              let pnl: number | null = null;
              let displayPnL: number | null = null;
              let effectiveR: number | undefined = undefined;
              const hasStoredPnL = hasRealizedStoredPnL(trade);
              const rawPnL = hasStoredPnL
                ? getEffectivePnL(trade)
                : !isOpen
                  ? calculateFallbackGrossPnL(trade)
                  : null;

              if (rawPnL !== null) {
                const accountCount = getAccountCount(trade);
                displayPnL = getDisplayPnL(
                  rawPnL,
                  accountCount,
                  applyAccountCountMultiplier
                );
                pnl = displayPnL;

                effectiveR = calculateEffectiveRMultiple(
                  rawPnL,
                  isOpen ? undefined : trade.rMultiple,
                  trade.riskAmount,
                  defaultRiskAmount
                );
              }

              
              const breakEvenBalanceForDisplay = applyAccountCountMultiplier
                ? ((trade as Record<string, unknown>)
                    .breakEvenAccountCurrentBalanceTotal ??
                  (trade as Record<string, unknown>)
                    .breakEvenAccountCurrentBalance)
                : (trade as Record<string, unknown>)
                    .breakEvenAccountCurrentBalance;

              const outcome =
                pnl === null
                  ? null
                  : classifyPnLWithBreakEvenSettings(
                      pnl,
                      breakEvenSettings,
                      typeof breakEvenBalanceForDisplay === 'number'
                        ? breakEvenBalanceForDisplay
                        : undefined
                    );
              const isProfitable = outcome === 'win';
              const isLoss = outcome === 'loss';
              const pnlStateClass =
                isOpen || isPnlMasked
                  ? ''
                  : isProfitable
                    ? 'journalit-reviewv2-table-cell--positive'
                    : isLoss
                      ? 'journalit-reviewv2-table-cell--negative'
                      : 'journalit-reviewv2-table-cell--muted';
              const pnlCellClassName = [
                'journalit-reviewv2-table-cell',
                'journalit-reviewv2-col-pnl',
                !isOpen ? 'journalit-reviewv2-table-cell--emphasis' : '',
                pnlStateClass,
              ]
                .filter(Boolean)
                .join(' ');

              
              let imagesArray: string[] = [];
              try {
                if (trade.images) {
                  if (Array.isArray(trade.images)) {
                    imagesArray = trade.images;
                  } else if (typeof trade.images === 'string') {
                    
                    const parsedImages = JSON.parse(trade.images);
                    
                    if (Array.isArray(parsedImages)) {
                      imagesArray = parsedImages.map((img) => String(img));
                    }
                  }
                }
              } catch {
                // intentional
              }

              const rowClassName = [
                'weekly-review-trade-row',
                'journalit-reviewv2-table-row',
                !preview && trade.path
                  ? 'journalit-reviewv2-table-row--interactive'
                  : 'journalit-reviewv2-table-row--static',
              ]
                .filter(Boolean)
                .join(' ');
              const accountNames = getTradeAccountNames(trade);
              const resolvedEntryTime = getFirstEntryTime({
                entries: trade.entries,
                entryTime: trade.entryTime,
              });
              const reviewDate = getReviewTradeDate(trade, plugin);
              const entryDisplay = shouldShowEntryTime
                ? isOpen
                  ? t('widget.trade-table.status.open')
                  : resolvedEntryTime && trade.exitTime
                    ? `${formatEntryTime(resolvedEntryTime)} (${formatDuration(
                        resolvedEntryTime,
                        new Date(trade.exitTime)
                      )})`
                    : resolvedEntryTime
                      ? formatEntryTime(resolvedEntryTime)
                      : t('widget.trade-table.na')
                : reviewDate
                  ? formatDateDisplay(reviewDate, tradeDateFormat, '/')
                  : t('widget.trade-table.na');

              return (
                <tr
                  key={`trade-${tradeId}`}
                  className={rowClassName}
                  onClick={
                    !preview
                      ? () => {
                          if (trade.path) {
                            openNote(trade.path);
                          }
                        }
                      : undefined
                  }
                >
                  {columns?.images && (
                    <td className="journalit-reviewv2-trade-preview-cell journalit-reviewv2-table-cell journalit-reviewv2-col-images">
                      {imagesArray.length > 0 ? (
                        <div
                          className="journalit-reviewv2-trade-image-wrapper"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleImageClick(
                              imagesArray[0],
                              trade.id || index,
                              imagesArray,
                              trade.path || filePath
                            );
                          }}
                          onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') {
                              return;
                            }

                            event.preventDefault();
                            event.stopPropagation();
                            handleImageClick(
                              imagesArray[0],
                              trade.id || index,
                              imagesArray,
                              trade.path || filePath
                            );
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="journalit-reviewv2-trade-preview-thumbnail">
                            {isExcalidrawMediaPath(
                              plugin.app,
                              imagesArray[0],
                              trade.path || filePath
                            ) ? (
                              <ExcalidrawMediaEmbed
                                path={imagesArray[0]}
                                sourcePath={trade.path || filePath}
                              />
                            ) : (
                              <img
                                src={imageService.resolveMediaPath(
                                  resolveMediaDisplayPath(
                                    plugin.app,
                                    imagesArray[0],
                                    trade.path || filePath
                                  )
                                )}
                                alt={t('widget.trade-table.image-alt', {
                                  id: String(trade.id || index),
                                })}
                                className="trade-image journalit-reviewv2-trade-image"
                                onError={() => {
                                  // intentional
                                }}
                              />
                            )}
                          </div>
                          {imagesArray.length > 1 && (
                            <span className="journalit-reviewv2-trade-image-count-indicator">
                              +{imagesArray.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Image
                          size={24}
                          className="journalit-reviewv2-trade-no-image-icon"
                        />
                      )}
                    </td>
                  )}
                  {columns?.time && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-time">
                      <TruncatedValueTooltip
                        value={entryDisplay}
                        tooltipClassName="journalit-reviewv2-entry-tooltip"
                        className={
                          isOpen
                            ? 'journalit-reviewv2-entry-text journalit-reviewv2-text-muted'
                            : 'journalit-reviewv2-entry-text'
                        }
                      />
                    </td>
                  )}
                  {showAccountColumn && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-account">
                      <div className="trade-account-cell journalit-reviewv2-account-cell">
                        {accountNames.length === 0 ? (
                          <span className="trade-no-data">-</span>
                        ) : accountNames.length === 1 ? (
                          <SingleAccountCell account={accountNames[0]} />
                        ) : (
                          <Tooltip
                            content={
                              <AccountsTooltipContent accounts={accountNames} />
                            }
                            delay={0}
                            preferredPosition="top"
                          >
                            <div className="trade-account-icon-wrapper">
                              <Users size={20} className="trade-account-icon" />
                              <span className="trade-account-count-badge">
                                {accountNames.length}
                              </span>
                            </div>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  )}
                  {columns?.ticker && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-ticker">
                      <span className="journalit-reviewv2-font-semibold">
                        {trade.instrument ||
                          trade.ticker ||
                          t('widget.trade-table.unknown')}
                      </span>
                    </td>
                  )}
                  {columns?.pnl && (
                    <td className={pnlCellClassName}>
                      {isOpen && pnl === null
                        ? '-'
                        : formatValue({
                            kind: 'pnl',
                            value: pnl,
                            currencyCode: trade.currency || currency,
                            rMultiple: effectiveR,
                          })}
                    </td>
                  )}
                  {columns?.direction && (
                    <td className="journalit-reviewv2-table-cell journalit-reviewv2-col-direction">
                      <span className="journalit-reviewv2-text-uppercase">
                        {trade.assetType === 'options' && trade.optionType
                          ? trade.optionType
                          : trade.direction ||
                            trade.side ||
                            t('widget.trade-table.na')}
                      </span>
                    </td>
                  )}
                  {columns?.setup && (
                    <td className="widget-trade-setups-cell journalit-reviewv2-table-cell journalit-reviewv2-col-setup">
                      <SetupsBadge items={trade.setup} />
                    </td>
                  )}
                  {columns?.mistakes && (
                    <td className="widget-trade-mistakes-cell journalit-reviewv2-table-cell journalit-reviewv2-col-mistakes">
                      <MistakesBadge items={trade.mistake} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        
        {isPaginated && (
          <div className="journalit-reviewv2-pagination">
            <span className="journalit-reviewv2-pagination-showing">
              {t('widget.trade-table.pagination.showing', {
                start: paginationStart,
                end: paginationEnd,
                total: String(totalTrades),
              })}
            </span>
            <div className="journalit-reviewv2-pagination-controls">
              <button
                onClick={goToPrevPage}
                disabled={effectiveCurrentPage === 0}
                className="journalit-reviewv2-pagination-button"
              >
                {t('widget.trade-table.pagination.prev')}
              </button>
              <span className="journalit-reviewv2-pagination-status">
                {t('widget.trade-table.pagination.page', {
                  current: paginationCurrentPage,
                  total: String(totalPages),
                })}
              </span>
              <button
                onClick={goToNextPage}
                disabled={effectiveCurrentPage >= totalPages - 1}
                className="journalit-reviewv2-pagination-button"
              >
                {t('widget.trade-table.pagination.next')}
              </button>
            </div>
          </div>
        )}

        
        {isFullscreenOpen && currentTradeImages.length > 0 && (
          <FullscreenPortal
            isOpen={isFullscreenOpen}
            onClose={closeFullscreen}
            title={t('widget.trade-table.fullscreen-title', {
              id: String(currentTradeId),
            })}
            portalId="trade-table-widget-image-portal"
          >
            <FullscreenImageViewer
              imagePath={currentTradeImages[currentImageIndex]}
              alt={t('widget.trade-table.fullscreen-alt', {
                id: String(currentTradeId),
                index: String(currentImageIndex + 1),
              })}
              useResolveMediaPath={true}
              sourcePath={currentTradeSourcePath}
              navigationContext={navigationContext}
              onClose={closeFullscreen}
            />
          </FullscreenPortal>
        )}
      </div>
    );
  }
);

TradeTableWidget.displayName = 'TradeTableWidget';

export {};
