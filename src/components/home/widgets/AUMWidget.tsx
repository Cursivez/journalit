

import React, { memo, useMemo, useEffect, useCallback, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
} from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { calculateCurrentAumMetrics } from './aumMetrics';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { t } from '../../../lang/helpers';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { formatLocalDateString } from '../../../utils/dateUtils';
import {
  createTradingDayFromString,
  getTradingDay,
} from '../../../utils/tradingDayUtils';

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
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const isLoading = homeAccountsData?.isLoading ?? true;
  const error = homeAccountsData?.error ?? null;

  const [now, setNow] = useState(() => Date.now());
  const currentTradingDayKey = formatLocalDateString(
    getTradingDay(new Date(now), plugin)
  );
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  
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

    return {
      ...calculateCurrentAumMetrics(
        includedAccounts,
        createTradingDayFromString(currentTradingDayKey),
        plugin.settings.trade.tradingDayCutoffTime
      ),
      accountCount: includedAccounts.length,
    };
  }, [
    accounts,
    accountContext,
    plugin.settings.account?.excludedAccountTypes,
    plugin.settings.trade.tradingDayCutoffTime,
    currentTradingDayKey,
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

  const { totalAUM, changeAmount, changePercent, accountCount, sparklineData } =
    aumMetrics;
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
        <span className="journalit-home-aum__period">
          {t('home.widget.aum.current-trend')}
        </span>
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
