

import { formatPnL, calculateEffectiveRMultiple } from './formatting';
import {
  formatDateDisplay,
  safeGetTime,
  safeDateSort,
  formatDatesForChartAxis,
} from './dateUtils';
import { Trade } from '../components/dashboard/utils/dataUtils';
import { getEffectivePnL, isPnlContributingTrade } from './tradeStatusUtils';
import {
  getAnalyticsDateBasis,
  getTradeAnalyticsDate,
  getTradeRealizedPnlEvents,
} from './tradeAnalyticsDate';
import type JournalitPlugin from '../main';
import {
  analyzeDrawdown,
  getDrawdownCacheSignature,
  type DrawdownCapitalBasis,
  type DrawdownDirection,
} from './drawdownAnalytics';


interface NiceAxisConfig {
  
  domain: [number, number];
  
  ticks: number[];
  
  step: number;
}


const MIN_YAXIS_WIDTH = 45;
const MAX_YAXIS_WIDTH = 90;

const CHAR_WIDTH_PX = 7;

const YAXIS_PADDING = 12;


export const calculateYAxisWidth = (
  ticks: number[],
  formatter: (value: number) => string
): number => {
  if (!ticks || ticks.length === 0) return MIN_YAXIS_WIDTH;

  
  const maxLength = Math.max(
    ...ticks.map((tick) => {
      const formatted = formatter(tick);
      return formatted ? formatted.length : 0;
    })
  );

  
  const calculatedWidth = maxLength * CHAR_WIDTH_PX + YAXIS_PADDING;

  
  return Math.max(MIN_YAXIS_WIDTH, Math.min(MAX_YAXIS_WIDTH, calculatedWidth));
};


const calculateNiceStep = (
  range: number,
  targetSteps: number,
  maxWastePercent: number = 0.5
): number => {
  if (range <= 0 || targetSteps <= 0) return 1;

  const rawStep = range / targetSteps;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));

  if (isNaN(magnitude) || magnitude <= 0) return rawStep;

  
  const candidates = [1, 2, 2.5, 5, 10].map((m) => m * magnitude);

  let bestStep = candidates[candidates.length - 1];
  let bestDistance = Infinity;
  let bestWaste = Infinity;

  for (const step of candidates) {
    const ticksNeeded = Math.ceil(range / step);
    const axisRange = ticksNeeded * step;
    const waste = axisRange - range;
    const wastePercent = waste / range;

    
    if (wastePercent > maxWastePercent) continue;

    
    if (ticksNeeded > targetSteps * 2) continue;

    
    
    const distance = Math.abs(ticksNeeded - targetSteps);
    if (
      distance < bestDistance ||
      (distance === bestDistance && waste < bestWaste)
    ) {
      bestStep = step;
      bestDistance = distance;
      bestWaste = waste;
    }
  }

  return bestStep;
};


