

import { useMemo } from 'react';
import { PartialTradeFrontmatter } from '../../../types/TradeFrontmatter';
import {
  formatDateDisplay,
  getUserDateFormat,
  safeDateDuration,
} from '../../../utils/dateUtils';
import { formatDuration } from '../../../utils/formatting';
import {
  getCurrentRealizedPnL,
  getResolvedWeightedAverageExitPrice,
  getWeightedAverageEntryPrice,
  isTradeOpenWithContext,
} from '../../../utils/tradeStatusUtils';
import { classifyPnLWithBreakEvenSettings } from '../../../utils/breakEvenRange';
import {
  calculateDirectionalPriceDiff,
  calculateTotalDividends,
  getStoredOrCalculatedPnL,
} from '../../../utils/pnlCalculation';

interface UseTradeMetricsProps {
  data: PartialTradeFrontmatter;
  breakEvenRange?: {
    breakEvenRangeMin?: number;
    breakEvenRangeMax?: number;
    breakEvenThresholdMode?: 'fixed' | 'percentage_current_balance';
    breakEvenThresholdPercent?: number;
  };
  breakEvenAccountCurrentBalance?: number;
}

interface TradeMetrics {
  pnl: number;
  percentChange: number;
  duration: string;
  isProfit: boolean;
  isLoss?: boolean;
  isBreakeven?: boolean;
}

