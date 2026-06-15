

import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { createPortal } from 'react-dom';
import { Trade } from '../dashboard/utils/dataUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { getTradeAnalyticsTradingDay } from '../../utils/tradeAnalyticsDate';
import { usePlugin } from '../../hooks/usePlugin';
import { getDisplayPnL, getAccountCount } from '../../utils/pnlUtils';
import {
  getEffectivePnL,
  isPnlContributingTrade,
} from '../../utils/tradeStatusUtils';
import { hasTranslation, t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';

export const CONTRIBUTIONS_HEATMAP_STYLES = `

        .contributions-heatmap {
          
          --heatmap-empty: rgba(var(--background-modifier-border-rgb, 55, 53, 47), 0.12);
          --heatmap-empty-hover: rgba(var(--background-modifier-border-rgb, 55, 53, 47), 0.18);

          
          --heatmap-profit-1: rgba(16, 185, 129, 0.15);
          --heatmap-profit-2: rgba(16, 185, 129, 0.35);
          --heatmap-profit-3: rgba(16, 185, 129, 0.65);
          --heatmap-profit-4: rgba(5, 150, 105, 0.85);

          
          --heatmap-loss-1: rgba(239, 68, 68, 0.15);
          --heatmap-loss-2: rgba(239, 68, 68, 0.35);
          --heatmap-loss-3: rgba(239, 68, 68, 0.65);
          --heatmap-loss-4: rgba(220, 38, 38, 0.85);

          
          --heatmap-text-primary: var(--text-normal);
          --heatmap-text-secondary: var(--text-muted);
          --heatmap-font-weight-medium: 500;
          --heatmap-font-weight-semibold: 600;

          
          --heatmap-transition-quick: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          --heatmap-transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --heatmap-shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.05);
          --heatmap-shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.12);
        }

        .contributions-heatmap.heatmap-container {
          --padding-horizontal: 16px;
          --padding-vertical: 12px;
          --cell-size: 11px;
          --cell-gap: 3px;
          --border-radius-cell: 2px;
          --border-radius-container: 8px;
          height: var(--heatmap-height);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--padding-vertical) var(--padding-horizontal);
          background: transparent;
        }

        .contributions-heatmap .heatmap-month-row {
          display: flex;
          margin-bottom: 12px;
          width: 100%;
          max-width: var(--heatmap-max-width);
          padding-left: 32px;
        }

        .contributions-heatmap .heatmap-cell {
          width: var(--cell-size);
          height: var(--cell-size);
          border-radius: var(--border-radius-cell);
          transition: var(--heatmap-transition-quick);
          position: relative;
          overflow: hidden;
          background-color: var(--heatmap-cell-bg, transparent);
          border: var(--heatmap-cell-border, none);
        }

        .contributions-heatmap .heatmap-cell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
          opacity: 0;
          transition: var(--heatmap-transition-quick);
        }

        .contributions-heatmap .heatmap-cell:hover::before {
          opacity: 1;
        }

        .contributions-heatmap .heatmap-cell:hover {
          transform: scale(1.15);
          box-shadow: var(--heatmap-shadow-elevated);
          z-index: 10;
        }

        .contributions-heatmap .heatmap-cell.clickable {
          cursor: pointer;
        }

        .contributions-heatmap .heatmap-cell.clickable:active {
          transform: scale(1.05);
        }

        .contributions-heatmap .heatmap-month-label {
          font-size: 11px;
          font-weight: var(--heatmap-font-weight-medium);
          color: var(--heatmap-text-secondary);
          letter-spacing: 0.025em;
          text-align: left;
          padding-left: 2px;
          flex: 0 0 var(--heatmap-month-width);
        }

        .contributions-heatmap .heatmap-grid {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .contributions-heatmap .heatmap-days {
          display: flex;
          flex-direction: column;
          gap: var(--cell-gap);
          padding-top: 1px;
        }

        .contributions-heatmap .heatmap-day-label {
          height: var(--cell-size);
          display: flex;
          align-items: center;
          font-size: 9px;
          font-weight: var(--heatmap-font-weight-medium);
          color: var(--heatmap-text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .contributions-heatmap .heatmap-day-spacer {
          height: var(--cell-size);
        }

        .contributions-heatmap .heatmap-weeks {
          display: flex;
          gap: var(--cell-gap);
        }

        .contributions-heatmap .heatmap-week {
          display: flex;
          flex-direction: column;
          gap: var(--cell-gap);
        }

        .contributions-heatmap .heatmap-legend-row {
          display: flex;
          align-items: center;
          margin-top: 16px;
          gap: 8px;
        }

        .contributions-heatmap .heatmap-legend-cells {
          display: flex;
          gap: var(--cell-gap);
        }

        .contributions-heatmap .heatmap-legend {
          font-size: 10px;
          font-weight: var(--heatmap-font-weight-medium);
          color: var(--heatmap-text-secondary);
          letter-spacing: 0.025em;
        }

        .contributions-heatmap .heatmap-legend-cell {
          width: 10px;
          height: 10px;
          border-radius: var(--border-radius-cell);
          transition: var(--heatmap-transition-quick);
        }

        .contributions-heatmap .heatmap-legend-cell--empty {
          background-color: var(--heatmap-empty);
        }

        .contributions-heatmap .heatmap-legend-cell--masked-active {
          background-color: var(--text-muted);
        }

        .contributions-heatmap .heatmap-legend-cell--profit-1 {
          background-color: var(--heatmap-profit-1);
        }

        .contributions-heatmap .heatmap-legend-cell--profit-2 {
          background-color: var(--heatmap-profit-2);
        }

        .contributions-heatmap .heatmap-legend-cell--profit-3 {
          background-color: var(--heatmap-profit-3);
        }

        .contributions-heatmap .heatmap-legend-cell--profit-4 {
          background-color: var(--heatmap-profit-4);
        }

        .contributions-heatmap .heatmap-legend-cell:hover {
          transform: scale(1.1);
          box-shadow: var(--heatmap-shadow-subtle);
        }

        
        .journalit-heatmap-tooltip {
          background-color: var(--background-primary);
          border-radius: 10px;
          padding: 14px 18px;
          min-width: 140px;
          border: 1px solid var(--background-modifier-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          position: fixed;
          top: var(--heatmap-tooltip-top, 0px);
          left: var(--heatmap-tooltip-left, 0px);
          z-index: 10000;
          pointer-events: none;
          opacity: 0;
          transform: translateY(0);
          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .journalit-heatmap-tooltip.is-visible {
          opacity: 1;
          transform: translateY(-4px);
        }

        .journalit-heatmap-tooltip .heatmap-tooltip-date {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-normal);
          margin-bottom: 8px;
          text-align: center;
          border-bottom: 1px solid var(--background-modifier-border);
          padding-bottom: 6px;
        }

        .journalit-heatmap-tooltip .heatmap-tooltip-value {
          font-size: 20px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 4px;
        }

        .journalit-heatmap-tooltip .heatmap-tooltip-value.positive {
          color: var(--chart-positive, var(--text-success, #43a047));
        }

        .journalit-heatmap-tooltip .heatmap-tooltip-value.negative {
          color: var(--chart-negative, var(--text-error, #e53935));
        }

        .journalit-heatmap-tooltip .heatmap-tooltip-info {
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          font-style: italic;
        }

        @media (prefers-reduced-motion: reduce) {
          .contributions-heatmap .heatmap-cell,
          .contributions-heatmap .heatmap-legend-cell {
            transition: none;
          }

          .contributions-heatmap .heatmap-cell:hover {
            transform: none;
          }

          .contributions-heatmap .heatmap-legend-cell:hover {
            transform: none;
          }

          .journalit-heatmap-tooltip {
            transition: none !important;
          }
        }
      
`;

interface ContributionsHeatmapProps {
  trades: Trade[];
  year?: number;
  onDayClick?: (date: Date) => void;
  height?: string | number;
  
  maxWeeks?: number;
  
  rollingMode?: boolean;
}

interface DayData {
  date: Date;
  dateString: string;
  pnl: number;
  tradeCount: number;
  intensity: number; 
  isEmpty: boolean;
  rMultiple?: number;
}

interface TooltipState {
  isVisible: boolean;
  position: { top: number; left: number };
  content: {
    date: string;
    pnl: number;
    tradeCount: number;
    isEmpty: boolean;
    rMultiple?: number;
  } | null;
}

interface WeekData {
  days: DayData[];
}

interface DailyHeatmapDataOptions {
  trades: Trade[];
  year: number;
  defaultRiskAmount?: number;
  applyAccountCountMultiplier: boolean;
  rollingMode: boolean;
  rollingDateRange: { startDate: Date; endDate: Date } | null;
  plugin: ReturnType<typeof usePlugin>;
  analyticsDateBasis: 'entry' | 'exit';
}

const buildDailyHeatmapData = ({
  trades,
  year,
  defaultRiskAmount,
  applyAccountCountMultiplier,
  rollingMode,
  rollingDateRange,
  plugin,
  analyticsDateBasis,
}: DailyHeatmapDataOptions) => {
  const dailyPnL: {
    [dateString: string]: { pnl: number; count: number; rMultiple: number };
  } = {};
  trades.forEach((trade) => {
    if (!isPnlContributingTrade(trade)) return;
    const effectivePnL = getEffectivePnL(trade);
    if (effectivePnL === 0) return;

    const tradeDate = getTradeAnalyticsTradingDay(
      trade,
      analyticsDateBasis,
      plugin
    );
    if (!tradeDate) return;

    if (rollingMode && rollingDateRange) {
      if (
        tradeDate < rollingDateRange.startDate ||
        tradeDate > rollingDateRange.endDate
      )
        return;
    } else if (tradeDate.getFullYear() !== year) {
      return;
    }

    const dateString = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, '0')}-${String(tradeDate.getDate()).padStart(2, '0')}`;
    if (!dailyPnL[dateString])
      dailyPnL[dateString] = { pnl: 0, count: 0, rMultiple: 0 };

    const displayPnL = getDisplayPnL(
      effectivePnL,
      getAccountCount(trade),
      applyAccountCountMultiplier
    );
    dailyPnL[dateString].pnl += displayPnL;
    dailyPnL[dateString].count += 1;

    const effectiveRMultiple = calculateEffectiveRMultiple(
      displayPnL,
      trade.rMultiple,
      trade.riskAmount,
      defaultRiskAmount
    );
    if (effectiveRMultiple !== undefined && !isNaN(effectiveRMultiple)) {
      dailyPnL[dateString].rMultiple += effectiveRMultiple;
    }
  });

  return {
    dailyData: dailyPnL,
    maxAbsPnL: Math.max(
      ...Object.values(dailyPnL).map((d) => Math.abs(d.pnl)),
      1
    ),
  };
};

const buildHeatmapWeeks = (
  dailyData: Record<string, { pnl: number; count: number; rMultiple: number }>,
  maxAbsPnL: number,
  year: number,
  rollingMode: boolean,
  rollingDateRange: { startDate: Date; endDate: Date } | null
): WeekData[] => {
  const startDate =
    rollingMode && rollingDateRange
      ? rollingDateRange.startDate
      : new Date(year, 0, 1);
  const endDate =
    rollingMode && rollingDateRange
      ? rollingDateRange.endDate
      : new Date(year, 11, 31);
  const firstMonday = new Date(startDate);
  firstMonday.setDate(firstMonday.getDate() - ((firstMonday.getDay() + 6) % 7));
  const weeks: WeekData[] = [];
  const currentDate = new Date(firstMonday);

  while (
    currentDate <= endDate ||
    weeks.length === 0 ||
    weeks[weeks.length - 1].days.length < 7
  ) {
    const week: WeekData = { days: [] };
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const dayData = dailyData[dateString];
      const isInRange =
        rollingMode && rollingDateRange
          ? currentDate >= rollingDateRange.startDate &&
            currentDate <= rollingDateRange.endDate
          : currentDate.getFullYear() === year;
      const dayPnl = dayData?.pnl || 0;
      const tradeCount = dayData?.count || 0;
      const intensity =
        dayPnl !== 0 && isInRange
          ? Math.min(Math.ceil((Math.abs(dayPnl) / maxAbsPnL) * 4), 4)
          : 0;
      week.days.push({
        date: new Date(currentDate),
        dateString,
        pnl: dayPnl,
        tradeCount,
        intensity,
        isEmpty: !isInRange || tradeCount === 0,
        rMultiple: dayData?.rMultiple,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
    if (rollingMode) {
      if (currentDate > endDate && weeks[weeks.length - 1].days.length === 7)
        break;
    } else if (currentDate.getFullYear() > year && weeks.length >= 53) {
      break;
    }
  }
  return weeks;
};

const limitHeatmapWeeks = (
  weeksData: WeekData[],
  maxWeeks: number | undefined,
  rollingMode: boolean
): WeekData[] => {
  if (rollingMode) return weeksData;
  const validMaxWeeks =
    maxWeeks && Number.isFinite(maxWeeks) && maxWeeks > 0
      ? maxWeeks
      : undefined;
  return !validMaxWeeks || weeksData.length <= validMaxWeeks
    ? weeksData
    : weeksData.slice(-validMaxWeeks);
};

const getVisibleHeatmapMonths = (
  displayWeeks: WeekData[],
  rollingMode: boolean,
  rollingDateRange: { startDate: Date; endDate: Date } | null,
  year: number
) => {
  if (displayWeeks.length === 0) return [];
  const months: {
    month: number;
    year: number;
    startWeekIndex: number;
    weekCount: number;
  }[] = [];
  let currentMonthKey = '';
  let weekCount = 0;
  let startWeekIndex = 0;
  let lastMonth = -1;
  let lastYear = -1;

  displayWeeks.forEach((week, index) => {
    const representativeDay =
      week.days.find((d) =>
        rollingMode && rollingDateRange
          ? d.date >= rollingDateRange.startDate &&
            d.date <= rollingDateRange.endDate
          : d.date.getFullYear() === year
      ) || week.days[0];
    const month = representativeDay.date.getMonth();
    const monthYear = representativeDay.date.getFullYear();
    const monthKey = `${monthYear}-${month}`;
    if (monthKey !== currentMonthKey) {
      if (currentMonthKey !== '')
        months.push({
          month: lastMonth,
          year: lastYear,
          startWeekIndex,
          weekCount,
        });
      currentMonthKey = monthKey;
      lastMonth = month;
      lastYear = monthYear;
      startWeekIndex = index;
      weekCount = 1;
    } else {
      weekCount++;
    }
  });
  if (currentMonthKey !== '')
    months.push({
      month: lastMonth,
      year: lastYear,
      startWeekIndex,
      weekCount,
    });
  return months;
};

const getHeatmapDayColor = (day: DayData, isPnlMasked: boolean): string => {
  if (day.isEmpty || day.tradeCount === 0) return 'var(--heatmap-empty)';
  if (isPnlMasked) return 'var(--text-muted)';
  const prefix = day.pnl > 0 ? 'profit' : 'loss';
  return day.intensity >= 1 && day.intensity <= 4
    ? `var(--heatmap-${prefix}-${day.intensity})`
    : 'var(--heatmap-empty)';
};

const calculateHeatmapTooltipPosition = (
  event: { clientX: number; clientY: number },
  tooltipElement: HTMLDivElement | null
) => {
  if (!tooltipElement || !tooltipElement.offsetParent) {
    const estimatedWidth = 180;
    const estimatedHeight = 100;
    const margin = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = event.clientX + 20;
    let top = event.clientY - 10;
    if (left + estimatedWidth > viewportWidth - margin)
      left = event.clientX - estimatedWidth - 20;
    if (top + estimatedHeight > viewportHeight - margin)
      top = event.clientY - estimatedHeight - 10;
    left = Math.max(
      margin,
      Math.min(left, viewportWidth - estimatedWidth - margin)
    );
    top = Math.max(
      margin,
      Math.min(top, viewportHeight - estimatedHeight - margin)
    );
    return { top, left };
  }

  const tooltipRect = tooltipElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const margin = 16;
  const horizontalOffset = 20;
  const verticalOffset = 10;
  const minClearance = 25;
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;
  let left = cursorX + horizontalOffset;
  let top = cursorY + verticalOffset;

  if (left + tooltipWidth > viewportWidth - margin)
    left = cursorX - tooltipWidth - horizontalOffset;
  if (top + tooltipHeight > viewportHeight - margin)
    top = cursorY - tooltipHeight - verticalOffset;
  if (
    left + tooltipWidth > viewportWidth - margin &&
    top + tooltipHeight > viewportHeight - margin
  ) {
    left = cursorX - tooltipWidth - horizontalOffset;
    top = cursorY - tooltipHeight - verticalOffset;
  }
  if (left < margin) {
    left = margin;
    if (Math.abs(left + tooltipWidth / 2 - cursorX) < minClearance) {
      top =
        top > cursorY
          ? Math.max(cursorY + minClearance, top)
          : Math.min(cursorY - minClearance - tooltipHeight, top);
    }
  }
  if (top < margin) {
    top = margin;
    if (Math.abs(top + tooltipHeight / 2 - cursorY) < minClearance) {
      left =
        left > cursorX
          ? Math.max(cursorX + minClearance, left)
          : Math.min(cursorX - minClearance - tooltipWidth, left);
    }
  }

  const distanceFromCursor = Math.sqrt(
    Math.pow(left + tooltipWidth / 2 - cursorX, 2) +
      Math.pow(top + tooltipHeight / 2 - cursorY, 2)
  );
  if (distanceFromCursor < minClearance) {
    if (cursorX < viewportWidth / 2 && cursorY < viewportHeight / 2) {
      left = Math.min(
        cursorX + minClearance,
        viewportWidth - tooltipWidth - margin
      );
      top = Math.min(
        cursorY + minClearance,
        viewportHeight - tooltipHeight - margin
      );
    } else if (cursorX >= viewportWidth / 2 && cursorY < viewportHeight / 2) {
      left = Math.max(cursorX - tooltipWidth - minClearance, margin);
      top = Math.min(
        cursorY + minClearance,
        viewportHeight - tooltipHeight - margin
      );
    } else if (cursorX < viewportWidth / 2 && cursorY >= viewportHeight / 2) {
      left = Math.min(
        cursorX + minClearance,
        viewportWidth - tooltipWidth - margin
      );
      top = Math.max(cursorY - tooltipHeight - minClearance, margin);
    } else {
      left = Math.max(cursorX - tooltipWidth - minClearance, margin);
      top = Math.max(cursorY - tooltipHeight - minClearance, margin);
    }
  }

  left = Math.max(
    margin,
    Math.min(left, viewportWidth - tooltipWidth - margin)
  );
  top = Math.max(
    margin,
    Math.min(top, viewportHeight - tooltipHeight - margin)
  );
  if (isNaN(left) || isNaN(top)) {
    return {
      top: Math.max(cursorY + verticalOffset, margin),
      left: Math.max(cursorX + horizontalOffset, margin),
    };
  }
  return { top, left };
};

interface HeatmapMonthLabelsProps {
  visibleMonths: ReturnType<typeof getVisibleHeatmapMonths>;
  displayWeeksCount: number;
}

const HeatmapMonthLabels: React.FC<HeatmapMonthLabelsProps> = ({
  visibleMonths,
  displayWeeksCount,
}) => (
  <div
    className="heatmap-month-row"
    style={cssVars({
      '--heatmap-max-width': `${displayWeeksCount * (11 + 3)}px`,
    })}
  >
    {visibleMonths.map((monthData) => {
      const monthKey = `calendar.month.${new Date(
        monthData.year,
        monthData.month,
        1
      )
        .toLocaleDateString('en-US', { month: 'short' })
        .toLowerCase()}`;
      const monthLabel = hasTranslation(monthKey) ? t(monthKey) : monthKey;
      const minimumLabelWeeks = Math.ceil(
        Math.max(24, monthLabel.length * 6 + 8) / 14
      );
      const shouldShowMonthLabel = monthData.weekCount >= minimumLabelWeeks;
      return (
        <div
          key={`${monthData.year}-${monthData.month}`}
          className="heatmap-month-label"
          style={cssVars({
            '--heatmap-month-width': `${monthData.weekCount * 14}px`,
          })}
        >
          {shouldShowMonthLabel ? monthLabel : ''}
        </div>
      );
    })}
  </div>
);

interface HeatmapGridProps {
  displayWeeks: WeekData[];
  onDayClick?: (date: Date) => void;
  getDayColor: (day: DayData) => string;
  handleDayClick: (day: DayData) => void;
  showTooltip: (event: React.MouseEvent, day: DayData) => void;
  hideTooltip: () => void;
  updateTooltipPosition: (event: React.MouseEvent) => void;
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  displayWeeks,
  onDayClick,
  getDayColor,
  handleDayClick,
  showTooltip,
  hideTooltip,
  updateTooltipPosition,
}) => (
  <div className="heatmap-grid">
    <div className="heatmap-days">
      <div className="heatmap-day-label">{t('calendar.day.mon')}</div>
      <div className="heatmap-day-spacer" />
      <div className="heatmap-day-label">{t('calendar.day.wed')}</div>
      <div className="heatmap-day-spacer" />
      <div className="heatmap-day-label">{t('calendar.day.fri')}</div>
      <div className="heatmap-day-spacer" />
      <div className="heatmap-day-label">{t('calendar.day.sun')}</div>
    </div>
    <div className="heatmap-weeks">
      {displayWeeks.map((week, weekIndex) => (
        <div key={weekIndex} className="heatmap-week">
          {week.days.map((day, dayIndex) => {
            const isActionable = Boolean(onDayClick && day.tradeCount > 0);
            const interactiveProps = isActionable
              ? {
                  onClick: () => handleDayClick(day),
                  onKeyDown: (event: React.KeyboardEvent) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    handleDayClick(day);
                  },
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': t('calendar.aria.open-daily-review', {
                    date: day.dateString,
                  }),
                }
              : {};
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`heatmap-cell ${isActionable ? 'clickable' : ''}`}
                onMouseEnter={(event) => showTooltip(event, day)}
                onMouseLeave={hideTooltip}
                onMouseMove={updateTooltipPosition}
                style={cssVars({
                  '--heatmap-cell-bg': getDayColor(day),
                  '--heatmap-cell-border': day.isEmpty
                    ? 'none'
                    : `1px solid rgba(var(--background-modifier-border-rgb, 55, 53, 47), 0.08)`,
                })}
                {...interactiveProps}
              />
            );
          })}
        </div>
      ))}
    </div>
  </div>
);

const HeatmapLegend: React.FC<{ isPnlMasked: boolean }> = ({ isPnlMasked }) => (
  <div className="heatmap-legend-row">
    <span className="heatmap-legend">{t('calendar.legend.less')}</span>
    <div className="heatmap-legend-cells">
      <div className="heatmap-legend-cell heatmap-legend-cell--empty" />
      {[1, 2, 3, 4].map((intensity) => (
        <div
          key={intensity}
          className={`heatmap-legend-cell ${
            isPnlMasked
              ? 'heatmap-legend-cell--masked-active'
              : `heatmap-legend-cell--profit-${intensity}`
          }`}
        />
      ))}
    </div>
    <span className="heatmap-legend">{t('calendar.legend.more')}</span>
  </div>
);

interface HeatmapTooltipPortalProps {
  isMounted: boolean;
  tooltip: TooltipState;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  isPnlMasked: boolean;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
  currency: string;
}

const HeatmapTooltipPortal: React.FC<HeatmapTooltipPortalProps> = ({
  isMounted,
  tooltip,
  tooltipRef,
  isPnlMasked,
  formatValue,
  currency,
}) => {
  if (!isMounted || !tooltip.content) return null;
  return createPortal(
    <div
      ref={tooltipRef}
      className={`journalit-heatmap-tooltip${tooltip.isVisible ? ' is-visible' : ''}`}
      style={cssVars({
        '--heatmap-tooltip-top': `${tooltip.position.top}px`,
        '--heatmap-tooltip-left': `${tooltip.position.left}px`,
      })}
    >
      <div className="heatmap-tooltip-date">{tooltip.content.date}</div>
      {!tooltip.content.isEmpty && (
        <div
          className={`heatmap-tooltip-value ${
            isPnlMasked
              ? ''
              : tooltip.content.pnl > 0
                ? 'positive'
                : tooltip.content.pnl < 0
                  ? 'negative'
                  : ''
          }`}
        >
          {formatValue({
            kind: 'pnl',
            value: tooltip.content.pnl,
            currencyCode: currency,
            rMultiple: tooltip.content.rMultiple,
          })}
        </div>
      )}
      <div className="heatmap-tooltip-info">
        {tooltip.content.isEmpty
          ? 'No trades'
          : `${tooltip.content.tradeCount} trade${tooltip.content.tradeCount === 1 ? '' : 's'}`}
      </div>
    </div>,
    window.activeDocument.body
  );
};

const useHeatmapTooltipState = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    isVisible: false,
    position: { top: -9999, left: -9999 },
    content: null,
  });
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const unmountTimeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastMouseMoveTime = useRef<number>(0);
  const pendingTooltipUpdate = useRef<boolean>(false);
  const lastCursorPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorDeadZoneRadius = 25;
  const lastMouseEvent = useRef<{ clientX: number; clientY: number } | null>(
    null
  );

  const calculateTooltipPosition = useCallback(
    (event: { clientX: number; clientY: number }) =>
      calculateHeatmapTooltipPosition(event, tooltipRef.current),
    []
  );

  const showTooltip = useCallback(
    (event: React.MouseEvent, day: DayData) => {
      if (unmountTimeoutRef.current) {
        window.clearTimeout(unmountTimeoutRef.current);
        unmountTimeoutRef.current = null;
      }
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      const dateStr = day.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      lastMouseEvent.current = {
        clientX: event.clientX,
        clientY: event.clientY,
      };
      setTooltip({
        isVisible: false,
        position: { top: -9999, left: -9999 },
        content: {
          date: dateStr,
          pnl: day.pnl,
          tradeCount: day.tradeCount,
          isEmpty: day.isEmpty || day.tradeCount === 0,
          rMultiple: day.rMultiple,
        },
      });
      setIsMounted(true);
      lastCursorPosition.current = { x: event.clientX, y: event.clientY };
      timeoutRef.current = window.setTimeout(() => {
        const position = calculateTooltipPosition(event);
        setTooltip((prev) => ({ ...prev, isVisible: true, position }));
      }, 100);
    },
    [calculateTooltipPosition]
  );

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastMouseEvent.current = null;
    setTooltip((prev) => ({ ...prev, isVisible: false }));
    if (unmountTimeoutRef.current)
      window.clearTimeout(unmountTimeoutRef.current);
    unmountTimeoutRef.current = window.setTimeout(() => {
      setIsMounted(false);
      unmountTimeoutRef.current = null;
    }, 200);
  }, []);

  const updateTooltipPosition = useCallback(
    (event: React.MouseEvent) => {
      if (!tooltip.isVisible || !isMounted) return;
      const currentCursorX = event.clientX;
      const currentCursorY = event.clientY;
      const cursorDistance = Math.sqrt(
        Math.pow(currentCursorX - lastCursorPosition.current.x, 2) +
          Math.pow(currentCursorY - lastCursorPosition.current.y, 2)
      );
      if (cursorDistance < cursorDeadZoneRadius) return;

      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveTime.current;
      if (timeSinceLastMove < 32 && !pendingTooltipUpdate.current) {
        pendingTooltipUpdate.current = true;
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        rafRef.current = window.requestAnimationFrame(() => {
          const position = calculateTooltipPosition(event);
          setTooltip((prev) => ({ ...prev, position }));
          lastMouseMoveTime.current = Date.now();
          lastCursorPosition.current = { x: currentCursorX, y: currentCursorY };
          pendingTooltipUpdate.current = false;
        });
      } else if (timeSinceLastMove >= 32) {
        const position = calculateTooltipPosition(event);
        setTooltip((prev) => ({ ...prev, position }));
        lastMouseMoveTime.current = now;
        lastCursorPosition.current = { x: currentCursorX, y: currentCursorY };
      }
    },
    [
      tooltip.isVisible,
      isMounted,
      calculateTooltipPosition,
      cursorDeadZoneRadius,
    ]
  );

  useLayoutEffect(() => {
    if (tooltip.isVisible && tooltipRef.current && lastMouseEvent.current) {
      const recalcRAF = window.requestAnimationFrame(() => {
        if (tooltipRef.current && lastMouseEvent.current) {
          const newPosition = calculateTooltipPosition(lastMouseEvent.current);
          if (
            newPosition.top !== tooltip.position.top ||
            newPosition.left !== tooltip.position.left
          ) {
            setTooltip((prev) => ({ ...prev, position: newPosition }));
          }
        }
      });
      return () => window.cancelAnimationFrame(recalcRAF);
    }
  }, [tooltip.isVisible, calculateTooltipPosition]); // eslint-disable-line react-hooks/exhaustive-deps -- tooltip visibility drives recalculation; position callback is memoized separately

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      if (unmountTimeoutRef.current)
        window.clearTimeout(unmountTimeoutRef.current);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    tooltip,
    isMounted,
    tooltipRef,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
  };
};

const ContributionsHeatmapComponent: React.FC<ContributionsHeatmapProps> = ({
  trades,
  year = new Date().getFullYear(),
  onDayClick,
  height = '100%',
  maxWeeks,
  rollingMode = false,
}) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const plugin = usePlugin();
  const analyticsDateBasis =
    plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';
  const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
  const applyAccountCountMultiplier = false;

  const {
    tooltip,
    isMounted,
    tooltipRef,
    showTooltip,
    hideTooltip,
    updateTooltipPosition,
  } = useHeatmapTooltipState();

  
  const rollingDateRange = useMemo(() => {
    if (!rollingMode || !maxWeeks) return null;

    const today = new Date();
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    
    
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (maxWeeks * 7 - 1));
    startDate.setHours(0, 0, 0, 0);

    return { startDate, endDate };
  }, [rollingMode, maxWeeks]);

  const { dailyData, maxAbsPnL } = useMemo(
    () =>
      buildDailyHeatmapData({
        trades,
        year,
        defaultRiskAmount,
        applyAccountCountMultiplier,
        rollingMode,
        rollingDateRange,
        plugin,
        analyticsDateBasis,
      }),
    [
      trades,
      year,
      defaultRiskAmount,
      applyAccountCountMultiplier,
      rollingMode,
      rollingDateRange,
      plugin,
      analyticsDateBasis,
    ]
  );

  const weeksData = useMemo(
    () =>
      buildHeatmapWeeks(
        dailyData,
        maxAbsPnL,
        year,
        rollingMode,
        rollingDateRange
      ),
    [dailyData, maxAbsPnL, year, rollingMode, rollingDateRange]
  );

  const displayWeeks = useMemo(
    () => limitHeatmapWeeks(weeksData, maxWeeks, rollingMode),
    [weeksData, maxWeeks, rollingMode]
  );

  const visibleMonths = useMemo(
    () =>
      getVisibleHeatmapMonths(
        displayWeeks,
        rollingMode,
        rollingDateRange,
        year
      ),
    [displayWeeks, rollingMode, rollingDateRange, year]
  );

  const getDayColor = useCallback(
    (day: DayData): string => getHeatmapDayColor(day, isPnlMasked),
    [isPnlMasked]
  );

  const handleDayClick = useCallback(
    (day: DayData) => {
      if (day.tradeCount > 0 && onDayClick) {
        onDayClick(day.date);
      }
    },
    [onDayClick]
  );

  return (
    <>
      

      <div
        className="contributions-heatmap heatmap-container"
        style={cssVars({
          '--heatmap-height':
            typeof height === 'number' ? `${height}px` : String(height),
        })}
      >
        <HeatmapMonthLabels
          visibleMonths={visibleMonths}
          displayWeeksCount={displayWeeks.length}
        />
        <HeatmapGrid
          displayWeeks={displayWeeks}
          onDayClick={onDayClick}
          getDayColor={getDayColor}
          handleDayClick={handleDayClick}
          showTooltip={showTooltip}
          hideTooltip={hideTooltip}
          updateTooltipPosition={updateTooltipPosition}
        />
        <HeatmapLegend isPnlMasked={isPnlMasked} />
      </div>

      <HeatmapTooltipPortal
        isMounted={isMounted}
        tooltip={tooltip}
        tooltipRef={tooltipRef}
        isPnlMasked={isPnlMasked}
        formatValue={formatValue}
        currency={currency}
      />
    </>
  );
};

export const ContributionsHeatmap = React.memo(ContributionsHeatmapComponent);