export const generateNiceAxis = (
  dataMin: number,
  dataMax: number,
  targetTickCount: number = 5,
  includeZero: boolean = false,
  asymmetricZero: boolean = false
): NiceAxisConfig => {
  
  
  if (!Number.isFinite(dataMin) || !Number.isFinite(dataMax)) {
    return { domain: [0, 1], ticks: [0, 1], step: 1 };
  }

  
  if (includeZero) {
    dataMin = Math.min(0, dataMin);
    dataMax = Math.max(0, dataMax);
  }

  if (dataMin === dataMax) {
    
    const value = dataMin;
    if (value === 0) {
      return { domain: [-1, 1], ticks: [-1, 0, 1], step: 1 };
    }
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
    const step = magnitude;
    const axisMin = Math.floor(value / step) * step - step;
    const axisMax = Math.ceil(value / step) * step + step;
    const ticks: number[] = [];
    for (let tick = axisMin; tick <= axisMax + step * 0.0001; tick += step) {
      ticks.push(Math.round(tick * 1e10) / 1e10);
    }
    return { domain: [axisMin, axisMax], ticks, step };
  }

  
  if (dataMin > dataMax) {
    [dataMin, dataMax] = [dataMax, dataMin];
  }

  
  
  if (asymmetricZero && dataMin < 0 && dataMax > 0) {
    const negativeRange = Math.abs(dataMin);
    const positiveRange = dataMax;
    const totalRange = negativeRange + positiveRange;

    
    
    const step = calculateNiceStep(totalRange, targetTickCount - 1);

    
    const axisMin = -Math.ceil(negativeRange / step) * step;
    const axisMax = Math.ceil(positiveRange / step) * step;

    
    const ticks: number[] = [];

    
    for (let tick = axisMin; tick < -0.0001; tick += step) {
      const roundedTick = Math.round(tick * 1e10) / 1e10;
      ticks.push(roundedTick);
    }

    
    ticks.push(0);

    
    for (let tick = step; tick <= axisMax + step * 0.0001; tick += step) {
      const roundedTick = Math.round(tick * 1e10) / 1e10;
      ticks.push(roundedTick);
    }

    return {
      domain: [axisMin, axisMax],
      ticks,
      step,
    };
  }

  
  const range = dataMax - dataMin;

  
  const rawStep = range / (targetTickCount - 1);

  if (isNaN(rawStep) || rawStep <= 0) {
    return {
      domain: [dataMin, dataMax],
      ticks: [dataMin, dataMax],
      step: range,
    };
  }

  
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));

  if (isNaN(magnitude) || magnitude <= 0) {
    return {
      domain: [dataMin, dataMax],
      ticks: [dataMin, dataMax],
      step: range,
    };
  }

  
  
  const normalizedStep = rawStep / magnitude;
  let step: number;

  if (normalizedStep < 1.5) {
    step = magnitude;
  } else if (normalizedStep < 3.5) {
    step = 2 * magnitude;
  } else if (normalizedStep < 7.5) {
    step = 5 * magnitude;
  } else {
    step = 10 * magnitude;
  }

  
  
  let axisMin = Math.floor(dataMin / step) * step;
  let axisMax = Math.ceil(dataMax / step) * step;

  
  if (dataMin < 0 && dataMax > 0) {
    
    
    if (axisMin > 0) axisMin = 0;
    if (axisMax < 0) axisMax = 0;
  }

  
  const ticks: number[] = [];
  
  for (let tick = axisMin; tick <= axisMax + step * 0.0001; tick += step) {
    
    const roundedTick = Math.round(tick * 1e10) / 1e10;
    ticks.push(roundedTick);
  }

  
  if (dataMin <= 0 && dataMax >= 0 && !ticks.includes(0)) {
    ticks.push(0);
    ticks.sort((a, b) => a - b);
  }

  return {
    domain: [axisMin, axisMax],
    ticks,
    step,
  };
};


const formatDrawdown = (
  value: number,
  currency?: string,
  displayRMultiples?: boolean,
  rMultiple?: number
): string => formatPnL(value, true, currency, displayRMultiples, rMultiple);


export interface PnLChartDataPoint {
  date: string;
  dateKey: string;
  pnl: number;
  tradePnL: number;
  accounts?: string;
  cumulativeR?: number; 
  tradeR?: number; 
}

const formatTradeAccountLabel = (trade: { account?: string | string[] }) => {
  if (Array.isArray(trade.account)) {
    return trade.account
      .map((account) => account.trim())
      .filter((account) => account.length > 0)
      .join(', ');
  }

  return typeof trade.account === 'string' ? trade.account.trim() : '';
};


const pnlChartDataCache = new Map<string, PnLChartDataPoint[]>();

const isEventWithinTradeAnalyticsRange = (
  trade: Trade,
  date: Date
): boolean => {
  const rangeStart = trade._analyticsRangeStart;
  const rangeEnd = trade._analyticsRangeEnd;
  return (!rangeStart || date >= rangeStart) && (!rangeEnd || date <= rangeEnd);
};

