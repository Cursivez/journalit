

import React, { memo } from 'react';
import { TimeNode } from '../../services/tradelog/types';
import { calculateEffectiveRMultiple } from '../../utils/formatting';
import {
  formatGroupedPnL,
  CurrencyGroupedPnL,
} from '../../utils/currencyAggregation';
import { TradeDetailsRow } from './TradeDetailsRow';
import { TradeLogMiniHeader } from './TradeLogMiniHeader';
import {
  getWeekNumberForDate,
  getWeekStartDaySetting,
  type WeekStartDaySetting,
} from '../../utils/dateUtils';
import { useCurrency } from '../../contexts/CurrencyContext';
import { usePlugin } from '../../hooks/usePlugin';
import { useDisplayFormatter } from '../../hooks/useDisplayPolicy';
import { ColumnDefinition } from './columnConfig';
import { t } from '../../lang/helpers';
import { cssVars } from '../../styles/inlineStylePolicy';

interface TradeLogNodeProps {
  node: TimeNode;
  depth: number;
  isExpanded: boolean;
  isLastChild?: boolean;
  onToggleExpand: (node: TimeNode) => void;
  onNodeClick: (node: TimeNode) => void;
  viewLevel?: 'years' | 'quarters' | 'months' | 'weeks' | 'days' | 'trades';
  visibleColumns?: ColumnDefinition[];
  gridTemplate?: string;
  selectedTrades?: Set<string>;
  onToggleTradeSelection?: (tradeId: string) => void;
  isMultiSelectMode?: boolean;
  isExpandedMode?: boolean;
}

