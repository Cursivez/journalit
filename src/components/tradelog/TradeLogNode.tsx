

import React, { memo, useId } from 'react';
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
import { Tooltip } from '../shared/Tooltip';
import { Tag } from '../shared/icons/ObsidianIcon';
import { getSessionLogTags } from '../sessionLog/sessionLogUtils';
import { mergeClassNames } from '../../utils/classNames';

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

type TradeLogPnlMetricInput = {
  metrics: TimeNode['metrics'];
  isPnlMasked: boolean;
  displayRMultiples: boolean | undefined;
  defaultRiskAmount: number | undefined;
  currency: string;
  formatValue: ReturnType<typeof useDisplayFormatter>['formatValue'];
};

function formatNodePnl({
  metrics,
  isPnlMasked,
  displayRMultiples,
  defaultRiskAmount,
  currency,
  formatValue,
}: TradeLogPnlMetricInput): string {
  if (isPnlMasked) {
    return formatValue({
      kind: 'pnl',
      value: metrics.totalPnL,
      currencyCode: currency,
    });
  }
  
  if (
    metrics.isMultiCurrency &&
    metrics.totalPnLByCurrency &&
    !displayRMultiples
  ) {
    const grouped: CurrencyGroupedPnL = {
      byCurrency: metrics.totalPnLByCurrency,
      isMultiCurrency: true,
      currencies: Object.keys(metrics.totalPnLByCurrency).sort(),
      defaultCurrency: metrics.primaryCurrency || 'USD',
    };
    const formatted = formatGroupedPnL(grouped, true);
    return Array.isArray(formatted) ? formatted.join(' | ') : formatted;
  }
  
  return formatValue({
    kind: 'pnl',
    value: metrics.totalPnL,
    currencyCode: currency,
    rMultiple: calculateEffectiveRMultiple(
      metrics.totalPnL,
      metrics.totalRMultiple,
      undefined,
      defaultRiskAmount
    ),
  });
}

function pnlToneClass(totalPnL: number, isPnlMasked: boolean): string {
  if (isPnlMasked) return '';
  if (totalPnL > 0) return 'positive';
  if (totalPnL < 0) return 'negative';
  return 'neutral';
}

const TradeLogNodeMetrics: React.FC<{ node: TimeNode }> = ({ node }) => {
  const { currency } = useCurrency();
  const plugin = usePlugin();
  const tradeSettings = plugin?.settings?.trade;
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isPnlMasked = shouldMask('pnl');
  const isPercentageMasked = shouldMask('percentage');
  const winRateClass = isPercentageMasked
    ? ''
    : getWinRateClass(node.metrics.winRate);

  return (
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
        <span className={`metric metric--winrate ${winRateClass}`}>
          {formatValue({
            kind: 'percentage',
            value: node.metrics.winRate,
            precision: 1,
          })}
        </span>
      </div>

      
      <div className="metric-column metric-column--pnl">
        <span
          className={`metric metric--pnl ${pnlToneClass(node.metrics.totalPnL, isPnlMasked)}`}
        >
          {formatNodePnl({
            metrics: node.metrics,
            isPnlMasked,
            displayRMultiples: tradeSettings?.displayRMultiples,
            defaultRiskAmount: tradeSettings?.defaultRiskAmount,
            currency,
            formatValue,
          })}
        </span>
      </div>
    </div>
  );
};

const TradeLogPerformanceIcon: React.FC<{
  indicator: NonNullable<TimeNode['performanceIndicator']>;
}> = ({ indicator }) =>
  indicator === 'best' ? (
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
  );

const TradeLogNodeSessionTags: React.FC<{ node: TimeNode }> = ({ node }) => {
  const plugin = usePlugin();
  const sessionLogTags = getSessionLogTagDisplayItems(node, plugin);
  const sessionLogTagsLabelId = useId();

  if (sessionLogTags.length === 0) {
    return null;
  }

  return (
    <Tooltip
      content={
        <div className="journalit-trade-tags-tooltip">
          <div className="tooltip-title">
            {t('filter.modal.session-tags.placeholder')}
          </div>
          {sessionLogTags.map((tag) => (
            <div key={tag.id} className="tooltip-item">
              • {tag.label}
            </div>
          ))}
        </div>
      }
      delay={0}
      preferredPosition="top"
      triggerClassName="trade-log-session-tags-tooltip-trigger"
    >
      <span
        className="trade-log-session-tags-indicator"
        aria-labelledby={sessionLogTagsLabelId}
        role="img"
        tabIndex={0}
      >
        <Tag size={16} aria-hidden="true" />
        <span
          id={sessionLogTagsLabelId}
          className="trade-log-session-tags-accessible-label"
        >
          {t('filter.modal.session-tags.placeholder')}:{' '}
          {sessionLogTags.map((tag) => tag.label).join(', ')}
        </span>
      </span>
    </Tooltip>
  );
};