export const preparePnLChartData = (
  trades: Trade[],
  dateFormat: string,
  defaultRiskAmount?: number,
  plugin?: JournalitPlugin | null
): PnLChartDataPoint[] => {
  
  if (!trades || !Array.isArray(trades)) {
    const fallbackDate = new Date();
    return [
      {
        date: formatDateDisplay(fallbackDate, dateFormat),
        dateKey: `pnl-${fallbackDate.getTime()}-0`,
        pnl: 0,
        tradePnL: 0,
      },
    ];
  }

  const pnlContributingTrades = trades.filter((trade) =>
    isPnlContributingTrade(trade)
  );

  const analyticsDateBasis = getAnalyticsDateBasis(plugin?.settings);

  
  const tradeSignature =
    pnlContributingTrades.length > 0
      ? `${pnlContributingTrades[0]?.path || ''}:${pnlContributingTrades[pnlContributingTrades.length - 1]?.path || ''}:${pnlContributingTrades.map((t) => (Array.isArray(t.account) ? t.account.join(',') : t.account || '')).join(',')}`
      : 'empty';
  const analyticsRangeSignature = pnlContributingTrades
    .map(
      (trade) =>
        `${safeGetTime(trade._analyticsRangeStart)}-${safeGetTime(trade._analyticsRangeEnd)}`
    )
    .join(',');
  const cacheKey = `pnl:${pnlContributingTrades.length}:${dateFormat}:${tradeSignature}:${defaultRiskAmount ?? 'none'}:${analyticsDateBasis}:${analyticsRangeSignature}`;
  const cached = pnlChartDataCache.get(cacheKey);
  if (cached) return cached;

  const pnlEvents = pnlContributingTrades.flatMap((trade) => {
    const events = getTradeRealizedPnlEvents(trade, analyticsDateBasis, plugin);
    return events.length > 0
      ? events
          .filter((event) =>
            isEventWithinTradeAnalyticsRange(trade, event.tradingDay)
          )
          .map((event) => ({
            trade,
            date: event.date,
            pnl: event.pnl,
            useStoredRMultiple: events.length === 1,
          }))
      : [
          {
            trade,
            date:
              getTradeAnalyticsDate(trade, analyticsDateBasis) ??
              trade.entryTime,
            pnl: getEffectivePnL(trade),
            useStoredRMultiple: true,
          },
        ];
  });

  const sortedEvents = pnlEvents.sort((a, b) => safeDateSort(a.date, b.date));

  
  let cumulativePnL = 0;
  let cumulativeR = 0;
  let chartData: PnLChartDataPoint[] = [];
  const originalDates: (Date | null)[] = []; 
  let pointIndex = 0;

  const nextDateKey = (
    timestamp: number | null | undefined,
    fallbackPrefix: string
  ) => {
    const safeTimestamp = timestamp != null ? timestamp : fallbackPrefix;
    const key = `pnl-${safeTimestamp}-${pointIndex}`;
    pointIndex += 1;
    return key;
  };

  
  if (sortedEvents.length > 0) {
    const firstEventDate = new Date(sortedEvents[0].date);
    const firstTimestamp = safeGetTime(firstEventDate);
    originalDates.push(firstEventDate);
    chartData.push({
      date: '', 
      dateKey: nextDateKey(firstTimestamp, 'initial'),
      pnl: 0,
      tradePnL: 0,
      cumulativeR: 0,
      tradeR: 0,
    });
  } else {
    
    const now = new Date();
    originalDates.push(now);
    chartData.push({
      date: formatDateDisplay(now, dateFormat),
      dateKey: nextDateKey(null, 'empty'),
      pnl: 0,
      tradePnL: 0,
      cumulativeR: 0,
      tradeR: 0,
    });
  }

  
  sortedEvents.forEach(({ trade, date, pnl, useStoredRMultiple }) => {
    let tradePnL = pnl;
    if (isNaN(tradePnL)) tradePnL = 0;

    cumulativePnL += tradePnL;
    
    if (isNaN(cumulativePnL)) {
      cumulativePnL = 0;
    }

    
    const effectiveR = calculateEffectiveRMultiple(
      tradePnL,
      useStoredRMultiple ? trade.rMultiple : undefined,
      trade.riskAmount,
      defaultRiskAmount
    );

    let tradeR = effectiveR ?? 0;
    if (isNaN(tradeR)) tradeR = 0;
    cumulativeR += tradeR;

    
    if (isNaN(cumulativeR)) {
      cumulativeR = 0;
    }

    const tradeDate = new Date(date);
    originalDates.push(tradeDate);

    chartData.push({
      date: '', 
      dateKey: nextDateKey(safeGetTime(tradeDate), 'trade'),
      pnl: cumulativePnL,
      tradePnL: tradePnL,
      accounts: formatTradeAccountLabel(trade),
      cumulativeR: cumulativeR,
      tradeR: tradeR,
    });
  });

  
  const optimizedLabels = formatDatesForChartAxis(originalDates, dateFormat);
  chartData = chartData.map((point, i) => ({
    ...point,
    date: optimizedLabels[i] ?? formatDateDisplay(originalDates[i], dateFormat),
  }));

  
  pnlChartDataCache.set(cacheKey, chartData);

  
  if (pnlChartDataCache.size > 50) {
    const firstKey = pnlChartDataCache.keys().next().value;
    pnlChartDataCache.delete(firstKey);
  }

  return chartData;
};


