

import React from 'react';
import { TFile } from 'obsidian';
import { normalizeTradeExecution } from '../../services/trade/core/TradeExecutionNormalization';
import { isSameTradingDay } from '../../utils/tradingDayUtils';
import {
  getEffectivePnL,
  isTradeOpenWithContext,
} from '../../utils/tradeStatusUtils';
import { t } from '../../lang/helpers';
import { parseTradeDividendTransactions } from '../../utils/tradeUtils';
import { usePlugin } from '../../hooks';

interface TradeTimelineProps {
  trades: TFile[];
  currentTradePath: string;
  onTradeClick: (tradePath: string) => void;
  isMissedTrades?: boolean;
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;

const getStringField = (
  record: Record<string, unknown>,
  key: string
): string | undefined =>
  typeof record[key] === 'string' ? record[key] : undefined;

const getBooleanField = (
  record: Record<string, unknown>,
  key: string
): boolean | undefined =>
  typeof record[key] === 'boolean'
    ? record[key]
    : record[key] === 'true'
      ? true
      : undefined;

interface TradeItem {
  file: TFile;
  ticker: string;
  tradeNumber: number;
  isActive: boolean;
  pnl: number; 
  isMissedTrade: boolean; 
  isBacktestTrade: boolean; 
  isOpen: boolean; 
}

const getTimelineItemToneClass = (item: TradeItem): string => {
  if (item.isOpen) return 'open';
  if (item.pnl > 0) return 'profit';
  if (item.pnl < 0) return 'loss';
  return '';
};

const getTimelineItemPrefix = (item: TradeItem): string =>
  item.isMissedTrade ? 'M' : item.isBacktestTrade ? 'B' : 'T';

const getTimelineItemTradeType = (item: TradeItem): string =>
  item.isMissedTrade
    ? t('timeline.trade-type.missed')
    : item.isBacktestTrade
      ? t('timeline.trade-type.backtest')
      : t('timeline.trade-type.regular');

const getTimelineItemStatusLabel = (item: TradeItem): string =>
  item.isOpen
    ? t('timeline.status.open')
    : item.pnl > 0
      ? t('timeline.status.profit')
      : item.pnl < 0
        ? t('timeline.status.loss')
        : t('timeline.status.breakeven');

interface TimelineTradeButtonProps {
  item: TradeItem;
  ticker: string;
  onTradeClick?: (tradePath: string) => void;
}

const TimelineTradeButton: React.FC<TimelineTradeButtonProps> = ({
  item,
  ticker,
  onTradeClick,
}) => {
  const prefix = getTimelineItemPrefix(item);
  const className = `timeline-item ${item.isMissedTrade ? 'missed-trade' : ''} ${item.isBacktestTrade ? 'backtest-trade' : ''} ${getTimelineItemToneClass(item)} ${item.isActive ? 'active' : ''}`;

  return (
    <button
      className={className}
      disabled={!onTradeClick}
      onClick={onTradeClick ? () => onTradeClick(item.file.path) : undefined}
      aria-label={t('timeline.aria.trade-status', {
        ticker,
        tradeType: getTimelineItemTradeType(item),
        tradeNumber: String(item.tradeNumber),
        status: getTimelineItemStatusLabel(item),
      })}
    >
      {prefix}
      {item.tradeNumber}
    </button>
  );
};

const TimelineRow: React.FC<{
  ticker: string;
  items: TradeItem[];
  isActiveTicker: boolean;
  onTradeClick: (tradePath: string) => void;
}> = ({ ticker, items, isActiveTicker, onTradeClick }) => (
  <div className="trade-timeline">
    <div className={`timeline-label ${isActiveTicker ? 'active-ticker' : ''}`}>
      {ticker}:
    </div>
    <div className="timeline-items">
      {items.map((item) => (
        <TimelineTradeButton
          key={item.file.path}
          item={item}
          ticker={ticker}
          onTradeClick={onTradeClick}
        />
      ))}
    </div>
  </div>
);

export const getTradeTimelineDate = (
  frontmatter: Record<string, unknown> | undefined,
  filePath: string
): Date | null => {
  if (!frontmatter) {
    return null;
  }

  const normalizedExecution = normalizeTradeExecution(frontmatter, {
    deriveMissingExplicitness: true,
  });
  if (normalizedExecution.firstEntryTime) {
    return normalizedExecution.firstEntryTime;
  }

  const pathMatch = filePath.match(/(\d{2})(\d{2})(\d{2})-[TM]\d+\.md$/);
  if (!pathMatch) {
    return null;
  }

  const [, day, month, year] = pathMatch;
  const fullYear = 2000 + parseInt(year, 10);
  return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
};

export const TradeTimeline: React.FC<TradeTimelineProps> = ({
  trades,
  currentTradePath,
  onTradeClick,
}) => {
  
  const plugin = usePlugin();

  
  const currentTradeDate = React.useMemo(() => {
    try {
      const app = plugin?.app;
      if (!app?.metadataCache) return null;

      
      let currentFile = trades.find((file) => file.path === currentTradePath);

      
      
      if (!currentFile) {
        const abstractFile = app.vault.getAbstractFileByPath(currentTradePath);
        if (abstractFile instanceof TFile) {
          currentFile = abstractFile;
        }
      }

      if (!currentFile) {
        return null;
      }

      
      const cache = app.metadataCache.getFileCache(currentFile);
      return getTradeTimelineDate(cache?.frontmatter, currentTradePath);
    } catch (error) {
      console.warn('Error getting current trade date:', error);
      return null;
    }
  }, [trades, currentTradePath, plugin]);

  
  const sameDayTrades = React.useMemo(() => {
    if (!currentTradeDate || !plugin) {
      
      return trades;
    }

    try {
      const app = plugin?.app;
      if (!app?.metadataCache) return trades;

      return trades.filter((file) => {
        try {
          
          const cache = app.metadataCache.getFileCache(file);
          const tradeDate = getTradeTimelineDate(cache?.frontmatter, file.path);

          if (!tradeDate) return false;

          
          return isSameTradingDay(currentTradeDate, tradeDate, plugin);
        } catch (error) {
          console.warn(`Error checking trade date for ${file.path}:`, error);
          return false;
        }
      });
    } catch (error) {
      console.warn('Error filtering trades by trading day:', error);
      return trades;
    }
  }, [trades, currentTradeDate, plugin]);

  
  const tradesByTicker = React.useMemo(() => {
    
    const items: TradeItem[] = sameDayTrades.map((file) => {
      
      const tickerMatch = file.path.match(
        /([A-Z0-9-]+)-[0-9]{6}-[TMB]\d+\.md$/
      );
      const numberMatch = file.path.match(/[TMB](\d+)\.md$/);
      const typeMatch = file.path.match(/-([TMB])\d+\.md$/);

      
      const ticker = tickerMatch ? tickerMatch[1] : t('common.unknown');
      const tradeNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0;
      const isMissedTrade = typeMatch ? typeMatch[1] === 'M' : false;
      const isBacktestTrade = typeMatch ? typeMatch[1] === 'B' : false;

      
      let pnl = 0;
      let isOpen = false;
      try {
        const app = plugin?.app;
        if (app?.metadataCache) {
          const cache = app.metadataCache.getFileCache(file);
          const frontmatter = asRecord(cache?.frontmatter);

          if (frontmatter) {
            pnl = getEffectivePnL({
              pnl:
                frontmatter.pnl !== undefined && frontmatter.pnl !== null
                  ? Number(frontmatter.pnl)
                  : undefined,
              directPnL:
                frontmatter.directPnL !== undefined &&
                frontmatter.directPnL !== null
                  ? Number(frontmatter.directPnL)
                  : undefined,
              useDirectPnLInput:
                frontmatter.useDirectPnLInput === true ||
                frontmatter.useDirectPnLInput === 'true',
              dividends: parseTradeDividendTransactions(frontmatter.dividends, {
                parseTime: () => undefined,
              }),
              commission:
                frontmatter.commission !== undefined &&
                frontmatter.commission !== null
                  ? Number(frontmatter.commission)
                  : undefined,
              swap:
                frontmatter.swap !== undefined && frontmatter.swap !== null
                  ? Number(frontmatter.swap)
                  : undefined,
              fees:
                frontmatter.fees !== undefined && frontmatter.fees !== null
                  ? Number(frontmatter.fees)
                  : undefined,
              rebate:
                frontmatter.rebate !== undefined && frontmatter.rebate !== null
                  ? Number(frontmatter.rebate)
                  : undefined,
            });

            
            isOpen = isTradeOpenWithContext({
              tradeStatus: getStringField(frontmatter, 'tradeStatus'),
              exitTime: getStringField(frontmatter, 'exitTime'),
              pnl:
                typeof frontmatter.pnl === 'number'
                  ? frontmatter.pnl
                  : frontmatter.pnl !== undefined && frontmatter.pnl !== null
                    ? Number(frontmatter.pnl)
                    : undefined,
              useDirectPnLInput: getBooleanField(
                frontmatter,
                'useDirectPnLInput'
              ),
            });
          }
        }
      } catch {
        
        pnl = 0;
        isOpen = false;
      }

      return {
        file,
        ticker,
        tradeNumber,
        isActive: file.path === currentTradePath,
        pnl,
        isMissedTrade,
        isBacktestTrade,
        isOpen,
      };
    });

    
    const byTicker: Record<string, TradeItem[]> = {};
    items.forEach((item) => {
      if (!byTicker[item.ticker]) {
        byTicker[item.ticker] = [];
      }
      byTicker[item.ticker].push(item);
    });

    
    Object.keys(byTicker).forEach((ticker) => {
      byTicker[ticker].sort((a, b) => a.tradeNumber - b.tradeNumber);
    });

    return byTicker;
  }, [sameDayTrades, currentTradePath, plugin]);

  
  const tickers = Object.keys(tradesByTicker);

  if (tickers.length === 0) {
    return null; 
  }

  
  if (sameDayTrades.length <= 1) {
    const singleTicker = tickers[0];
    const singleTrade = tradesByTicker[singleTicker][0];

    return (
      <div className="trade-timeline-container single-trade">
        <div className="trade-timeline">
          <div className="timeline-label active-ticker">{singleTicker}:</div>
          <div className="timeline-items">
            <TimelineTradeButton item={singleTrade} ticker={singleTicker} />
          </div>
        </div>
      </div>
    );
  }

  
  const activeTicker = tickers.find((ticker) =>
    tradesByTicker[ticker].some((item) => item.isActive)
  );

  
  const sortedTickers = [...tickers].sort((a, b) => {
    if (a === activeTicker) return -1;
    if (b === activeTicker) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="trade-timeline-container">
      {sortedTickers.map((ticker) => (
        <TimelineRow
          key={ticker}
          ticker={ticker}
          items={tradesByTicker[ticker]}
          isActiveTicker={ticker === activeTicker}
          onTradeClick={onTradeClick}
        />
      ))}
    </div>
  );
};