const TradeLogNodeExpandToggle: React.FC<{
  node: TimeNode;
  isExpanded: boolean;
  onToggleExpand: (node: TimeNode) => void;
}> = ({ node, isExpanded, onToggleExpand }) => {
  const hasChildren = node.children && node.children.length > 0;
  const canExpand = hasChildren || !node.dataLoaded;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node);
  };

  if (!canExpand) {
    return <span className="tree-leaf-node" />;
  }

  return (
    <button
      className={mergeClassNames(
        'journalit-native-button',
        `node-chevron ${isExpanded ? 'expanded' : ''}`
      )}
      onClick={handleToggle}
      aria-label={
        isExpanded ? t('tradelog.node.collapse') : t('tradelog.node.expand')
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
  );
};

type TradeLogPeriodNodeProps = Pick<
  TradeLogNodeProps,
  'node' | 'depth' | 'isExpanded' | 'onToggleExpand' | 'onNodeClick'
> & { isLastChild: boolean };

const TradeLogPeriodNode: React.FC<TradeLogPeriodNodeProps> = ({
  node,
  depth,
  isExpanded,
  isLastChild,
  onToggleExpand,
  onNodeClick,
}) => {
  const plugin = usePlugin();
  const weekStartDay = getWeekStartDaySetting(plugin ?? undefined);

  const navigateToReviewNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

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
            <TradeLogNodeExpandToggle
              node={node}
              isExpanded={isExpanded}
              onToggleExpand={onToggleExpand}
            />
          </div>

          
          <button
            type="button"
            className="journalit-native-button journalit-native-button--unstyled node-label"
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
                <TradeLogPerformanceIcon
                  indicator={node.performanceIndicator}
                />
              </span>
            )}
          </button>

          <TradeLogNodeSessionTags node={node} />

          <TradeLogNodeMetrics node={node} />
        </div>
      </div>
    </div>
  );
};

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
    
    if (node.type === 'trade-group-header') {
      return (
        <TradeLogMiniHeader
          visibleColumns={visibleColumns ?? []}
          gridTemplate={gridTemplate ?? ''}
          depth={depth}
          isMultiSelectMode={isMultiSelectMode}
        />
      );
    }

    
    if (node.type === 'trade') {
      const rawTrade = node.trade;
      if (!rawTrade) {
        return null;
      }
      return (
        <TradeDetailsRow
          trade={rawTrade}
          depth={depth}
          isLastChild={isLastChild}
          onClick={() => onNodeClick(node)}
          viewLevel={viewLevel}
          visibleColumns={visibleColumns}
          gridTemplate={gridTemplate}
          isSelected={isTradeSelected(rawTrade, selectedTrades)}
          onToggleSelection={onToggleTradeSelection}
          isMultiSelectMode={isMultiSelectMode}
          isExpandedMode={isExpandedMode}
        />
      );
    }

    return (
      <TradeLogPeriodNode
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isLastChild={isLastChild}
        onToggleExpand={onToggleExpand}
        onNodeClick={onNodeClick}
      />
    );
  }
);

TradeLogNode.displayName = 'TradeLogNode';

function getSessionLogTagDisplayItems(
  node: TimeNode,
  plugin: ReturnType<typeof usePlugin>
): Array<{ id: string; label: string }> {
  if (node.type !== 'day' || !node.sessionLogTagIds?.length) {
    return [];
  }

  if (!plugin) {
    return [];
  }

  const tagIds = new Set(node.sessionLogTagIds);
  const configuredTags = getSessionLogTags(plugin);
  const displayTags: Array<{ id: string; label: string }> = [];
  for (const tag of configuredTags) {
    if (tagIds.has(tag.id)) {
      displayTags.push({ id: tag.id, label: tag.label });
    }
  }

  return displayTags;
}

function isTradeSelected(
  trade: NonNullable<TimeNode['trade']>,
  selectedTrades: Set<string> | undefined
): boolean {
  const tradeId = trade.file?.path || trade.filePath || '';
  return selectedTrades?.has(tradeId) ?? false;
}


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
      const calendarId = node.parentPeriodId ?? node.anchorDate;
      if (!calendarId) {
        return t('tradelog.node.performance.period', { indicator });
      }
      const [weekYear, weekMonth] = calendarId.split('-');
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
