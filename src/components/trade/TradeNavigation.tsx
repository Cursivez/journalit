

import React, { useCallback } from 'react';
import { TFile } from 'obsidian';
import { TradeTimeline } from './TradeTimeline';

const EMPTY_MISSED_TRADES: TFile[] = [];

interface TradeNavigationProps {
  currentDate?: Date;
  trades: TFile[];
  missedTrades?: TFile[];
  currentTradePath: string;
  navigateTo: (path: string, openInNewLeaf: boolean) => void;
  getDRCPath?: (date: Date) => string;
  getWeeklyReviewPath?: (date: Date) => string;
  getMonthlyReviewPath?: (date: Date) => string | null;
  getYearlyReviewPath?: (date: Date) => string | null;
}

export const TradeNavigation: React.FC<TradeNavigationProps> = ({
  trades,
  missedTrades = EMPTY_MISSED_TRADES,
  currentTradePath,
  navigateTo,
}) => {
  
  const handleTradeClick = useCallback(
    (tradePath: string) => {
      if (tradePath === currentTradePath) return;
      navigateTo(tradePath, false);
    },
    [navigateTo, currentTradePath]
  );

  
  const allTrades = React.useMemo(() => {
    const seen = new Set<string>();
    const deduplicated: TFile[] = [];

    for (const trade of [...trades, ...missedTrades]) {
      if (!seen.has(trade.path)) {
        seen.add(trade.path);
        deduplicated.push(trade);
      }
    }

    return deduplicated;
  }, [trades, missedTrades]);

  return (
    <div className="trade-navigation-container">
      
      <TradeTimeline
        trades={allTrades}
        currentTradePath={currentTradePath}
        onTradeClick={handleTradeClick}
      />
    </div>
  );
};
