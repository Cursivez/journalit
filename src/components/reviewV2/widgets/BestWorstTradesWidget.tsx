

import React, { useMemo } from 'react';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import { calculateEffectiveRMultiple } from '../../../utils/formatting';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { CurrencyCode } from '../../../utils/currencyConfig';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../../utils/tradeStatusUtils';
import { getDisplayPnL, getAccountCount } from '../../../utils/pnlUtils';
import { formatDateDisplay } from '../../../utils/dateUtils';
import { TradesPreviewData } from '../../../types/reviewV2';
import { useReviewTrades } from '../hooks/useReviewData';
import { SkeletonBox } from '../../shared';
import { CurrencyConversionInfo } from '../../shared/display/CurrencyConversionInfo';
import { getBreakEvenBalanceForDisplayTrade } from './shared/breakEvenDisplayUtils';
import { splitReviewTradeByRealizedPnlEvent } from '../utils/reviewTradeDates';

interface TradeWithDisplay extends Record<string, unknown> {
  path: string;
  entryTime: string;
  exitTime?: string;
  instrument?: string;
  direction?: string;
  setup?: string | string[];
  mistake?: string[];
  currency?: CurrencyCode;
  pnl?: number | null;
  directPnL?: number | null;
  useDirectPnLInput?: boolean;
  dividends?: Array<{ amount?: number | null }>;
  commission?: number | null;
  swap?: number | null;
  fees?: number | null;
  rebate?: number | null;
  rMultiple?: number;
  riskAmount?: number;
  breakEvenAccountCurrentBalance?: number;
  breakEvenAccountCurrentBalanceTotal?: number;
  originalPnlBeforeConversion?: number | null;
  displayPnL?: number;
  status?: string;
  account?: string | string[];
}

const asBestWorstTrades = (value: unknown): TradeWithDisplay[] =>
  Array.isArray(value)
    ? value.filter((item): item is TradeWithDisplay =>
        Boolean(item && typeof item === 'object' && !Array.isArray(item))
      )
    : [];

interface BestWorstTradesWidgetProps {
  filePath: string;
  plugin: JournalitPlugin;
  config?: BestWorstTradesWidgetConfig;
  preview?: boolean;
  previewData?: TradesPreviewData;
}

interface BestWorstTradesWidgetConfig {
  showBest?: boolean; 
  showWorst?: boolean; 
  showDuration?: boolean; 
  showSetups?: boolean; 
  showMistakes?: boolean; 
}

const DEFAULT_CONFIG: BestWorstTradesWidgetConfig = {
  showBest: true,
  showWorst: true,
  showDuration: true,
  showSetups: true,
  showMistakes: true,
};


