

import React, { memo, useEffect, useMemo } from 'react';
import { Flame, Snowflake, Minus } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { t } from '../../../lang/helpers';
import { getTradeAnalyticsDate } from '../../../utils/tradeAnalyticsDate';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { useDashboardData } from '../../dashboard/context/DashboardDataContext';
import {
  useFilteredByPeriod,
  useHomePeriod,
} from '../context/HomePeriodContext';
import { Trade } from '../../dashboard/utils/dataUtils';
import { isPnlContributingTrade } from '../../../utils/tradeStatusUtils';
import { HomePeriod } from '../../../settings/types';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import {
  calculateCurrentStreak,
  calculateHistoricalStreaks,
} from '../../../utils/tradeStreaks';

interface CurrentStreakWidgetProps {
  plugin: JournalitPlugin;
}


const getPeriodLabel = (period: HomePeriod | undefined): string => {
  switch (period) {
    case 'month':
      return t('home.widget.streak.period.month');
    case 'quarter':
      return t('home.widget.streak.period.quarter');
    case 'year':
      return t('home.widget.streak.period.year');
    case 'lifetime':
    default:
      return t('home.widget.streak.period.ever');
  }
};

interface StreakData {
  currentStreak: number;
  streakType: 'win' | 'loss' | 'none';
  longestWinStreak: number;
  longestLossStreak: number;
  avgWinStreak: number;
  avgLossStreak: number;
  lastTradeDate: Date | null;
}

