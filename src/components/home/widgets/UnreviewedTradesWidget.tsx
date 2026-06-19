

import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { ClipboardCheck, ChevronRight } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import { Trade } from '../../dashboard/utils/dataUtils';
import {
  formatLocalDateString,
  getWeekStartDate,
  getWeekStartDaySetting,
} from '../../../utils/dateUtils';
import { useEventBus } from '../../../hooks/useEventBus';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { t, tPlural } from '../../../lang/helpers';
import {
  createDashboardFilters,
  createReviewFilters,
  createTradeLogFilters,
} from '../../../settings/viewFiltersDefaults';
import { eventBus } from '../../../services/events';

interface UnreviewedTradesWidgetProps {
  plugin: JournalitPlugin;
}

interface UnreviewedBreakdown {
  total: number;
  today: number;
  thisWeek: number;
  older: number;
}

const UnreviewedTradesWidgetComponent: React.FC<
  UnreviewedTradesWidgetProps
> = ({ plugin }) => {
  const { dashboardData } = useDashboardData();
  const weekStartDay = getWeekStartDaySetting(plugin);

  const [, setSettingsVersion] = useState(0);

  const handleSettingsChanged = useCallback(
    (payload?: { section?: string; source?: string }) => {
      if (payload?.section === 'trade' || payload?.source === 'week-start') {
        setSettingsVersion((prev) => prev + 1);
      }
    },
    []
  );

  useEventBus('settings:changed', handleSettingsChanged);

  useEffect(() => {}, []);

  const breakdown = useMemo((): UnreviewedBreakdown => {
    if (!dashboardData?.trades) {
      return { total: 0, today: 0, thisWeek: 0, older: 0 };
    }

    const now = new Date();
    const todayString = formatLocalDateString(now);

    const weekStart = getWeekStartDate(now, weekStartDay);
    const weekStartTime = weekStart.getTime();

    let today = 0;
    let thisWeek = 0;
    let older = 0;

    const trades: Trade[] = dashboardData.trades;

    for (const trade of trades) {
      
      if (trade.reviewed) continue;

      
      const entryTime =
        trade.entryTime instanceof Date
          ? trade.entryTime
          : new Date(trade.entryTime);
      if (isNaN(entryTime.getTime())) continue;

      const tradeDateString = formatLocalDateString(entryTime);

      
      if (tradeDateString === todayString) {
        today++;
      } else if (entryTime.getTime() >= weekStartTime) {
        thisWeek++;
      } else {
        older++;
      }
    }

    return {
      total: today + thisWeek + older,
      today,
      thisWeek,
      older,
    };
  }, [dashboardData, weekStartDay]);

  const openTradeLog = async (
    applyUnreviewedFilter: boolean
  ): Promise<void> => {
    try {
      const currentState = plugin.uiStateManager.getState();
      const currentFilters = currentState.viewFilters?.tradelog;
      const nextTradeLogFilters = {
        ...createTradeLogFilters(),
        ...currentFilters,
      };

      if (applyUnreviewedFilter) {
        nextTradeLogFilters.reviewStatus = ['unreviewed'];
      } else {
        nextTradeLogFilters.reviewStatus = [];
      }

      await plugin.uiStateManager.updateState({
        viewFilters: {
          dashboard:
            currentState.viewFilters?.dashboard ?? createDashboardFilters(),
          reviews: currentState.viewFilters?.reviews ?? createReviewFilters(),
          tradelog: nextTradeLogFilters,
        },
      });
      await plugin.viewManager.openTradeLogView();
      window.setTimeout(() => {
        window.journalitSyncTradeLogFilters?.();
        eventBus.publish('tradelog:filters-updated');
      }, 250);
    } catch (error) {
      console.error('Failed to open Trade Log:', error);
    }
  };

  

  
  if (!dashboardData) {
    return (
      <div className="journalit-home-unreviewed">
        
        <div className="journalit-home-unreviewed__line">
          <SkeletonBox width={8} height={8} borderRadius="50%" />
          <SkeletonText width="140px" height="13px" />
          <SkeletonBox width={14} height={14} borderRadius="2px" />
        </div>
        
        <SkeletonText width="100px" height="11px" />
      </div>
    );
  }

  
  if (breakdown.total === 0) {
    return (
      <div
        className="journalit-home-unreviewed journalit-home-unreviewed--row journalit-home-unreviewed--clickable"
        onClick={() => void openTradeLog(false)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') {
            return;
          }

          e.preventDefault();
          void openTradeLog(false);
        }}
        role="button"
        tabIndex={0}
        aria-label={t('command.open-trade-log')}
      >
        <ClipboardCheck
          size={16}
          className="journalit-home-unreviewed__check"
        />
        <span className="journalit-home-widget__muted">
          {t('home.widget.unreviewed.all-reviewed')}
        </span>
      </div>
    );
  }

  
  const dotColor =
    breakdown.total > 5 ? 'var(--color-orange)' : 'var(--color-yellow)';

  return (
    <div
      className="journalit-home-unreviewed journalit-home-unreviewed--clickable"
      onClick={() => void openTradeLog(true)}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        e.preventDefault();
        void openTradeLog(true);
      }}
      role="button"
      tabIndex={0}
      aria-label={t('home.widget.unreviewed.title-review')}
    >
      
      <div className="journalit-home-unreviewed__line">
        
        <div
          className="journalit-home-unreviewed__dot"
          style={cssVars({ '--journalit-home-unreviewed-dot-color': dotColor })}
        />
        <span className="journalit-home-unreviewed__count">
          {tPlural('home.widget.unreviewed.need-review', breakdown.total)}
        </span>
        <ChevronRight
          size={14}
          className="journalit-home-unreviewed__chevron"
        />
      </div>

      
      {(breakdown.today > 0 || breakdown.thisWeek > 0) && (
        <div className="journalit-home-unreviewed__breakdown">
          {breakdown.today > 0 && (
            <span>
              {t('home.widget.unreviewed.today', {
                count: breakdown.today.toString(),
              })}
            </span>
          )}
          {breakdown.today > 0 && breakdown.thisWeek > 0 && <span> · </span>}
          {breakdown.thisWeek > 0 && (
            <span>
              {t('home.widget.unreviewed.this-week', {
                count: breakdown.thisWeek.toString(),
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const UnreviewedTradesWidget = memo(UnreviewedTradesWidgetComponent);
