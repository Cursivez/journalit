

import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { Shield } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { DrawdownType } from '../../../services/account/types';
import { SkeletonBox } from '../../shared/SkeletonBox';
import { SkeletonText } from '../../shared/SkeletonText';
import { ensureHomeWidgetStyles } from '../../../styles/homeWidgetStyles';
import { cssVars } from '../../../styles/inlineStylePolicy';
import { calculateDrawdownUsed as calculateDrawdownPercent } from '../../account/dashboard/utils';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { t } from '../../../lang/helpers';
import { useDisplayFormatter } from '../../../hooks/useDisplayPolicy';

interface DrawdownMonitorWidgetProps {
  plugin: JournalitPlugin;
}

interface AccountDrawdownInfo {
  name: string;
  accountName: string; 
  drawdownPercent: number;
  drawdownUsed: number;
  drawdownLimit: number;
  remaining: number;
  status: 'safe' | 'caution' | 'warning';
}

interface DrawdownMetrics {
  accounts: AccountDrawdownInfo[];
  warningCount: number;
  cautionCount: number;
}


const MAX_ACCOUNTS = 3;


const WARNING_THRESHOLD = 50; 
const CAUTION_THRESHOLD = 30; 


function getDrawdownStatus(percent: number): 'safe' | 'caution' | 'warning' {
  if (percent >= WARNING_THRESHOLD) return 'warning';
  if (percent >= CAUTION_THRESHOLD) return 'caution';
  return 'safe';
}


function getStatusColor(status: 'safe' | 'caution' | 'warning'): string {
  switch (status) {
    case 'warning':
      return 'var(--color-red)';
    case 'caution':
      return 'var(--color-yellow)';
    case 'safe':
      return 'var(--color-green)';
  }
}






const TOTAL_SEGMENTS = 20;

interface DrawdownContentProps {
  data: DrawdownMetrics;
  onAccountClick: (accountName: string) => void;
}

