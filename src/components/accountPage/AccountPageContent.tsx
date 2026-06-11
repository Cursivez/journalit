

import React, { useEffect } from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { useAccountPageData } from './context/AccountPageDataContext';
import { EmptyState } from '../shared/EmptyState';
import {
  AccountHeader,
  AccountMetrics,
  AccountBalanceSection,
  AccountRiskMetricsSection,
} from './components';
import { DepositsWithdrawalsSection } from './components/DepositsWithdrawalsSection';
import { AccountPageSkeleton } from './AccountPageSkeleton';
import { t } from '../../lang/helpers';
import { usePlugin } from '../../hooks/usePlugin';
import {
  ACCOUNT_PAGE_EMPTY_GUIDE_ID,
  ACCOUNT_PAGE_MAIN_GUIDE_ID,
} from '../../guides/accountPageGuideIds';






const AccountPageGuideCoordinator: React.FC<{
  leaf: WorkspaceLeaf;
}> = ({ leaf }) => {
  const plugin = usePlugin();
  const { accountPageData, isLoading, error } = useAccountPageData();

  useEffect(() => {
    const guideService = plugin?.viewGuideService;
    if (!guideService) {
      return;
    }

    if (isLoading || !!error || !accountPageData) {
      guideService.setResolvedGuideForLeaf(leaf, null);
      return;
    }

    const resolvedGuideId =
      accountPageData.trades.length === 0
        ? ACCOUNT_PAGE_EMPTY_GUIDE_ID
        : ACCOUNT_PAGE_MAIN_GUIDE_ID;

    const activeSession = guideService.getSessionForLeaf(
      leaf,
      'journalit-account-page-view'
    );
    if (activeSession && activeSession.guideId !== resolvedGuideId) {
      void guideService.clearGuideState(activeSession.guideId);
    }

    guideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
  }, [accountPageData, error, isLoading, leaf, plugin]);

  useEffect(() => {
    return () => {
      plugin?.viewGuideService?.setResolvedGuideForLeaf(leaf, null);
    };
  }, [leaf, plugin]);

  return null;
};


export const AccountPageContent: React.FC<{ leaf: WorkspaceLeaf }> = ({
  leaf,
}) => {
  const { accountPageData, isLoading, error, accountName } =
    useAccountPageData();

  
  if (isLoading && !accountPageData) {
    return (
      <>
        <AccountPageGuideCoordinator leaf={leaf} />
        <AccountPageSkeleton />
      </>
    );
  }

  
  if (error) {
    return (
      <>
        <AccountPageGuideCoordinator leaf={leaf} />
        <div className="account-page-error">
          <h3>{t('account-page.error.title')}</h3>
          <p>{error.message}</p>
        </div>
      </>
    );
  }

  
  if (!accountPageData) {
    return (
      <>
        <AccountPageGuideCoordinator leaf={leaf} />
        <EmptyState
          message={t('account-page.error.not-found', {
            accountName: String(accountName),
          })}
          subMessage={t('account-page.error.not-found-sub')}
        />
      </>
    );
  }

  return (
    <div className="account-page-content">
      <AccountPageGuideCoordinator leaf={leaf} />
      
      <AccountHeader />

      
      <AccountBalanceSection />

      
      <AccountMetrics />

      
      <AccountRiskMetricsSection />

      
      <DepositsWithdrawalsSection />
    </div>
  );
};