interface UseTradeMetricsReturn {
  metrics: TradeMetrics;
  formatDate: (date: Date | string | undefined) => string;
  formatTime: (date: Date | string | undefined) => string;
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  const userDateFormat = getUserDateFormat();
  const datePart = formatDateDisplay(dateObj, userDateFormat);
  const timePart = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} ${timePart}`;
};

const formatTime = (date: Date | string | undefined) => {
  if (!date) return 'N/A';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'N/A';
  return dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const useTradeMetrics = ({
  data,
  breakEvenRange,
  breakEvenAccountCurrentBalance,
}: UseTradeMetricsProps): UseTradeMetricsReturn => {
  const breakEvenThresholdMode = breakEvenRange?.breakEvenThresholdMode;
  const breakEvenThresholdPercent = breakEvenRange?.breakEvenThresholdPercent;
  const breakEvenRangeMin = breakEvenRange?.breakEvenRangeMin;
  const breakEvenRangeMax = breakEvenRange?.breakEvenRangeMax;

  
  const metrics = useMemo(() => {
    
    const isOpenTrade = isTradeOpenWithContext({
      tradeStatus: data.tradeStatus,
      exitTime: data.exitTime,
      exitPrice: data.exitPrice, 
      pnl: data._originalPnlWasNull ? null : data.pnl, 
      useDirectPnLInput: data.useDirectPnLInput,
      exits: data.exits,
      entries: data.entries,
    });

    const entryPrice =
      getWeightedAverageEntryPrice({
        entries: data.entries,
        entryPrice: data.entryPrice,
      }) ?? 0;
    const exitPrice =
      getResolvedWeightedAverageExitPrice({
        exits: data.exits,
        exitPrice: data.exitPrice,
        hasExplicitExitPrice: data.hasExplicitExitPrice,
        useDirectPnLInput: data.useDirectPnLInput,
      }) ?? 0;
    const priceDiff = calculateDirectionalPriceDiff(
      { assetType: data.assetType, direction: data.direction },
      entryPrice,
      exitPrice
    );

    
    if (isOpenTrade) {
      const realizedPnL =
        getCurrentRealizedPnL(
          {
            _originalPnlWasNull: data._originalPnlWasNull,
            tradeStatus: data.tradeStatus,
            pnl: data.pnl,
            useDirectPnLInput: data.useDirectPnLInput,
            directPnL: data.directPnL,
            dividends: data.dividends,
            commission: data.commission,
            commissionType: data.commissionType,
            swap: data.swap,
            fees: data.fees,
            rebate: data.rebate,
            entries: data.entries,
            exits: data.exits,
            direction: data.direction,
            optionType: data.optionType,
            assetType: data.assetType,
            contractSize: data.contractSize,
            dollarPerPoint: data.dollarPerPoint,
            tickSize: data.tickSize,
            tickValue: data.tickValue,
            lotSize: data.lotSize,
            pipValue: data.pipValue,
            pipSize: data.pipSize,
            forexPnlConversionRate: data.forexPnlConversionRate,
          },
          calculateTotalDividends({ dividends: data.dividends }),
          { authoritativePnlUnknown: data._originalPnlWasNull === true }
        ) ?? 0;
      const outcome = classifyPnLWithBreakEvenSettings(
        realizedPnL,
        {
          breakEvenRangeMin,
          breakEvenRangeMax,
          breakEvenThresholdMode,
          breakEvenThresholdPercent,
        },
        breakEvenAccountCurrentBalance
      );
      const normalizedOutcome = outcome === 'unknown' ? 'breakeven' : outcome;

      return {
        pnl: realizedPnL,
        percentChange: 0,
        duration: '',
        isProfit: normalizedOutcome === 'win',
        isLoss: normalizedOutcome === 'loss',
        isBreakeven: normalizedOutcome === 'breakeven',
      };
    }

    const pnl =
      getStoredOrCalculatedPnL(
        {
          tradeStatus: data.tradeStatus,
          entryTime: data.entryTime,
          exitTime: data.exitTime,
          entryPrice: data.entryPrice,
          exitPrice: data.exitPrice,
          hasExplicitExitPrice: data.hasExplicitExitPrice,
          positionSize: data.positionSize,
          direction: data.direction,
          assetType: data.assetType,
          optionType: data.optionType,
          entries: data.entries,
          exits: data.exits,
          pnl: data.pnl,
          useDirectPnLInput: data.useDirectPnLInput,
          directPnL: data.directPnL,
          dividends: data.dividends,
          commission: data.commission,
          commissionType: data.commissionType,
          swap: data.swap,
          fees: data.fees,
          rebate: data.rebate,
          contractSize: data.contractSize,
          dollarPerPoint: data.dollarPerPoint,
          tickSize: data.tickSize,
          tickValue: data.tickValue,
          lotSize: data.lotSize,
          pipValue: data.pipValue,
          pipSize: data.pipSize,
          forexPnlConversionRate: data.forexPnlConversionRate,
        },
        { authoritativePnlUnknown: data._originalPnlWasNull === true }
      ) ?? 0;

    const percentChange =
      entryPrice > 0 && priceDiff !== null ? (priceDiff / entryPrice) * 100 : 0;

    
    let duration = '';
    if (data.entryTime && data.exitTime) {
      const durationMs = safeDateDuration(data.entryTime, data.exitTime);
      
      if (durationMs !== null && durationMs >= 0) {
        duration = formatDuration(durationMs);
      }
    }

    const outcome = classifyPnLWithBreakEvenSettings(
      pnl,
      {
        breakEvenRangeMin,
        breakEvenRangeMax,
        breakEvenThresholdMode,
        breakEvenThresholdPercent,
      },
      breakEvenAccountCurrentBalance
    );

    const normalizedOutcome = outcome === 'unknown' ? 'breakeven' : outcome;

    return {
      pnl,
      percentChange,
      duration,
      isProfit: normalizedOutcome === 'win',
      isLoss: normalizedOutcome === 'loss',
      isBreakeven: normalizedOutcome === 'breakeven',
    };
  }, [
    data.entryPrice,
    data.exitPrice,
    data.positionSize,
    data.direction,
    data.optionType,
    data.pnl,
    data.directPnL,
    data.dividends,
    data.commission,
    data.commissionType,
    data.swap,
    data.fees,
    data.rebate,
    data.entryTime,
    data.exitTime,
    data.tradeStatus,
    data.useDirectPnLInput,
    data.hasExplicitExitPrice,
    data.exits,
    data.entries,
    data._originalPnlWasNull,
    data.assetType,
    data.contractSize,
    data.dollarPerPoint,
    data.tickSize,
    data.tickValue,
    data.lotSize,
    data.pipValue,
    data.pipSize,
    data.forexPnlConversionRate,
    breakEvenRangeMin,
    breakEvenRangeMax,
    breakEvenThresholdMode,
    breakEvenThresholdPercent,
    breakEvenAccountCurrentBalance,
  ]);

  

  

  return {
    metrics,
    formatDate,
    formatTime,
  };
};
