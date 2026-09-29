

import React, { useEffect } from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { useAccountPageData } from './context/AccountPageDataContext';
import { EmptyState } from '../shared/EmptyState';
import { AccountHeader } from './components/AccountHeader';
import { AccountMetricsPanel } from './components/AccountMetricsPanel';
import { AccountBalanceSection } from './components/AccountBalanceSection';
import { AccountRiskMetricsSection } from './components/AccountRiskMetricsSection';
import { PropChallengeSection } from './components/propChallenge/PropChallengeSection';
import { DepositsWithdrawalsSection } from './components/DepositsWithdrawalsSection';
import { usePropChallengeCockpitState } from './components/propChallenge/usePropChallengeCockpitState';
import { resolveAccountPageTopState } from './components/propChallenge/propChallengeCockpitState';
import { AccountPageSkeleton } from './AccountPageSkeleton';
import { t } from '../../lang/helpers';
import { usePlugin } from '../../hooks/usePlugin';
import { useGuideContextValue } from '../../guides/GuideRuntimeLayer';
import { LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY } from '../../services/accountMerge/LegacyChallengeOnboarding';
import {
  ACCOUNT_PAGE_EMPTY_GUIDE_ID,
  ACCOUNT_PAGE_MAIN_GUIDE_LAYOUT_VERSION,
  ACCOUNT_PAGE_MAIN_GUIDE_ID,
  ACCOUNT_PAGE_WHATS_NEW_COCKPIT_GUIDE_ID,
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

    
    
    
    const mainGuideState = guideService.getPersistedGuideState(
      ACCOUNT_PAGE_MAIN_GUIDE_ID
    );
    const finishedMainGuide =
      mainGuideState?.status === 'completed' ||
      mainGuideState?.status === 'skipped';
    const finishedBeforeLayoutRedesign =
      finishedMainGuide &&
      mainGuideState.guideVersion < ACCOUNT_PAGE_MAIN_GUIDE_LAYOUT_VERSION;

    
    
    
    const whatsNewApplies =
      !!accountPageData.account.propChallenge ||
      plugin.settings.account?.legacyChallengeOnboarding?.status === 'pending';

    const resolvedGuideId = finishedBeforeLayoutRedesign
      ? whatsNewApplies
        ? ACCOUNT_PAGE_WHATS_NEW_COCKPIT_GUIDE_ID
        : null
      : accountPageData.trades.length === 0
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
  const guidePlugin = usePlugin();
  useGuideContextValue(
    LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY,
    guidePlugin?.settings.account?.legacyChallengeOnboarding?.status ===
      'pending'
  );

  
  const cockpitState = usePropChallengeCockpitState();
  const { showSummaryBand, showGenericRisk } =
    resolveAccountPageTopState(cockpitState);

  
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
      
      <AccountHeader cockpitState={cockpitState} />

      
      <AccountBalanceSection />

      
      <AccountMetricsPanel
        cockpitState={cockpitState}
        showSummaryBand={showSummaryBand}
      />

      
      {cockpitState && <PropChallengeSection state={cockpitState} />}

      
      {showGenericRisk && <AccountRiskMetricsSection />}

      
      <DepositsWithdrawalsSection />
    </div>
  );
};