const CurrentStreakWidgetComponent: React.FC<CurrentStreakWidgetProps> = ({
  plugin,
}) => {
  const { dashboardData } = useDashboardData();
  const periodContext = useHomePeriod();
  const currentPeriod = periodContext?.period;

  useEffect(() => {}, []);

  
  const filteredTrades = useFilteredByPeriod(
    dashboardData?.trades as Trade[] | undefined
  );

  
  
  const closedTrades = useMemo(() => {
    if (!filteredTrades) return [];
    return filteredTrades.filter((trade: Trade) =>
      isPnlContributingTrade(trade)
    );
  }, [filteredTrades]);

  const breakEvenSettings = useMemo(
    () => ({
      breakEvenRangeMin: plugin.settings.trade.breakEvenRangeMin,
      breakEvenRangeMax: plugin.settings.trade.breakEvenRangeMax,
      breakEvenThresholdMode:
        plugin.settings.trade.breakEvenThresholdMode ?? 'fixed',
      breakEvenThresholdPercent:
        plugin.settings.trade.breakEvenThresholdPercent,
    }),
    [
      plugin.settings.trade.breakEvenRangeMin,
      plugin.settings.trade.breakEvenRangeMax,
      plugin.settings.trade.breakEvenThresholdMode,
      plugin.settings.trade.breakEvenThresholdPercent,
    ]
  );

  const streakData = useMemo((): StreakData => {
    const defaultData: StreakData = {
      currentStreak: 0,
      streakType: 'none',
      longestWinStreak: 0,
      longestLossStreak: 0,
      avgWinStreak: 0,
      avgLossStreak: 0,
      lastTradeDate: null,
    };

    if (!closedTrades || closedTrades.length === 0) {
      return defaultData;
    }

    const analyticsDateBasis =
      plugin?.settings?.trade?.analyticsDateBasis ?? 'entry';

    
    const sortedTrades = [...closedTrades].sort((a: Trade, b: Trade) => {
      const dateA =
        getTradeAnalyticsDate(a, analyticsDateBasis)?.getTime() ?? 0;
      const dateB =
        getTradeAnalyticsDate(b, analyticsDateBasis)?.getTime() ?? 0;
      return dateB - dateA;
    });

    
    const { currentStreak, streakType } = calculateCurrentStreak(
      sortedTrades,
      breakEvenSettings
    );
    const lastTradeDate =
      sortedTrades.length > 0
        ? getTradeAnalyticsDate(sortedTrades[0], analyticsDateBasis)
        : null;

    
    
    const chronologicalTrades = [...sortedTrades].reverse();

    const { winStreaks, lossStreaks } = calculateHistoricalStreaks(
      chronologicalTrades,
      breakEvenSettings
    );

    const longestWinStreak =
      winStreaks.length > 0 ? Math.max(...winStreaks) : 0;
    const longestLossStreak =
      lossStreaks.length > 0 ? Math.max(...lossStreaks) : 0;
    const avgWinStreak =
      winStreaks.length > 0
        ? winStreaks.reduce((a, b) => a + b, 0) / winStreaks.length
        : 0;
    const avgLossStreak =
      lossStreaks.length > 0
        ? lossStreaks.reduce((a, b) => a + b, 0) / lossStreaks.length
        : 0;

    return {
      currentStreak,
      streakType,
      longestWinStreak,
      longestLossStreak,
      avgWinStreak,
      avgLossStreak,
      lastTradeDate,
    };
  }, [
    closedTrades,
    breakEvenSettings,
    plugin?.settings?.trade?.analyticsDateBasis,
  ]);

  
  const getStreakDisplay = () => {
    if (streakData.streakType === 'win') {
      return {
        color: 'var(--color-green)',
        icon: Flame,
        label:
          streakData.currentStreak === 1
            ? t('home.widget.streak.win')
            : t('home.widget.streak.wins'),
        contextLabel: t('home.widget.streak.in-a-row'),
        bgColor: 'rgba(var(--color-green-rgb), 0.1)',
      };
    } else if (streakData.streakType === 'loss') {
      return {
        color: 'var(--color-red)',
        icon: Snowflake,
        label:
          streakData.currentStreak === 1
            ? t('home.widget.streak.loss')
            : t('home.widget.streak.losses'),
        contextLabel: t('home.widget.streak.in-a-row'),
        bgColor: 'rgba(var(--color-red-rgb), 0.1)',
      };
    }
    return {
      color: 'var(--text-muted)',
      icon: Minus,
      label: '',
      contextLabel: t('home.widget.streak.no-active'),
      bgColor: 'transparent',
    };
  };

  const display = getStreakDisplay();
  const IconComponent = display.icon;

  
  const getInsight = (): string => {
    const periodLabel = getPeriodLabel(currentPeriod);

    if (streakData.streakType === 'none') {
      return t('home.widget.streak.start-trading');
    }

    if (streakData.streakType === 'win') {
      if (
        streakData.currentStreak >= streakData.longestWinStreak &&
        streakData.currentStreak > 1
      ) {
        return t('home.widget.streak.best-streak', { period: periodLabel });
      }
      if (
        streakData.currentStreak > streakData.avgWinStreak * 1.5 &&
        streakData.currentStreak > 1
      ) {
        return t('home.widget.streak.above-average', { period: periodLabel });
      }
      if (streakData.currentStreak >= 3) {
        return t('home.widget.streak.stay-focused');
      }
      if (streakData.currentStreak === 2) {
        return t('home.widget.streak.keep-going');
      }
      
      return t('home.widget.streak.good-start');
    }

    if (streakData.streakType === 'loss') {
      if (streakData.currentStreak >= 3) {
        return t('home.widget.streak.pause');
      }
      if (streakData.currentStreak >= 2) {
        return t('home.widget.streak.review');
      }
      return t('home.widget.streak.losses-process');
    }

    return '';
  };

  if (!dashboardData) {
    return (
      <div className="journalit-home-streak journalit-home-streak--loading">
        
        <div className="journalit-home-streak__skeleton-header">
          <SkeletonText width="50px" height="11px" />
          <SkeletonText width="80px" height="11px" />
        </div>

        
        <div className="journalit-home-streak__hero journalit-home-streak__hero--skeleton">
          
          <SkeletonBox width={24} height={24} borderRadius="50%" />
          
          <SkeletonBox width={48} height={36} borderRadius="8px" />
          
          <SkeletonText width="100px" height="14px" />
          
          <SkeletonText width="120px" height="12px" />
        </div>
      </div>
    );
  }

  return (
    <div className="journalit-home-streak">
      
      <div className="journalit-home-streak__header">
        <span>{t('home.widget.streak.title')}</span>
        {streakData.longestWinStreak > 0 && (
          <span className="journalit-home-streak__header-stats">
            {t('home.widget.streak.best')} {streakData.longestWinStreak} ·{' '}
            {t('home.widget.streak.avg')} {streakData.avgWinStreak.toFixed(1)}
          </span>
        )}
      </div>

      
      <div
        className="journalit-home-streak__hero"
        style={cssVars({ '--journalit-home-streak-color': display.color })}
      >
        
        {streakData.streakType !== 'none' && (
          <IconComponent size={24} className="journalit-home-streak__icon" />
        )}

        
        <div className="journalit-home-streak__value">
          {streakData.streakType !== 'none' ? streakData.currentStreak : '—'}
        </div>

        
        <div className="journalit-home-streak__label">
          {streakData.streakType !== 'none'
            ? `${display.label} ${display.contextLabel}`
            : display.contextLabel}
        </div>

        
        <div className="journalit-home-streak__insight">{getInsight()}</div>
      </div>
    </div>
  );
};

export const CurrentStreakWidget = memo(CurrentStreakWidgetComponent);