export const TradeLogNode = memo<TradeLogNodeProps>(
  ({
    node,
    depth,
    isExpanded,
    isLastChild = false,
    onToggleExpand,
    onNodeClick,
    viewLevel,
    visibleColumns,
    gridTemplate,
    selectedTrades,
    onToggleTradeSelection,
    isMultiSelectMode,
    isExpandedMode,
  }) => {
    const { currency } = useCurrency();
    const plugin = usePlugin();
    const displayRMultiples = plugin?.settings?.trade?.displayRMultiples;
    const defaultRiskAmount = plugin?.settings?.trade?.defaultRiskAmount;
    const weekStartDay = getWeekStartDaySetting(plugin ?? undefined);
    const { formatValue, shouldMask } = useDisplayFormatter();
    const isPnlMasked = shouldMask('pnl');
    const isPercentageMasked = shouldMask('percentage');

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleExpand(node);
    };

    const navigateToReviewNode = (e: React.MouseEvent) => {
      e.stopPropagation();
      onNodeClick(node);
    };

    const hasChildren = node.children && node.children.length > 0;
    const canExpand =
      node.type !== 'trade' && (hasChildren || !node.dataLoaded);

    
    if (node.type === 'trade-group-header') {
      return (
        <TradeLogMiniHeader
          visibleColumns={visibleColumns || []}
          gridTemplate={gridTemplate || ''}
          depth={depth}
          isMultiSelectMode={isMultiSelectMode}
        />
      );
    }

    
    if (node.type === 'trade') {
      const tradeId = node.trade?.file?.path || node.trade?.filePath || '';
      return (
        <TradeDetailsRow
          trade={node.trade}
          depth={depth}
          isLastChild={isLastChild}
          onClick={() => onNodeClick(node)}
          viewLevel={viewLevel}
          visibleColumns={visibleColumns}
          gridTemplate={gridTemplate}
          isSelected={selectedTrades?.has(tradeId) || false}
          onToggleSelection={onToggleTradeSelection}
          isMultiSelectMode={isMultiSelectMode}
          isExpandedMode={isExpandedMode}
        />
      );
    }

    
    return (
      <div
        className={`trade-log-node trade-log-node--${node.type} ${isLastChild ? 'is-last-child' : ''}`}
      >
        
        <div
          className="tree-structure"
          style={cssVars({
            '--journalit-tree-structure-width': `${depth * 24}px`,
          })}
        >
          {Array.from({ length: depth }).map((_, i) => (
            <span
              key={i}
              className={`tree-level ${i === depth - 1 && isLastChild ? 'last-level' : ''}`}
            />
          ))}
        </div>

        <div className="node-wrapper">
          
          {depth > 0 && <span className="tree-connector" />}

          <div className="node-content">
            
            <div className="tree-expand-wrapper">
              {canExpand ? (
                <button
                  className={`node-chevron ${isExpanded ? 'expanded' : ''}`}
                  onClick={handleToggle}
                  aria-label={
                    isExpanded
                      ? t('tradelog.node.collapse')
                      : t('tradelog.node.expand')
                  }
                >
                  {isExpanded ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="3.5"
                        y="3.5"
                        width="9"
                        height="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        rx="1"
                      />
                      <path
                        d="M6 8H10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect
                        x="3.5"
                        y="3.5"
                        width="9"
                        height="9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        rx="1"
                      />
                      <path
                        d="M8 6V10M6 8H10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                <span className="tree-leaf-node" />
              )}
            </div>

            
            <span
              className="node-label clickable-icon"
              role="button"
              tabIndex={0}
              onClick={navigateToReviewNode}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                e.stopPropagation();
                onNodeClick(node);
              }}
              aria-label={t('tradelog.node.navigate-to-review', {
                type: node.type,
              })}
            >
              {node.label}
              
              {node.performanceIndicator && (
                <span
                  className={`performance-indicator performance-indicator--${node.performanceIndicator} clickable-icon`}
                  aria-label={getPerformanceTooltip(node, weekStartDay)}
                >
                  {node.performanceIndicator === 'best' ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9H4.5a2.5 2.5 0 0 1 0-5C5.5 4 6 4.5 6 5v4zM18 9h1.5a2.5 2.5 0 0 0 0-5c-1 0-1.5.5-1.5 1v4z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 22h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 2H6v7a6 6 0 0 0 12 0V2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="12"
                        y1="9"
                        x2="12"
                        y2="13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="12"
                        y1="17"
                        x2="12.01"
                        y2="17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              )}
            </span>

            
            <div className="node-metrics">
              
              <div className="metric-column metric-column--count">
                <span className="metric metric--count">
                  {node.metrics.tradeCount}{' '}
                  {node.metrics.tradeCount === 1
                    ? t('common.trade')
                    : t('common.trades')}
                </span>
              </div>

              
              <div className="metric-column metric-column--winrate">
                <span
                  className={`metric metric--winrate ${
                    isPercentageMasked
                      ? ''
                      : getWinRateClass(node.metrics.winRate)
                  }`}
                >
                  {formatValue({
                    kind: 'percentage',
                    value: node.metrics.winRate,
                    precision: 1,
                  })}
                </span>
              </div>

              
              <div className="metric-column metric-column--pnl">
                <span
                  className={`metric metric--pnl ${
                    isPnlMasked
                      ? ''
                      : node.metrics.totalPnL > 0
                        ? 'positive'
                        : node.metrics.totalPnL < 0
                          ? 'negative'
                          : 'neutral'
                  }`}
                >
                  {(() => {
                    if (isPnlMasked) {
                      return formatValue({
                        kind: 'pnl',
                        value: node.metrics.totalPnL,
                        currencyCode: currency,
                      });
                    }
                    
                    if (
                      node.metrics.isMultiCurrency &&
                      node.metrics.totalPnLByCurrency &&
                      !displayRMultiples
                    ) {
                      const grouped: CurrencyGroupedPnL = {
                        byCurrency: node.metrics.totalPnLByCurrency,
                        isMultiCurrency: true,
                        currencies: Object.keys(
                          node.metrics.totalPnLByCurrency
                        ).sort(),
                        defaultCurrency: node.metrics.primaryCurrency || 'USD',
                      };
                      const formatted = formatGroupedPnL(grouped, true);
                      return Array.isArray(formatted)
                        ? formatted.join(' | ')
                        : formatted;
                    }
                    
                    return formatValue({
                      kind: 'pnl',
                      value: node.metrics.totalPnL,
                      currencyCode: currency,
                      rMultiple: calculateEffectiveRMultiple(
                        node.metrics.totalPnL,
                        node.metrics.totalRMultiple,
                        undefined,
                        defaultRiskAmount
                      ),
                    });
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TradeLogNode.displayName = 'TradeLogNode';


function getWinRateClass(winRate: number): string {
  if (winRate >= 60) return 'high';
  if (winRate >= 40) return 'medium';
  return 'low';
}


const monthTranslationKeys = [
  'common.month.january',
  'common.month.february',
  'common.month.march',
  'common.month.april',
  'common.month.may',
  'common.month.june',
  'common.month.july',
  'common.month.august',
  'common.month.september',
  'common.month.october',
  'common.month.november',
  'common.month.december',
] as const;


function getPerformanceTooltip(
  node: TimeNode,
  weekStartDay: WeekStartDaySetting
): string {
  const indicator =
    node.performanceIndicator === 'best' ? t('common.best') : t('common.worst');

  switch (node.type) {
    case 'year':
      return t('tradelog.node.performance.year', { indicator });
    case 'quarter': {
      
      const quarterYear = node.id.split('-')[0];
      return t('tradelog.node.performance.quarter', {
        indicator,
        year: quarterYear,
      });
    }
    case 'month': {
      
      const [monthYear, monthNum] = node.id.split('-');
      const quarter = Math.ceil(parseInt(monthNum) / 3);
      return t('tradelog.node.performance.month', {
        indicator,
        quarter: `Q${quarter}`,
        year: monthYear,
      });
    }
    case 'week': {
      
      const parts = node.id.split('-W');
      const yearMonth = parts[0]; 
      const [weekYear, weekMonth] = yearMonth.split('-');
      const monthNumber = parseInt(weekMonth, 10);
      const monthIndex = Number.isFinite(monthNumber)
        ? Math.max(monthNumber - 1, 0)
        : 0;
      const monthName = t(monthTranslationKeys[monthIndex]);
      return t('tradelog.node.performance.week', {
        indicator,
        month: monthName,
        year: weekYear,
      });
    }
    case 'day': {
      
      const dayParts = node.id.split('-');
      const dayDate = new Date(
        parseInt(dayParts[0]),
        parseInt(dayParts[1]) - 1,
        parseInt(dayParts[2])
      );
      const dayWeekNum = getWeekNumberForDate(dayDate, weekStartDay);
      return t('tradelog.node.performance.day', {
        indicator,
        week: `W${dayWeekNum}`,
        year: dayParts[0],
      });
    }
    default:
      return t('tradelog.node.performance.period', { indicator });
  }
}