export interface DrawdownChartDataPoint {
  date: string;
  dateKey: string;
  drawdown: number;
  drawdownAmount: number;
  drawdownPercent?: number | null;
  drawdownPercentBasisValue?: number | null;
  drawdownPercentBasisLabel?: string | null;
  drawdownR?: number;
  pnl: number;
  cumPnL: number;
  peakRealizedPnl: number;
  rMultiple?: number; 
  cumulativeR?: number; 
  episodeStartDate?: string;
  underwaterDurationMs?: number | null;
  underwaterDurationDays?: number | null;
  underwaterDurationTrades?: number;
  distanceToRecovery?: number;
  distanceToRecoveryR?: number;
}

export const shouldUseDrawdownPercentScale = (
  data: DrawdownChartDataPoint[]
): boolean =>
  data.length > 0 &&
  data.every(
    (point) =>
      point.drawdownPercent != null &&
      Number.isFinite(point.drawdownPercent) &&
      point.drawdownPercentBasisLabel
  );

export const getDrawdownChartScaleValue = (
  point: DrawdownChartDataPoint,
  usePercentScale: boolean
): number =>
  usePercentScale ? -Math.abs(point.drawdownPercent ?? 0) : point.drawdown;

interface PreparedDrawdownChartData {
  data: DrawdownChartDataPoint[];
  totalClosedTrades: number;
}


const drawdownChartDataCache = new Map<string, PreparedDrawdownChartData>();

