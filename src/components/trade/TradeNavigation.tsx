

import React, { useCallback, useRef } from 'react';
import { Edit } from '../shared/icons/ObsidianIcon';
import { TFile } from 'obsidian';
import { t } from '../../lang/helpers';
import { TradeTimeline } from './TradeTimeline';
import {
  Navigation as SharedNavigation,
  NavigationButtonConfig,
} from '../shared/Navigation';
import { usePlugin } from '../../hooks/usePlugin';

const EMPTY_MISSED_TRADES: TFile[] = [];

interface TradeNavigationProps {
  currentDate: Date;
  trades: TFile[];
  missedTrades?: TFile[];
  currentTradePath: string;
  navigateTo: (path: string, openInNewLeaf: boolean) => void;
  getDRCPath: (date: Date) => string;
  getWeeklyReviewPath: (date: Date) => string;
  getMonthlyReviewPath: (date: Date) => string | null;
  getYearlyReviewPath: (date: Date) => string | null;

  onEditClick?: (data: any) => void;
  handleEditClick?: () => void;
}

export const TradeNavigation: React.FC<TradeNavigationProps> = ({
  currentDate,
  trades,
  missedTrades = EMPTY_MISSED_TRADES,
  currentTradePath,
  navigateTo,
  getDRCPath,
  getWeeklyReviewPath,
  getMonthlyReviewPath,
  getYearlyReviewPath,
  onEditClick,
  handleEditClick,
}) => {
  
  const plugin = usePlugin();

  
  const isNavigatingRef = useRef(false);

  
  const handleTradeClick = useCallback(
    (tradePath: string) => {
      if (tradePath === currentTradePath) return;
      navigateTo(tradePath, false);
    },
    [navigateTo, currentTradePath]
  );

  
  const navigateToDRC = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    try {
      
      
      
      const calendarDate = new Date(currentDate);
      calendarDate.setHours(0, 0, 0, 0);

      const drcPath = getDRCPath(calendarDate);
      if (!drcPath) return;

      
      const exists = await plugin?.app?.vault?.adapter?.exists(drcPath);

      
      if (!exists && plugin?.drcService) {
        await plugin.drcService.createDRC(calendarDate);
      }

      navigateTo(drcPath, false);
    } catch (error) {
      console.error('Error navigating to DRC:', error);
    } finally {
      isNavigatingRef.current = false;
    }
  }, [getDRCPath, currentDate, navigateTo, plugin]);

  
  const navigateToWeekly = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    try {
      
      const calendarDate = new Date(currentDate);
      calendarDate.setHours(0, 0, 0, 0);

      const weeklyPath = getWeeklyReviewPath(calendarDate);
      if (!weeklyPath) return;

      
      const exists = await plugin?.app?.vault?.adapter?.exists(weeklyPath);

      
      if (!exists && plugin?.weeklyReviewService) {
        await plugin.weeklyReviewService.createWeeklyReview(calendarDate);
      }

      navigateTo(weeklyPath, false);
    } catch (error) {
      console.error('Error navigating to Weekly Review:', error);
    } finally {
      isNavigatingRef.current = false;
    }
  }, [getWeeklyReviewPath, currentDate, navigateTo, plugin]);

  
  const navigateToMonthly = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    try {
      
      const calendarDate = new Date(currentDate);
      calendarDate.setHours(0, 0, 0, 0);

      const monthlyPath = getMonthlyReviewPath(calendarDate);
      if (!monthlyPath) return;

      
      const exists = await plugin?.app?.vault?.adapter?.exists(monthlyPath);

      
      if (!exists && plugin?.monthlyReviewService) {
        await plugin.monthlyReviewService.createMonthlyReview(calendarDate);
      }

      navigateTo(monthlyPath, false);
    } catch (error) {
      console.error('Error navigating to Monthly Review:', error);
    } finally {
      isNavigatingRef.current = false;
    }
  }, [getMonthlyReviewPath, currentDate, navigateTo, plugin]);

  
  const navigateToYearly = useCallback(async () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    try {
      
      const calendarDate = new Date(currentDate);
      calendarDate.setHours(0, 0, 0, 0);

      const yearlyPath = getYearlyReviewPath(calendarDate);
      if (!yearlyPath) return;

      
      const exists = await plugin?.app?.vault?.adapter?.exists(yearlyPath);

      
      if (!exists && plugin?.serviceManager) {
        const yearlyService =
          await plugin.serviceManager.getYearlyReviewService();
        await yearlyService.createYearlyReview(calendarDate);
      }

      navigateTo(yearlyPath, false);
    } catch (error) {
      console.error('Error navigating to Yearly Review:', error);
    } finally {
      isNavigatingRef.current = false;
    }
  }, [getYearlyReviewPath, currentDate, navigateTo, plugin]);

  
  const navigationButtons: NavigationButtonConfig[] = [
    {
      text: 'nav.drc',
      action: navigateToDRC,
    },
    {
      text: 'nav.weekly-review',
      action: navigateToWeekly,
    },
    {
      text: 'nav.monthly-review',
      action: navigateToMonthly,
    },
    {
      text: 'nav.yearly-review',
      action: navigateToYearly,
    },
  ];

  const navigationWithEditButton = (
    <div className="trade-navigation-with-edit">
      <SharedNavigation
        buttons={navigationButtons}
        className="trade-review-navigation"
      />

      
      {handleEditClick && onEditClick && (
        <div className="edit-button-container">
          <button
            className="trade-nav-edit-button clickable-icon"
            onClick={handleEditClick}
            aria-label={t('nav.edit-trade')}
          >
            <Edit size={14} />
          </button>
        </div>
      )}
    </div>
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
      
      {navigationWithEditButton}

      
      <TradeTimeline
        trades={allTrades}
        currentTradePath={currentTradePath}
        onTradeClick={handleTradeClick}
      />
    </div>
  );
};