const calculateDuration = (entryTime: string, exitTime: string): string => {
  try {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diffMs = exit.getTime() - entry.getTime();

    if (diffMs < 0) return t('common.na');

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch {
    return t('common.na');
  }
};

export const BestWorstTradesWidget: React.FC<BestWorstTradesWidgetProps> =
  React.memo(({ filePath, plugin, config = {}, preview, previewData }) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    
    const {
      trades: cachedTrades,
      loading: cacheLoading,
      currencyConversion,
    } = useReviewTrades(filePath, plugin);

    
    const trades = asBestWorstTrades(
      preview && previewData ? previewData.trades : cachedTrades
    );
    const loading = preview ? false : cacheLoading;

    
    const applyAccountCountMultiplier = false;

    
    const { bestTrade, worstTrade } = useMemo(() => {
      const closedTrades = asBestWorstTrades(
        trades.flatMap((trade) =>
          isPnlContributingTrade(trade)
            ? preview
              ? [trade]
              : splitReviewTradeByRealizedPnlEvent(trade, plugin)
            : []
        )
      );

      
      const tradesWithDisplayPnL = closedTrades.map((t) => {
        const accountCount = getAccountCount(t);
        const displayPnL = getDisplayPnL(
          getEffectivePnL(t),
          accountCount,
          applyAccountCountMultiplier
        );
        const breakEvenBalanceForDisplay = getBreakEvenBalanceForDisplayTrade(
          t,
          applyAccountCountMultiplier
        );
        const status = classifyPnLWithBreakEvenSettings(
          displayPnL,
          plugin?.settings?.trade,
          breakEvenBalanceForDisplay
        );
        const originalPnlForDisplay =
          typeof t.originalPnlBeforeConversion === 'number'
            ? getDisplayPnL(
                t.originalPnlBeforeConversion,
                accountCount,
                applyAccountCountMultiplier
              )
            : t.originalPnlBeforeConversion;
        return {
          ...t,
          pnl: displayPnL,
          originalPnlBeforeConversion: originalPnlForDisplay,
          displayPnL,
          status,
        };
      });

      
      const winningTrades = tradesWithDisplayPnL.filter(
        (t) => t.status === 'win'
      );
      const losingTrades = tradesWithDisplayPnL.filter(
        (t) => t.status === 'loss'
      );

      const best =
        winningTrades.length > 0
          ? winningTrades.reduce((a, b) =>
              a.displayPnL > b.displayPnL ? a : b
            )
          : null;

      const worst =
        losingTrades.length > 0
          ? losingTrades.reduce((a, b) => (a.displayPnL < b.displayPnL ? a : b))
          : null;

      return {
        bestTrade: best,
        worstTrade: worst,
      };
    }, [trades, applyAccountCountMultiplier, plugin, preview]);

    const openNote = async (path: string) => {
      
      if (preview) return;

      try {
        
        await plugin.openFile(path, false);
      } catch (error) {
        console.error('[BestWorstTradesWidget] Error opening note:', error);
      }
    };

    const currency = plugin?.settings?.general?.currency || CurrencyCode.USD;
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const userDateFormat = plugin?.settings?.trade?.dateFormat || 'DDMMYY';

    const showBoth = Boolean(mergedConfig.showBest && mergedConfig.showWorst);
    const gridClassName = [
      'journalit-reviewv2-bestworst-grid',
      showBoth
        ? 'journalit-reviewv2-bestworst-grid--both'
        : 'journalit-reviewv2-bestworst-grid--single',
    ]
      .filter(Boolean)
      .join(' ');

    const renderSkeletonCard = (isPositive: boolean, title: string) => (
      <div className="journalit-u-flex-col journalit-u-h-full journalit-reviewv2-bestworst-wrapper">
        <div className="journalit-reviewv2-bestworst-label">{title}</div>
        <div
          className={[
            'journalit-u-flex-1',
            'journalit-reviewv2-bestworst-card',
            isPnlMasked
              ? ''
              : isPositive
                ? 'journalit-reviewv2-bestworst-card--positive'
                : 'journalit-reviewv2-bestworst-card--negative',
            'journalit-reviewv2-bestworst-card--preview',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="journalit-reviewv2-bestworst-pnl-col">
            <SkeletonBox width={70} height={20} borderRadius="4px" />
            <div className="journalit-u-mt-4">
              <SkeletonBox width={50} height={12} borderRadius="4px" />
            </div>
            <div className="journalit-u-mt-4">
              <SkeletonBox width={35} height={10} borderRadius="4px" />
            </div>
          </div>
          <div className="journalit-reviewv2-bestworst-details">
            <div className="journalit-reviewv2-bestworst-primary-row">
              <SkeletonBox width={60} height={16} borderRadius="4px" />
              <SkeletonBox width={35} height={12} borderRadius="4px" />
            </div>
            <div className="journalit-reviewv2-bestworst-chips journalit-reviewv2-bestworst-chip-row">
              <SkeletonBox width={50} height={18} borderRadius="10px" />
              <SkeletonBox width={40} height={18} borderRadius="10px" />
            </div>
            <div className="journalit-reviewv2-bestworst-chips journalit-reviewv2-bestworst-chip-row">
              <SkeletonBox width={55} height={18} borderRadius="10px" />
            </div>
          </div>
        </div>
      </div>
    );

    const renderTradeCard = (
      trade: TradeWithDisplay | null,
      isBest: boolean,
      title: string
    ) => {
      if (!trade) {
        return (
          <div className="journalit-u-flex-col journalit-u-h-full journalit-reviewv2-bestworst-wrapper">
            <div className="journalit-reviewv2-bestworst-label">{title}</div>
            <div className="journalit-reviewv2-bestworst-empty-card journalit-u-flex-1">
              {isBest
                ? t('widget.best-worst.no-win-trades')
                : t('widget.best-worst.no-loss-trades')}
            </div>
          </div>
        );
      }

      const rMultiple = calculateEffectiveRMultiple(
        getEffectivePnL(trade),
        trade.rMultiple,
        trade.riskAmount,
        defaultRiskAmount
      );

      const direction = trade.direction?.toLowerCase();
      const directionDisplay =
        direction === 'long'
          ? t('form.field.direction.long')
          : direction === 'short'
            ? t('form.field.direction.short')
            : trade.direction;

      const setupArray = trade.setup
        ? Array.isArray(trade.setup)
          ? trade.setup
          : [trade.setup]
        : [];

      const mistakes = trade.mistake || [];

      
      const MAX_SETUP_CHIPS = 2;
      const visibleSetups = setupArray.slice(0, MAX_SETUP_CHIPS);
      const setupOverflowCount = setupArray.length - MAX_SETUP_CHIPS;

      
      const MAX_MISTAKE_CHIPS = 2;
      const visibleMistakes = mistakes.slice(0, MAX_MISTAKE_CHIPS);
      const mistakeOverflowCount = mistakes.length - MAX_MISTAKE_CHIPS;

      const cardClassName = [
        'journalit-u-flex-1',
        'journalit-reviewv2-bestworst-card',
        isPnlMasked
          ? ''
          : isBest
            ? 'journalit-reviewv2-bestworst-card--positive'
            : 'journalit-reviewv2-bestworst-card--negative',
        preview
          ? 'journalit-reviewv2-bestworst-card--preview'
          : 'journalit-reviewv2-bestworst-card--interactive',
      ]
        .filter(Boolean)
        .join(' ');

      const handleKeyDown = preview
        ? undefined
        : (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              void openNote(trade.path);
            }
          };

      return (
        <div className="journalit-u-flex-col journalit-u-h-full journalit-reviewv2-bestworst-wrapper">
          <div className="journalit-reviewv2-bestworst-label">
            {title}
            <CurrencyConversionInfo
              metadata={currencyConversion}
              trades={[trade]}
            />
          </div>
          <div
            className={cardClassName}
            role="button"
            tabIndex={preview ? -1 : 0}
            onClick={() => void openNote(trade.path)}
            onKeyDown={handleKeyDown}
          >
            <div className="journalit-reviewv2-bestworst-pnl-col">
              <div
                className={[
                  'journalit-reviewv2-bestworst-pnl',
                  isPnlMasked
                    ? ''
                    : isBest
                      ? 'journalit-reviewv2-bestworst-pnl--positive'
                      : 'journalit-reviewv2-bestworst-pnl--negative',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {formatValue({
                  kind: 'pnl',
                  value: trade.displayPnL ?? getEffectivePnL(trade),
                  currencyCode: trade.currency || currency,
                  rMultiple,
                })}
              </div>
              <div className="journalit-reviewv2-bestworst-trade-meta">
                {formatDateDisplay(trade.entryTime, userDateFormat)}
              </div>
              {mergedConfig.showDuration && trade.exitTime && (
                <div className="journalit-reviewv2-bestworst-trade-meta">
                  {calculateDuration(trade.entryTime, trade.exitTime)}
                </div>
              )}
            </div>

            <div className="journalit-reviewv2-bestworst-details">
              <div className="journalit-reviewv2-bestworst-primary-row">
                <span className="journalit-reviewv2-bestworst-primary">
                  {trade.instrument || t('common.unknown')}
                </span>
                <span className="journalit-reviewv2-bestworst-secondary">
                  {directionDisplay}
                </span>
              </div>

              <div className="journalit-reviewv2-bestworst-chips journalit-reviewv2-bestworst-chip-row">
                {mergedConfig.showSetups &&
                  visibleSetups.map((setup: string) => (
                    <span
                      key={setup}
                      className="journalit-reviewv2-bestworst-chip journalit-reviewv2-bestworst-chip--setup"
                    >
                      {setup}
                    </span>
                  ))}
                {mergedConfig.showSetups && setupOverflowCount > 0 && (
                  <span className="journalit-reviewv2-bestworst-chip journalit-reviewv2-bestworst-chip--overflow">
                    +{setupOverflowCount}
                  </span>
                )}
              </div>

              <div className="journalit-reviewv2-bestworst-chips journalit-reviewv2-bestworst-chip-row">
                {mergedConfig.showMistakes &&
                  visibleMistakes.map((mistake: string) => (
                    <span
                      key={mistake}
                      className="journalit-reviewv2-bestworst-chip journalit-reviewv2-bestworst-chip--mistake"
                    >
                      {mistake}
                    </span>
                  ))}
                {mergedConfig.showMistakes && mistakeOverflowCount > 0 && (
                  <span className="journalit-reviewv2-bestworst-chip journalit-reviewv2-bestworst-chip--overflow">
                    +{mistakeOverflowCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    if (loading) {
      return (
        <div className={gridClassName}>
          {mergedConfig.showBest &&
            renderSkeletonCard(true, t('widget.best-worst.best-trade'))}
          {mergedConfig.showWorst &&
            renderSkeletonCard(false, t('widget.best-worst.worst-trade'))}
        </div>
      );
    }

    return (
      <div className={gridClassName}>
        {mergedConfig.showBest &&
          renderTradeCard(bestTrade, true, t('widget.best-worst.best-trade'))}
        {mergedConfig.showWorst &&
          renderTradeCard(
            worstTrade,
            false,
            t('widget.best-worst.worst-trade')
          )}
      </div>
    );
  });

BestWorstTradesWidget.displayName = 'BestWorstTradesWidget';

export {};
