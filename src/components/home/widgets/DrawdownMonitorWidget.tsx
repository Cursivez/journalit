

import React, { memo, useMemo, useCallback } from 'react';
import { Shield } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { DrawdownType } from '../../../services/account/types';
import { calculateDrawdownUsed as calculateDrawdownPercent } from '../../account/dashboard/utils';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { t } from '../../../lang/helpers';
import { AccountProgressListItem } from './AccountProgressListWidget';
import { ConfigurableAccountProgressWidget } from './ConfigurableAccountProgressWidget';

interface DrawdownMonitorWidgetProps {
  plugin: JournalitPlugin;
  instanceId?: string;
  isEditing?: boolean;
}

type DrawdownStatus = 'safe' | 'caution' | 'warning';


const WARNING_THRESHOLD = 50; 
const CAUTION_THRESHOLD = 30; 


function getDrawdownStatus(percent: number): DrawdownStatus {
  if (percent >= WARNING_THRESHOLD) return 'warning';
  if (percent >= CAUTION_THRESHOLD) return 'caution';
  return 'safe';
}


function getStatusColor(status: DrawdownStatus): string {
  switch (status) {
    case 'warning':
      return 'var(--color-red)';
    case 'caution':
      return 'var(--color-yellow)';
    case 'safe':
      return 'var(--color-green)';
  }
}




const DrawdownMonitorWidgetComponent: React.FC<DrawdownMonitorWidgetProps> = ({
  plugin,
  instanceId = 'drawdownMonitor',
  isEditing = false,
}) => {
  const accountContext = useHomeAccount();
  const homeAccountsData = useHomeAccountsData();
  const accounts = useMemo(
    () => homeAccountsData?.accounts || [],
    [homeAccountsData?.accounts]
  );
  const challengeProgress = homeAccountsData?.challengeProgress;
  const isLoading = homeAccountsData?.isLoading ?? true;
  const error = homeAccountsData?.error ?? null;

  
  const handleAccountClick = useCallback(
    (accountName: string) => {
      void plugin.viewManager.openAccountPageView(accountName);
    },
    [plugin]
  );

  
  
  const drawdownItems = useMemo(() => {
    const accountInfos: AccountProgressListItem<DrawdownStatus>[] = [];
    for (const acc of accounts) {
      const accountName = acc.accountName || acc.name || 'Unknown';
      
      
      if (acc.accountType?.toLowerCase() === 'archived') continue;
      
      
      let drawdown: { percent: number; remaining: number } | undefined;
      if (acc.propChallenge) {
        drawdown = challengeProgress?.get(acc.name)?.drawdown;
      } else if (
        acc.drawdownType !== DrawdownType.NONE &&
        acc.drawdownAmount > 0
      ) {
        
        const percent = calculateDrawdownPercent(acc);
        drawdown = {
          percent,
          remaining: Math.max(
            0,
            acc.drawdownAmount - (percent / 100) * acc.drawdownAmount
          ),
        };
      }
      if (!drawdown) continue;
      accountInfos.push({
        name: accountName,
        accountName, 
        
        ...(acc.propChallenge ? { currencyCode: acc.currency } : {}),
        percent: drawdown.percent,
        remaining: drawdown.remaining,
        status: getDrawdownStatus(drawdown.percent),
      });
    }

    return accountInfos;
  }, [accounts, challengeProgress]);

  return (
    <ConfigurableAccountProgressWidget
      plugin={plugin}
      instanceId={instanceId}
      isEditing={isEditing}
      isShown={(accountName) =>
        accountContext?.matchesAccount(accountName) ?? true
      }
      title={t('home.widget.drawdown.title')}
      isLoading={isLoading}
      errorMessage={error ? t('home.widget.drawdown.unable-to-load') : null}
      loadingTitleWidth={70}
      items={drawdownItems}
      automaticHint={t('home.widget.account-progress.automatic-drawdown')}
      emptyMessage={t('home.widget.drawdown.no-accounts')}
      emptyIcon={
        <Shield
          size={24}
          className="journalit-home-account-progress__state-icon"
        />
      }
      listProps={{
        remainingLabel: t('home.widget.drawdown.remaining'),
        remainingKind: 'drawdown',
        maskKinds: ['drawdown'],
        getStatusColor,
        getCompleteLabel: (item) =>
          item.percent >= 100 ? t('home.widget.drawdown.breached') : '',
        completePercentageClassName:
          'journalit-home-account-progress__percentage--breached',
        onAccountClick: handleAccountClick,
      }}
    />
  );
};

export const DrawdownMonitorWidget = memo(DrawdownMonitorWidgetComponent);