const DrawdownContent: React.FC<DrawdownContentProps> = ({
  data,
  onAccountClick,
}) => {
  const { formatValue, shouldMask } = useDisplayFormatter();
  const isDrawdownMasked = shouldMask('drawdown');
  const displayAccounts = data.accounts.slice(0, MAX_ACCOUNTS);

  return (
    <div className="journalit-home-drawdown">
      
      <div className="journalit-home-widget__eyebrow journalit-home-drawdown__header">
        {t('home.widget.drawdown.title')}
      </div>

      
      <div className="journalit-home-drawdown__list">
        {displayAccounts.map((acc) => {
          const barColor = isDrawdownMasked
            ? 'var(--text-muted)'
            : getStatusColor(acc.status);
          
          const percentDisplay =
            acc.drawdownPercent >= 100
              ? Math.ceil(acc.drawdownPercent)
              : Math.floor(acc.drawdownPercent);
          const filledCount = Math.min(
            TOTAL_SEGMENTS,
            Math.floor((acc.drawdownPercent / 100) * TOTAL_SEGMENTS)
          );
          const isBreached = acc.drawdownPercent >= 100;
          const percentageClassName =
            isBreached && !isDrawdownMasked
              ? 'journalit-home-drawdown__percentage journalit-home-drawdown__percentage--breached'
              : 'journalit-home-drawdown__percentage';

          return (
            <div
              key={acc.name}
              role="button"
              tabIndex={0}
              onClick={() => onAccountClick(acc.accountName)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                onAccountClick(acc.accountName);
              }}
              className="journalit-drawdown-account-row journalit-home-drawdown__row"
              style={cssVars({ '--journalit-home-drawdown-color': barColor })}
            >
              
              <div className="journalit-home-drawdown__row-header">
                <span className="journalit-drawdown-account-name">
                  {acc.name}
                </span>
                <span className={percentageClassName}>
                  {isBreached && !isDrawdownMasked
                    ? t('home.widget.drawdown.breached')
                    : formatValue({
                        kind: 'percentage',
                        value: percentDisplay,
                        signed: false,
                        precision: 0,
                      })}
                </span>
              </div>

              
              <svg
                width="100%"
                height="8"
                viewBox={`0 0 ${TOTAL_SEGMENTS * 10} 8`}
                preserveAspectRatio="none"
                className="journalit-home-drawdown__bar"
              >
                {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                  <rect
                    key={i}
                    x={i * 10}
                    y={0}
                    width={8}
                    height={8}
                    fill={
                      !isDrawdownMasked && i < filledCount
                        ? barColor
                        : 'var(--text-faint)'
                    }
                    opacity={!isDrawdownMasked && i < filledCount ? 0.85 : 0.2}
                  />
                ))}
              </svg>

              
              <div className="journalit-home-drawdown__remaining">
                {formatValue({ kind: 'drawdown', value: acc.remaining })}{' '}
                {t('home.widget.drawdown.remaining')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};




const DrawdownMonitorWidgetComponent: React.FC<DrawdownMonitorWidgetProps> = ({
  plugin,
}) => {
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const isLoading = homeAccountsData?.isLoading ?? true;
  const error = homeAccountsData?.error ?? null;

  useEffect(() => {}, []);

  
  const handleAccountClick = useCallback(
    (accountName: string) => {
      plugin.viewManager.openAccountPageView(accountName);
    },
    [plugin]
  );

  
  const drawdownMetrics = useMemo((): DrawdownMetrics | null => {
    if (!accounts || accounts.length === 0) return null;

    const accountsWithDrawdown = accounts.filter(
      (acc) =>
        acc.drawdownType !== DrawdownType.NONE &&
        acc.drawdownAmount > 0 &&
        acc.accountType?.toLowerCase() !== 'archived' &&
        (accountContext?.matchesAccount(acc.accountName || acc.name) ?? true)
    );

    if (accountsWithDrawdown.length === 0) return null;

    const accountInfos: AccountDrawdownInfo[] = accountsWithDrawdown.map(
      (acc) => {
        
        const drawdownPercent = calculateDrawdownPercent(acc);
        const drawdownLimit = acc.drawdownAmount;
        
        const drawdownUsed = (drawdownPercent / 100) * drawdownLimit;
        const remaining = Math.max(0, drawdownLimit - drawdownUsed);
        const status = getDrawdownStatus(drawdownPercent);
        const accountName = acc.accountName || acc.name || 'Unknown';

        return {
          name: accountName,
          accountName, 
          drawdownPercent,
          drawdownUsed,
          drawdownLimit,
          remaining,
          status,
        };
      }
    );

    accountInfos.sort((a, b) => b.drawdownPercent - a.drawdownPercent);

    
    const displayedAccounts = accountInfos.slice(0, MAX_ACCOUNTS);
    return {
      accounts: displayedAccounts,
      warningCount: displayedAccounts.filter((a) => a.status === 'warning')
        .length,
      cautionCount: displayedAccounts.filter((a) => a.status === 'caution')
        .length,
    };
  }, [accounts, accountContext]);

  
  if (isLoading) {
    return (
      <div className="journalit-home-drawdown journalit-home-drawdown--loading">
        
        <SkeletonText width="70px" height="11px" />

        
        <div className="journalit-home-drawdown__loading-list">
          {['first', 'second', 'third'].map((key) => (
            <div key={key} className="journalit-home-drawdown__loading-row">
              
              <div className="journalit-home-drawdown__row-header">
                <SkeletonText width="80px" height="12px" />
                <SkeletonText width="35px" height="15px" />
              </div>
              
              <SkeletonBox width="100%" height={8} borderRadius="0px" />
              
              <SkeletonText width="100px" height="11px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="journalit-home-drawdown__state">
        <span className="journalit-home-drawdown__state-title">
          {t('home.widget.drawdown.title')}
        </span>
        <span className="journalit-home-drawdown__state-message">
          {t('home.widget.drawdown.unable-to-load')}
        </span>
      </div>
    );
  }

  
  if (!drawdownMetrics) {
    return (
      <div className="journalit-home-drawdown__state">
        <Shield size={24} className="journalit-home-drawdown__state-icon" />
        <span className="journalit-home-drawdown__state-title">
          {t('home.widget.drawdown.title')}
        </span>
        <span className="journalit-home-drawdown__state-message">
          {t('home.widget.drawdown.no-accounts')}
        </span>
      </div>
    );
  }

  return (
    <DrawdownContent
      data={drawdownMetrics}
      onAccountClick={handleAccountClick}
    />
  );
};

export const DrawdownMonitorWidget = memo(DrawdownMonitorWidgetComponent);