export const prepareDrawdownChartState = (
  trades: Trade[],
  dateFormat: string,
  defaultRiskAmount?: number,
  direction: DrawdownDirection = 'combined',
  plugin?: JournalitPlugin | null,
  analyticsDateBasisOverride?: 'entry' | 'exit',
  capitalBasis?: DrawdownCapitalBasis
): PreparedDrawdownChartData => {
  
  if (!trades || !Array.isArray(trades)) {
    const fallbackDate = new Date();
    return {
      data: [
        {
          date: formatDateDisplay(fallbackDate, dateFormat),
          dateKey: `drawdown-${fallbackDate.getTime()}-0`,
          drawdown: 0,
          drawdownAmount: 0,
          drawdownPercent: null,
          drawdownPercentBasisValue: null,
          drawdownPercentBasisLabel: null,
          drawdownR: 0,
          pnl: 0,
          cumPnL: 0,
          peakRealizedPnl: 0,
          rMultiple: 0,
          cumulativeR: 0,
        },
      ],
      totalClosedTrades: 0,
    };
  }

  const pnlContributingTrades = trades.filter((trade) =>
    isPnlContributingTrade(trade)
  );

  const analyticsDateBasis =
    analyticsDateBasisOverride ??
    (plugin ? getAnalyticsDateBasis(plugin.settings) : 'entry');
  const drawdownTrades = pnlContributingTrades.flatMap((trade) => {
    const events = getTradeRealizedPnlEvents(trade, analyticsDateBasis, plugin);
    return events.length > 0
      ? events
          .filter((event) =>
            isEventWithinTradeAnalyticsRange(trade, event.tradingDay)
          )
          .map((event) => ({
            ...trade,
            pnl: event.pnl,
            rMultiple: events.length === 1 ? trade.rMultiple : undefined,
            exitTime: event.date,
            exits: undefined,
          }))
      : [
          {
            ...trade,
            exitTime:
              getTradeAnalyticsDate(trade, analyticsDateBasis) ??
              (analyticsDateBasis === 'entry'
                ? trade.entryTime
                : trade.exitTime),
            exits: undefined,
          },
        ];
  });

  const tradeSignature = getDrawdownCacheSignature(
    drawdownTrades,
    direction,
    true
  );
  const capitalBasisCacheKey = capitalBasis
    ? `${capitalBasis.type}:${'amount' in capitalBasis ? capitalBasis.amount : 'none'}:${'label' in capitalBasis ? (capitalBasis.label ?? '') : ''}`
    : 'none';
  const cacheKey = `drawdown:${direction}:${dateFormat}:${tradeSignature}:${defaultRiskAmount ?? 'none'}:${analyticsDateBasis}:${capitalBasisCacheKey}`;
  const cached = drawdownChartDataCache.get(cacheKey);
  if (cached) return cached;

  const scopedCapitalBasis =
    direction === 'combined' ? capitalBasis : undefined;

  const analytics = analyzeDrawdown(drawdownTrades, {
    defaultRiskAmount,
    direction,
    assumeClosedTrades: true,
    capitalBasis: scopedCapitalBasis,
  });

  let chartData: DrawdownChartDataPoint[] = [];
  const originalDates: (Date | null)[] = [];
  let pointIndex = 0;

  const nextDateKey = (
    timestamp: number | null | undefined,
    fallbackPrefix: string
  ) => {
    const source = timestamp != null ? timestamp : fallbackPrefix;
    const key = `drawdown-${source}-${pointIndex}`;
    pointIndex += 1;
    return key;
  };

  if (analytics.points.length > 0) {
    const firstPointDate = analytics.points[0].realizedAt;
    originalDates.push(firstPointDate);
    chartData.push({
      date: '',
      dateKey: nextDateKey(analytics.points[0].realizedAtMs, 'initial'),
      drawdown: 0,
      drawdownAmount: 0,
      drawdownPercent:
        analytics.points[0].drawdownPercentBasisLabel != null ? 0 : null,
      drawdownPercentBasisValue: analytics.points[0].drawdownPercentBasisValue,
      drawdownPercentBasisLabel: analytics.points[0].drawdownPercentBasisLabel,
      drawdownR: 0,
      pnl: 0,
      cumPnL: 0,
      peakRealizedPnl: 0,
      rMultiple: 0,
      cumulativeR: 0,
    });

    let episodeIndex = 0;
    let activeEpisode = analytics.episodes[episodeIndex];

    analytics.points.forEach((point) => {
      while (
        activeEpisode &&
        point.tradeIndex > activeEpisode.endPoint.tradeIndex &&
        episodeIndex < analytics.episodes.length
      ) {
        episodeIndex += 1;
        activeEpisode = analytics.episodes[episodeIndex];
      }

      const pointEpisode =
        activeEpisode &&
        point.drawdownAmount > 0 &&
        point.tradeIndex >= activeEpisode.startPoint.tradeIndex &&
        point.tradeIndex <= activeEpisode.endPoint.tradeIndex
          ? activeEpisode
          : null;
      const underwaterDurationMs = pointEpisode
        ? point.realizedAtMs != null &&
          pointEpisode.startPoint.realizedAtMs != null
          ? Math.max(
              0,
              point.realizedAtMs - pointEpisode.startPoint.realizedAtMs
            )
          : null
        : null;
      const underwaterDurationDays =
        underwaterDurationMs != null
          ? underwaterDurationMs / (24 * 60 * 60 * 1000)
          : null;

      originalDates.push(point.realizedAt);
      chartData.push({
        date: '',
        dateKey: nextDateKey(point.realizedAtMs, 'trade'),
        drawdown: -point.drawdownAmount,
        drawdownAmount: point.drawdownAmount,
        drawdownPercent: point.drawdownPercent,
        drawdownPercentBasisValue: point.drawdownPercentBasisValue,
        drawdownPercentBasisLabel: point.drawdownPercentBasisLabel,
        drawdownR:
          point.drawdownAmount > 0 && point.drawdownRComplete
            ? point.drawdownR
            : undefined,
        pnl: point.pnl,
        cumPnL: point.cumulativeRealizedPnl,
        peakRealizedPnl: point.peakCumulativeRealizedPnl,
        rMultiple: point.rMultiple,
        cumulativeR: point.cumulativeR,
        episodeStartDate: pointEpisode
          ? formatDateDisplay(pointEpisode.startPoint.realizedAt, dateFormat)
          : undefined,
        underwaterDurationMs,
        underwaterDurationDays,
        underwaterDurationTrades: pointEpisode
          ? point.tradeIndex - pointEpisode.startPoint.tradeIndex + 1
          : undefined,
        distanceToRecovery: pointEpisode ? point.drawdownAmount : undefined,
        distanceToRecoveryR:
          pointEpisode && point.drawdownRComplete ? point.drawdownR : undefined,
      });
    });
  } else {
    const now = new Date();
    originalDates.push(now);
    chartData.push({
      date: formatDateDisplay(now, dateFormat),
      dateKey: nextDateKey(null, 'empty'),
      drawdown: 0,
      drawdownAmount: 0,
      drawdownPercent: null,
      drawdownPercentBasisValue: null,
      drawdownPercentBasisLabel: null,
      drawdownR: 0,
      pnl: 0,
      cumPnL: 0,
      peakRealizedPnl: 0,
      rMultiple: 0,
      cumulativeR: 0,
    });
  }

  const optimizedLabels = formatDatesForChartAxis(originalDates, dateFormat);
  chartData = chartData.map((point, i) => ({
    ...point,
    date: optimizedLabels[i] ?? formatDateDisplay(originalDates[i], dateFormat),
  }));

  const preparedState = {
    data: chartData,
    totalClosedTrades: analytics.summary.totalClosedTrades,
  };

  drawdownChartDataCache.set(cacheKey, preparedState);

  if (drawdownChartDataCache.size > 50) {
    const firstKey = drawdownChartDataCache.keys().next().value;
    drawdownChartDataCache.delete(firstKey);
  }

  return preparedState;
};

