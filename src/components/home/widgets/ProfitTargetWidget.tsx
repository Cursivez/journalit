

import React, { memo, useMemo, useCallback } from 'react';
import { TrendingUp } from '../../shared/icons/ObsidianIcon';
import JournalitPlugin from '../../../main';
import { ProfitTargetType } from '../../../services/account/types';
import {
  calculateAccountGrowthAmount,
  calculateProfitTargetProgress,
} from '../../account/dashboard/utils';
import { useHomeAccount } from '../context/HomeAccountContext';
import { useHomeAccountsData } from '../context/HomeAccountsDataContext';
import { t } from '../../../lang/helpers';
import { AccountProgressListItem } from './AccountProgressListWidget';
import { ConfigurableAccountProgressWidget } from './ConfigurableAccountProgressWidget';

interface ProfitTargetWidgetProps {
  plugin: JournalitPlugin;
  instanceId?: string;
  isEditing?: boolean;
}

type ProfitTargetStatus = 'early' | 'progress' | 'achieved';
const ACHIEVED_THRESHOLD = 100;
const PROGRESS_THRESHOLD = 50;

function getProfitTargetStatus(percent: number): ProfitTargetStatus {
  if (percent >= ACHIEVED_THRESHOLD) return 'achieved';
  if (percent >= PROGRESS_THRESHOLD) return 'progress';
  return 'early';
}

function getStatusColor(status: ProfitTargetStatus): string {
  switch (status) {
    case 'achieved':
      return 'var(--color-green)';
    case 'progress':
      return 'var(--color-green)';
    case 'early':
      return 'var(--text-muted)';
  }
}

const ProfitTargetWidgetComponent: React.FC<ProfitTargetWidgetProps> = ({
  plugin,
  instanceId = 'profitTarget',
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

  
  
  const profitTargetItems = useMemo(() => {
    const accountInfos: AccountProgressListItem<ProfitTargetStatus>[] = [];
    for (const acc of accounts) {
      const accountName = acc.accountName || acc.name || 'Unknown';
      
      
      if (acc.accountType?.toLowerCase() === 'archived') continue;
      if (acc.propChallenge) {
        
        
        const target = challengeProgress?.get(acc.name)?.profitTarget;
        if (!target) continue;
        accountInfos.push({
          name: accountName,
          accountName,
          currencyCode: acc.currency,
          percent: target.percent,
          remaining: target.remaining,
          status: getProfitTargetStatus(target.percent),
        });
        continue;
      }
      if (!acc.hasProfitTarget || acc.profitTarget <= 0) continue;
      const progressPercent = calculateProfitTargetProgress(acc);
      const targetAmount =
        acc.profitTargetType === ProfitTargetType.PERCENTAGE
          ? (acc.initialBalance * acc.profitTarget) / 100
          : acc.profitTarget;
      accountInfos.push({
        name: accountName,
        accountName,
        currencyCode: acc.metrics.conversionBaseCurrency ?? acc.currency,
        percent: progressPercent,
        remaining: Math.max(
          0,
          targetAmount - calculateAccountGrowthAmount(acc)
        ),
        status: getProfitTargetStatus(progressPercent),
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
      title={t('home.widget.profit-target.title')}
      isLoading={isLoading}
      errorMessage={
        error ? t('home.widget.profit-target.unable-to-load') : null
      }
      loadingTitleWidth={80}
      items={profitTargetItems}
      automaticHint={t('home.widget.account-progress.automatic-profit-target')}
      emptyMessage={t('home.widget.profit-target.no-accounts')}
      emptyIcon={
        <TrendingUp
          size={24}
          className="journalit-home-account-progress__state-icon"
        />
      }
      listProps={{
        remainingLabel: t('home.widget.profit-target.remaining'),
        remainingKind: 'money',
        maskKinds: ['money', 'percentage'],
        getStatusColor,
        getCompleteLabel: (item) =>
          item.percent >= 100 ? t('home.widget.profit-target.achieved') : '',
        completePercentageClassName:
          'journalit-home-account-progress__percentage--achieved',
        onAccountClick: handleAccountClick,
      }}
    />
  );
};

export const ProfitTargetWidget = memo(ProfitTargetWidgetComponent);
