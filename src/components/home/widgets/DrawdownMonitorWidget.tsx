

import React, { memo, useMemo, useCallback } from 'react';
import { Shield } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { DrawdownType } from '../../../services/account/types';
import { calculateDrawdownUsed as calculateDrawdownPercent } from '../../account/dashboard/utils';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { t } from '../../../lang/helpers';
import {
  AccountProgressListItem,
  AccountProgressListWidget,
  AccountProgressLoading,
  AccountProgressState,
} from './AccountProgressListWidget';

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
  accounts: AccountProgressListItem<AccountDrawdownInfo['status']>[];
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

interface DrawdownContentProps {
  data: DrawdownMetrics;
  onAccountClick: (accountName: string) => void;
}

const DrawdownContent: React.FC<DrawdownContentProps> = ({
  data,
  onAccountClick,
}) => {
  return (
    <AccountProgressListWidget
      title={t('home.widget.drawdown.title')}
      items={data.accounts}
      remainingLabel={t('home.widget.drawdown.remaining')}
      remainingKind="drawdown"
      maskKinds={['drawdown']}
      getStatusColor={getStatusColor}
      getCompleteLabel={(item) =>
        item.percent >= 100 ? t('home.widget.drawdown.breached') : ''
      }
      completePercentageClassName="journalit-home-account-progress__percentage--breached"
      onAccountClick={onAccountClick}
    />
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

  
  const handleAccountClick = useCallback(
    (accountName: string) => {
      void plugin.viewManager.openAccountPageView(accountName);
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

    const accountInfos: AccountProgressListItem<
      AccountDrawdownInfo['status']
    >[] = accountsWithDrawdown.map((acc) => {
      
      const drawdownPercent = calculateDrawdownPercent(acc);
      const drawdownLimit = acc.drawdownAmount;
      
      const drawdownUsed = (drawdownPercent / 100) * drawdownLimit;
      const remaining = Math.max(0, drawdownLimit - drawdownUsed);
      const status = getDrawdownStatus(drawdownPercent);
      const accountName = acc.accountName || acc.name || 'Unknown';

      return {
        name: accountName,
        accountName, 
        percent: drawdownPercent,
        remaining,
        status,
      };
    });

    accountInfos.sort((a, b) => b.percent - a.percent);

    
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
    return <AccountProgressLoading titleWidth={70} />;
  }

  
  if (error) {
    return (
      <AccountProgressState
        title={t('home.widget.drawdown.title')}
        message={t('home.widget.drawdown.unable-to-load')}
      />
    );
  }

  
  if (!drawdownMetrics) {
    return (
      <AccountProgressState
        title={t('home.widget.drawdown.title')}
        message={t('home.widget.drawdown.no-accounts')}
        icon={
          <Shield
            size={24}
            className="journalit-home-account-progress__state-icon"
          />
        }
      />
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
