

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
import {
  AccountProgressListItem,
  AccountProgressListWidget,
  AccountProgressLoading,
  AccountProgressState,
} from './AccountProgressListWidget';

interface ProfitTargetWidgetProps {
  plugin: JournalitPlugin;
}

type ProfitTargetStatus = 'early' | 'progress' | 'achieved';

interface ProfitTargetMetrics {
  accounts: AccountProgressListItem<ProfitTargetStatus>[];
}

const MAX_ACCOUNTS = 3;
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

interface ProfitTargetContentProps {
  data: ProfitTargetMetrics;
  onAccountClick: (accountName: string) => void;
}

const ProfitTargetContent: React.FC<ProfitTargetContentProps> = ({
  data,
  onAccountClick,
}) => {
  return (
    <AccountProgressListWidget
      title={t('home.widget.profit-target.title')}
      items={data.accounts}
      remainingLabel={t('home.widget.profit-target.remaining')}
      remainingKind="money"
      maskKinds={['money', 'percentage']}
      getStatusColor={getStatusColor}
      getCompleteLabel={(item) =>
        item.percent >= 100 ? t('home.widget.profit-target.achieved') : ''
      }
      completePercentageClassName="journalit-home-account-progress__percentage--achieved"
      onAccountClick={onAccountClick}
    />
  );
};

const ProfitTargetWidgetComponent: React.FC<ProfitTargetWidgetProps> = ({
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

  const profitTargetMetrics = useMemo((): ProfitTargetMetrics | null => {
    if (accounts.length === 0) return null;

    const accountsWithTargets = accounts.filter(
      (acc) =>
        acc.hasProfitTarget &&
        acc.profitTarget > 0 &&
        acc.accountType?.toLowerCase() !== 'archived' &&
        (accountContext?.matchesAccount(acc.accountName || acc.name) ?? true)
    );

    if (accountsWithTargets.length === 0) return null;

    const accountInfos: AccountProgressListItem<ProfitTargetStatus>[] =
      accountsWithTargets.map((acc) => {
        const progressPercent = calculateProfitTargetProgress(acc);
        const targetAmount =
          acc.profitTargetType === ProfitTargetType.PERCENTAGE
            ? (acc.initialBalance * acc.profitTarget) / 100
            : acc.profitTarget;
        const remaining = Math.max(
          0,
          targetAmount - calculateAccountGrowthAmount(acc)
        );
        const accountName = acc.accountName || acc.name || 'Unknown';

        return {
          name: accountName,
          accountName,
          currencyCode: acc.metrics.conversionBaseCurrency ?? acc.currency,
          percent: progressPercent,
          remaining,
          status: getProfitTargetStatus(progressPercent),
        };
      });

    accountInfos.sort((a, b) => b.percent - a.percent);

    return { accounts: accountInfos.slice(0, MAX_ACCOUNTS) };
  }, [accounts, accountContext]);

  if (isLoading) {
    return <AccountProgressLoading titleWidth={80} />;
  }

  if (error) {
    return (
      <AccountProgressState
        title={t('home.widget.profit-target.title')}
        message={t('home.widget.profit-target.unable-to-load')}
      />
    );
  }

  if (!profitTargetMetrics) {
    return (
      <AccountProgressState
        title={t('home.widget.profit-target.title')}
        message={t('home.widget.profit-target.no-accounts')}
        icon={
          <TrendingUp
            size={24}
            className="journalit-home-account-progress__state-icon"
          />
        }
      />
    );
  }

  return (
    <ProfitTargetContent
      data={profitTargetMetrics}
      onAccountClick={handleAccountClick}
    />
  );
};

export const ProfitTargetWidget = memo(ProfitTargetWidgetComponent);
