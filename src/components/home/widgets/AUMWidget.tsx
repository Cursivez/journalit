

import React, { memo, useMemo, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { useHomePeriod } from '../context/HomePeriodContext';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { HomePeriod } from '../../../settings/types';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';

interface AUMWidgetProps {
  plugin: JournalitPlugin;
}

interface AUMMetrics {
  totalAUM: number;
  previousAUM: number;
  changeAmount: number;
  changePercent: number;
  accountCount: number;
  sparklineData: number[];
  periodLabel: string;
}


function getPeriodLabel(period: HomePeriod): string {
  switch (period) {
    case 'month':
      return t('home.widget.aum.period.month');
    case 'quarter':
      return t('home.widget.aum.period.quarter');
    case 'year':
      return t('home.widget.aum.period.year');
    case 'lifetime':
    default:
      return t('home.widget.aum.period.all');
  }
}


function getSparklinePoints(period: HomePeriod): number {
  switch (period) {
    case 'month':
      return 30; 
    case 'quarter':
      return 13; 
    case 'year':
      return 12; 
    case 'lifetime':
    default:
      return 24; 
  }
}

function AUMSparkline({
  data,
  isPositive,
  isMasked,
}: {
  data: number[];
  isPositive: boolean;
  isMasked: boolean;
}) {
  if (data.length < 2) return null;

  const height = 40;
  const padding = 4;

  const displayData = isMasked ? data.map(() => 1) : data;
  const min = Math.min(...displayData);
  const max = Math.max(...displayData);
  const range = max - min || 1;
  const viewBoxWidth = 100;
  const points = displayData
    .map((value, index) => {
      const x =
        padding +
        (index / (displayData.length - 1)) * (viewBoxWidth - 2 * padding);
      const y =
        height - padding - ((value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  const lineClass = `journalit-home-aum__sparkline-line ${isMasked ? 'journalit-home-aum__sparkline-line--masked' : isPositive ? 'journalit-home-aum__trend--positive' : 'journalit-home-aum__trend--negative'}`;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${height}`}
      preserveAspectRatio="none"
      className="journalit-home-aum__sparkline-svg"
    >
      <polyline
        points={points}
        fill="none"
        className={lineClass}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function AUMLoadingState() {
  return (
    <div className="journalit-home-aum__loading">
      <div className="journalit-home-aum__loading-header">
        <SkeletonText width="30px" height="11px" />
        <SkeletonText width="70px" height="11px" />
      </div>
      <div className="journalit-home-aum__sparkline">
        <svg
          width="100%"
          height="40"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 Q25,20 50,25 T100,15"
            fill="none"
            stroke="var(--background-modifier-border)"
            strokeWidth="2"
            className="skeleton-shimmer journalit-home-aum__sparkline-skeleton"
          />
        </svg>
      </div>
      <div className="journalit-home-aum__loading-bottom">
        <div className="journalit-home-aum__loading-left">
          <SkeletonBox width={100} height={28} borderRadius="8px" />
          <SkeletonText width="70px" height="11px" />
        </div>
        <div className="journalit-home-aum__loading-right">
          <SkeletonBox width={60} height={14} borderRadius="4px" />
          <SkeletonText width="50px" height="11px" />
        </div>
      </div>
    </div>
  );
}

function AUMEmptyState({ message }: { message: string }) {
  return (
    <div className="journalit-home-aum__empty">
      <span className="journalit-home-widget__eyebrow">
        {t('home.widget.aum.title')}
      </span>
      <span className="journalit-home-widget__muted">{message}</span>
    </div>
  );
}

const AUMWidgetComponent: React.FC<AUMWidgetProps> = ({ plugin }) => {
  const { currency } = useCurrency();
  const { formatValue, shouldMask } = useDisplayFormatter();
  const periodContext = useHomePeriod();
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const isLoading = homeAccountsData?.isLoading ?? true;
  const error = homeAccountsData?.error ?? null;

  useEffect(() => {}, []);

  
  const period = periodContext?.period || 'month';
  const dateRange = useMemo(
    () => periodContext?.dateRange || [null, null],
    [periodContext?.dateRange]
  );

  
  const openAccountDashboard = useCallback(() => {
    void plugin.viewManager.openAccountDashboardView();
  }, [plugin]);

  
  const aumMetrics = useMemo((): AUMMetrics | null => {
    if (!accounts || accounts.length === 0) {
      return null;
    }

    
    const excludedTypes = plugin.settings.account?.excludedAccountTypes || [];

    
    const includedAccounts = accounts.filter((acc) => {
      const accountType = (acc.accountType || '').toLowerCase();
      const isIncludedType = !excludedTypes.some(
        (excluded) => excluded.toLowerCase() === accountType
      );
      const matchesSelectedAccount = accountContext?.matchesAccount(
        acc.accountName || acc.name
      );

      return isIncludedType && (matchesSelectedAccount ?? true);
    });

    if (includedAccounts.length === 0) {
      return null;
    }

    
    const totalAUM = includedAccounts.reduce(
      (sum, acc) => sum + (acc.currentBalance || 0),
      0
    );

    
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate: Date;
    const numPoints = getSparklinePoints(period);

    if (dateRange[0]) {
      
      startDate = new Date(dateRange[0]);
    } else {
      
      startDate = new Date(today);
      startDate.setFullYear(startDate.getFullYear() - 2);
    }
    startDate.setHours(0, 0, 0, 0);

    
    const totalDays =
      Math.ceil(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    
    const stepDays = Math.max(1, Math.floor(totalDays / numPoints));
    const actualPoints = Math.min(numPoints, totalDays);

    
    const dailyTotals: { date: string; total: number }[] = [];

    for (let i = 0; i < actualPoints; i++) {
      const pointDate = new Date(startDate);
      pointDate.setDate(pointDate.getDate() + i * stepDays);

      
      if (pointDate > today) break;

      const dateKey = pointDate.toISOString().split('T')[0];
      dailyTotals.push({ date: dateKey, total: 0 });
    }

    
    for (const account of includedAccounts) {
      const balances = account.dailyBalances || [];

      
      const accountBalanceMap = new Map<string, number>();
      for (const record of balances) {
        const dateKey = new Date(record.date).toISOString().split('T')[0];
        accountBalanceMap.set(dateKey, record.balance);
      }

      
      const sortedDates = Array.from(accountBalanceMap.keys()).sort();

      
      for (const point of dailyTotals) {
        let balanceAtPoint = account.initialBalance || 0;

        
        for (const balanceDate of sortedDates) {
          if (balanceDate <= point.date) {
            balanceAtPoint = accountBalanceMap.get(balanceDate)!;
          } else {
            break;
          }
        }

        
        if (point === dailyTotals[dailyTotals.length - 1]) {
          balanceAtPoint = account.currentBalance || balanceAtPoint;
        }

        point.total += balanceAtPoint;
      }
    }

    
    const sparklineData = dailyTotals.map((d) => d.total);

    
    const previousAUM = sparklineData.length > 0 ? sparklineData[0] : totalAUM;
    const changeAmount = totalAUM - previousAUM;
    const changePercent =
      previousAUM !== 0 ? (changeAmount / previousAUM) * 100 : 0;

    return {
      totalAUM,
      previousAUM,
      changeAmount,
      changePercent,
      accountCount: includedAccounts.length,
      sparklineData,
      periodLabel: getPeriodLabel(period),
    };
  }, [
    accounts,
    accountContext,
    plugin.settings.account?.excludedAccountTypes,
    period,
    dateRange,
  ]);

  
  if (isLoading) {
    return <AUMLoadingState />;
  }

  if (error) {
    return <AUMEmptyState message={t('home.widget.aum.unable-to-load')} />;
  }

  if (!aumMetrics) {
    return <AUMEmptyState message={t('home.widget.aum.no-accounts')} />;
  }

  const {
    totalAUM,
    changeAmount,
    changePercent,
    accountCount,
    sparklineData,
    periodLabel,
  } = aumMetrics;
  const isPositive = changeAmount >= 0;
  const isFlat = Math.abs(changePercent) < 0.1;
  const isBalanceMasked = shouldMask('balance');
  const isTrendMasked = shouldMask('returnPercent') || shouldMask('pnl');

  
  const formattedAUM = formatValue({
    kind: 'balance',
    value: totalAUM,
    currencyCode: currency,
    showCents: false,
    notation: 'compact',
  });
  const formattedChange = formatValue({
    kind: 'returnPercent',
    value: changePercent,
    precision: 1,
  });
  const formattedChangeAmount = formatValue({
    kind: 'pnl',
    value: changeAmount,
    currencyCode: currency,
  });

  
  const TrendIcon = isTrendMasked
    ? Minus
    : isFlat
      ? Minus
      : isPositive
        ? TrendingUp
        : TrendingDown;
  const trendClass = isTrendMasked
    ? 'journalit-home-aum__trend--flat'
    : isFlat
      ? 'journalit-home-aum__trend--flat'
      : isPositive
        ? 'journalit-home-aum__trend--positive'
        : 'journalit-home-aum__trend--negative';

  return (
    <div
      onClick={openAccountDashboard}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') {
          return;
        }

        e.preventDefault();
        openAccountDashboard();
      }}
      role="button"
      tabIndex={0}
      className="journalit-aum-widget journalit-home-aum"
    >
      
      <div className="journalit-home-aum__header">
        <span className="journalit-aum-label journalit-home-widget__eyebrow">
          {t('home.widget.aum.title')}
        </span>
        <span className="journalit-home-aum__period">{periodLabel}</span>
      </div>

      
      <div className="journalit-home-aum__sparkline">
        <AUMSparkline
          data={sparklineData}
          isPositive={isPositive}
          isMasked={isBalanceMasked}
        />
      </div>

      
      <div className="journalit-home-aum__footer">
        
        <div className="journalit-home-aum__left">
          <div className="journalit-home-aum__value">{formattedAUM}</div>
          <div className="journalit-home-aum__account-count">
            {accountCount === 1
              ? t('home.widget.aum.account-count', { count: '1' })
              : t('home.widget.aum.account-count-plural', {
                  count: String(accountCount),
                })}
          </div>
        </div>

        
        <div className="journalit-home-aum__right">
          <div className={`journalit-home-aum__trend ${trendClass}`}>
            <TrendIcon size={14} />
            <span className="journalit-home-aum__trend-value">
              {formattedChange}
            </span>
          </div>
          <div className={`journalit-home-aum__trend-amount ${trendClass}`}>
            {formattedChangeAmount}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AUMWidget = memo(AUMWidgetComponent);