export const prepareDrawdownChartData = (
  trades: Trade[],
  dateFormat: string,
  defaultRiskAmount?: number,
  direction: DrawdownDirection = 'combined',
  plugin?: JournalitPlugin | null,
  analyticsDateBasisOverride?: 'entry' | 'exit',
  capitalBasis?: DrawdownCapitalBasis
): DrawdownChartDataPoint[] => {
  return prepareDrawdownChartState(
    trades,
    dateFormat,
    defaultRiskAmount,
    direction,
    plugin,
    analyticsDateBasisOverride,
    capitalBasis
  ).data;
};


export interface TradesChartDataPoint {
  tradeIndex: number;
  pnl: number;
  fill: string;
  instrument?: string;
  direction?: string;
  entryTime?: Date;
  exitTime?: Date;
  path?: string;
  rMultiple?: number;
  accounts?: string;
}

export const prepareTradesChartData = (
  trades: Trade[],
  defaultRiskAmount?: number,
  plugin?: JournalitPlugin | null
): TradesChartDataPoint[] => {
  const pnlContributingTrades = trades.filter((trade) =>
    isPnlContributingTrade(trade)
  );
  const analyticsDateBasis = plugin
    ? getAnalyticsDateBasis(plugin.settings)
    : 'entry';

  const pnlEvents = pnlContributingTrades.flatMap((trade) => {
    const events = getTradeRealizedPnlEvents(trade, analyticsDateBasis, plugin);
    return events.length > 0
      ? events
          .filter((event) =>
            isEventWithinTradeAnalyticsRange(trade, event.tradingDay)
          )
          .map((event) => ({
            trade,
            date: event.date,
            pnl: event.pnl,
            useStoredRMultiple: events.length === 1,
          }))
      : [
          {
            trade,
            date:
              getTradeAnalyticsDate(trade, analyticsDateBasis) ??
              trade.entryTime,
            pnl: getEffectivePnL(trade),
            useStoredRMultiple: true,
          },
        ];
  });

  const sortedEvents = pnlEvents.sort((a, b) => safeDateSort(a.date, b.date));

  
  const result = sortedEvents.map(
    ({ trade, date, pnl, useStoredRMultiple }, index) => {
      let tradePnL = pnl;
      if (isNaN(tradePnL)) tradePnL = 0;

      const isProfitable = tradePnL >= 0;

      
      const effectiveRMultiple = calculateEffectiveRMultiple(
        tradePnL,
        useStoredRMultiple ? trade.rMultiple : undefined,
        trade.riskAmount,
        defaultRiskAmount
      );

      return {
        tradeIndex: index + 1,
        pnl: tradePnL,
        fill: isProfitable ? 'var(--chart-positive)' : 'var(--chart-negative)',
        instrument: trade.instrument,
        direction: trade.direction,
        entryTime: trade.entryTime,
        exitTime: analyticsDateBasis === 'entry' ? trade.exitTime : date,
        path: trade.path,
        rMultiple: effectiveRMultiple,
        accounts: formatTradeAccountLabel(trade),
      };
    }
  );

  return result;
};


export const TOOLTIP_CLASS_NAMES = {
  container: 'journalit-chart-tooltip',
  date: 'journalit-chart-tooltip-date',
  value: 'journalit-chart-tooltip-value',
  info: 'journalit-chart-tooltip-info',
  positive: 'positive',
  negative: 'negative',
};


export const formatTooltipValue = (
  value: number,
  type: 'pnl' | 'drawdown' | 'number',
  currency?: string,
  displayRMultiples?: boolean,
  rMultiple?: number
): string => {
  switch (type) {
    case 'pnl':
      return formatPnL(value, true, currency, displayRMultiples, rMultiple);
    case 'drawdown':
      return formatDrawdown(value, currency, displayRMultiples, rMultiple);
    case 'number':
    default:
      return value.toFixed(2);
  }
};
