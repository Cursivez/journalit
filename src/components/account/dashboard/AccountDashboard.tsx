

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useTransition,
  useDeferredValue,
} from 'react';
import { WorkspaceLeaf } from 'obsidian';
import { Plus, MoreHorizontal } from '../../shared/icons/ObsidianIcon';
import { t } from '../../../lang/helpers';
import { EmptyState } from '../../shared/EmptyState';
import { AccountData } from '../../../services/account/types';
import type { AccountPageData } from '../../../services/accountPage/types';
import { OptionType } from '../../../services/options/CustomOptionsService';
import type { TradeType } from '../../../services/tradelog/types';
import { AccountDashboardProps } from './types';
import { AUMChart } from './AUMChart';
import { DashboardMetrics } from './DashboardMetrics';
import { AccountSections } from './AccountSection';
import { AccountTypeWeights } from './AccountTypeWeights';
import { AccountDashboardSkeleton } from './AccountDashboardSkeleton';
import { IconButton } from '../../ui/IconButton';
import { openCreateAccountModal } from '../../accountPage/components/CreateAccountModal';
import {
  AccountDashboardSettingsModal,
  openAccountDashboardSettingsModal,
} from './AccountDashboardSettingsModal';
import { ACCOUNT_DASHBOARD_VIEW_TYPE } from '../../../views/AccountDashboardView';
import {
  calculateDashboardMetrics,
  generateAUMChartData,
  getDisplayAccountTypeKeys,
  getDisplayAccountTypes,
  groupAccountsByType,
  getWithdrawalAccountsForDashboard,
} from './utils';
import { useEventBus, useEventBusMultiple } from '../../../hooks/useEventBus';
import { useLeafActive } from '../../../hooks/useLeafActive';
import type { EventMap } from '../../../services/events/types';
import { RegularBacktestTradeTypeFilter } from '../../shared/RegularBacktestTradeTypeFilter';
import { SegmentedControl } from '../../shared/SegmentedControl';
import { normalizeHomeTradeTypes } from '../../home/utils/homeTradeTypeUtils';
import { SampleJournalEntryButton } from '../../shared/SampleJournalControls';
import { ChallengeOverview } from './ChallengeOverview';
import { ChallengeEmptyState } from './ChallengeEmptyState';
import { openLegacyChallengeOnboardingModal } from '../../onboarding/legacyChallenge/LegacyChallengeOnboardingModal';
import { useGuideContextValue } from '../../../guides/GuideRuntimeLayer';
import { LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY } from '../../../services/accountMerge/LegacyChallengeOnboarding';
import {
  useGuideAction,
  useGuideCurrentStepId,
  useGuideTarget,
} from '../../../guides/GuideRuntimeLayer';
import {
  ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_CHALLENGES_SELECTED_ACTION_ID,
  ACCOUNT_DASHBOARD_AUM_CHART_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_EMPTY_STATE_TARGET_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID,
  ACCOUNT_DASHBOARD_METRICS_TARGET_ID,
  ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID,
  ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_STAGES_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID,
  ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID,
  ACCOUNT_DASHBOARD_CHALLENGE_OVERVIEW_TARGET_ID,
  ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID,
} from '../../../guides/accountDashboardGuideIds';
import { resolveContextualGuideId } from '../../../guides/contextualGuideResolution';
import { resolveAccountDashboardBaseGuideId } from '../../../guides/accountDashboardGuideResolution';








const DASHBOARD_EVENTS: (keyof EventMap)[] = [
  'account:changed',
  'options:changed',
  'trade:changed',
  'backtest-trade:changed',
];

type AccountDashboardMode = 'accountOverview' | 'challenges';

function normalizeAccountDashboardMode(value: unknown): AccountDashboardMode {
  return value === 'challenges' ? 'challenges' : 'accountOverview';
}


const AccountDashboardGuideCoordinator: React.FC<{
  plugin: AccountDashboardProps['plugin'];
  leaf: WorkspaceLeaf;
  isLoading: boolean;
  error: string | null;
  accountsCount: number;
  isSettingsModalOpen: boolean;
}> = ({
  plugin,
  leaf,
  isLoading,
  error,
  accountsCount,
  isSettingsModalOpen,
}) => {
  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    if (isLoading || !!error) {
      guideService.setResolvedGuideForLeaf(leaf, null);
      return;
    }

    const activeSession = guideService.getSessionForLeaf(
      leaf,
      ACCOUNT_DASHBOARD_VIEW_TYPE
    );
    const baseGuideId = resolveAccountDashboardBaseGuideId({
      accountsCount,
      mainGuideState: guideService.getPersistedGuideState(
        ACCOUNT_DASHBOARD_MAIN_GUIDE_ID
      ),
      whatsNewGuideState: guideService.getPersistedGuideState(
        ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID
      ),
    });
    const resolvedGuideId = resolveContextualGuideId({
      baseGuideId,
      contextualGuides: [
        {
          guideId: ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID,
          active: isSettingsModalOpen,
        },
      ],
      activeSessionGuideId: activeSession?.guideId ?? null,
      getPersistedState: (guideId) =>
        guideService.getPersistedGuideState(guideId),
    });

    if (
      activeSession &&
      activeSession.guideId !== resolvedGuideId &&
      activeSession.guideId !== ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID &&
      resolvedGuideId !== ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID
    ) {
      void guideService.clearGuideState(activeSession.guideId);
    }

    guideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
  }, [accountsCount, error, isLoading, isSettingsModalOpen, leaf, plugin]);

  useEffect(() => {
    return () => {
      plugin.viewGuideService?.setResolvedGuideForLeaf(leaf, null);
    };
  }, [leaf, plugin]);

  return null;
};

interface AccountDashboardHeaderProps {
  mode: AccountDashboardMode;
  showModeSwitch: boolean;
  onModeChange: (mode: AccountDashboardMode) => void | Promise<void>;
  selectedTradeTypes: TradeType[];
  onTradeTypeFilterChange: (tradeTypes: TradeType[]) => void | Promise<void>;
  onCreateAccount: () => void | Promise<void>;
  onOpenSettings: () => void | Promise<void>;
  registerTradeTypeFilterTarget: React.Ref<HTMLDivElement>;
  registerModeSwitchTarget: React.Ref<HTMLDivElement>;
  registerCreateButtonTarget: React.Ref<HTMLDivElement>;
  registerSettingsButtonTarget: React.Ref<HTMLDivElement>;
}

const markGuidePrimaryAction = (element: HTMLButtonElement | null): void => {
  element?.setAttribute('data-guide-primary-action', '');
};

const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
  mode,
  showModeSwitch,
  onModeChange,
  selectedTradeTypes,
  onTradeTypeFilterChange,
  onCreateAccount,
  onOpenSettings,
  registerTradeTypeFilterTarget,
  registerModeSwitchTarget,
  registerCreateButtonTarget,
  registerSettingsButtonTarget,
}) => (
  <div
    className={`dashboard-header${showModeSwitch ? ' has-mode-switch' : ''}`}
  >
    <div aria-hidden="true" className="dashboard-header-spacer" />
    {showModeSwitch && (
      <div
        className="journalit-account-dashboard-mode-switch"
        ref={registerModeSwitchTarget}
      >
        <SegmentedControl
          ariaLabel={t('account-dashboard.mode.selector')}
          className="journalit-account-dashboard-mode-control"
          fullWidth
          groupRole="radiogroup"
          
          
          getOptionRef={(value) =>
            value === 'challenges' ? markGuidePrimaryAction : undefined
          }
          onChange={(nextMode) => void onModeChange(nextMode)}
          options={[
            {
              value: 'accountOverview',
              label: t('account-dashboard.mode.account-overview'),
            },
            {
              value: 'challenges',
              label: t('account-dashboard.mode.challenges'),
            },
          ]}
          size="medium"
          value={mode}
        />
      </div>
    )}
    <div className="dashboard-actions">
      <div ref={registerTradeTypeFilterTarget}>
        <RegularBacktestTradeTypeFilter
          selectedTradeTypes={selectedTradeTypes}
          onChange={(tradeTypes) => void onTradeTypeFilterChange(tradeTypes)}
          className="account-dashboard-trade-type-filter"
        />
      </div>
      <div ref={registerCreateButtonTarget}>
        <IconButton
          ariaLabel={t('account-dashboard.action.create')}
          onClick={() => void onCreateAccount()}
          variant="toolbar"
          className="create-account-button"
        >
          <Plus size={16} />
        </IconButton>
      </div>
      <div ref={registerSettingsButtonTarget}>
        <IconButton
          ariaLabel={t('account-dashboard.action.settings')}
          onClick={() => void onOpenSettings()}
          variant="toolbar"
          className="settings-button"
        >
          <MoreHorizontal size={16} />
        </IconButton>
      </div>
    </div>
  </div>
);

interface AccountDashboardEmptyStateProps {
  header: React.ReactNode;
  onCreateAccount: () => void | Promise<void>;
  registerEmptyStateTarget: (element: HTMLElement | null) => void;
  registerCreateAccountButtonTarget: (element: HTMLElement | null) => void;
}

const AccountDashboardEmptyState: React.FC<AccountDashboardEmptyStateProps> = ({
  header,
  onCreateAccount,
  registerEmptyStateTarget,
  registerCreateAccountButtonTarget,
}) => (
  <div className="dashboard-content">
    {header}
    <div ref={registerEmptyStateTarget}>
      <EmptyState
        className="journalit-account-dashboard-empty-state"
        message={t('account-dashboard.empty.title')}
        subMessage={t('account-dashboard.empty.message')}
        iconSize={56}
        actionButtonText={t('account-dashboard.button.create-first')}
        onActionButtonClick={() => void onCreateAccount()}
        actionButtonRef={registerCreateAccountButtonTarget}
        additionalAction={<SampleJournalEntryButton />}
        actionsLayout="stacked"
      />
    </div>
  </div>
);

interface AccountDashboardMainContentProps {
  onCreateChallenge: () => void;
  onSetUpExisting: () => void;
  hasLegacyAccounts: boolean;
  header: React.ReactNode;
  mode: AccountDashboardMode;
  aumChartData: ReturnType<typeof generateAUMChartData>;
  plugin: AccountDashboardProps['plugin'];
  metrics: ReturnType<typeof calculateDashboardMetrics>;
  withdrawalAccounts: AccountData[];
  accounts: AccountData[];
  accountsByType: ReturnType<typeof groupAccountsByType>;
  challengeAccountsByType: ReturnType<typeof groupAccountsByType>;
  accountTypesToDisplay: string[];
  totalAUM: number;
  challengeTotalAUM: number;
  excludedTypes: string[];
  openAccount: (accountName: string, accountData?: unknown) => Promise<void>;
  refreshTrigger: number;
  propChallengeAccounts: AccountPageData[];
  propChallengeDataByAccountId: ReadonlyMap<string, AccountPageData>;
  tradingDayCutoffTime?: string;
  registerAumChartTarget: React.Ref<HTMLDivElement>;
  registerChallengeOverviewTarget: React.Ref<HTMLDivElement>;
  registerMetricsTarget: React.Ref<HTMLDivElement>;
  registerSectionsTarget: React.Ref<HTMLDivElement>;
}

const AccountDashboardMainContent: React.FC<
  AccountDashboardMainContentProps
> = ({
  header,
  mode,
  aumChartData,
  plugin,
  metrics,
  withdrawalAccounts,
  accounts,
  accountsByType,
  challengeAccountsByType,
  accountTypesToDisplay,
  totalAUM,
  challengeTotalAUM,
  excludedTypes,
  openAccount,
  refreshTrigger,
  propChallengeAccounts,
  propChallengeDataByAccountId,
  tradingDayCutoffTime,
  registerAumChartTarget,
  registerChallengeOverviewTarget,
  registerMetricsTarget,
  registerSectionsTarget,
  onCreateChallenge,
  onSetUpExisting,
  hasLegacyAccounts,
}) => (
  <div className="dashboard-content">
    {header}
    {mode === 'accountOverview' ? (
      <>
        <div className="journalit-account-dashboard-hero">
          <div
            className="journalit-account-dashboard-hero-chart"
            ref={registerAumChartTarget}
          >
            <AUMChart data={aumChartData} plugin={plugin} />
          </div>
        </div>
        <div ref={registerMetricsTarget}>
          <DashboardMetrics
            metrics={metrics}
            withdrawalAccounts={withdrawalAccounts}
          />
        </div>
        <AccountTypeWeights
          accounts={accounts}
          accountsByType={accountsByType}
          accountTypesToDisplay={accountTypesToDisplay}
          totalAUM={totalAUM}
          excludedTypes={excludedTypes}
          showLegend={true}
        />
      </>
    ) : propChallengeAccounts.length === 0 ? (
      <div>
        <ChallengeEmptyState
          onCreateChallenge={onCreateChallenge}
          onSetUpExisting={hasLegacyAccounts ? onSetUpExisting : undefined}
        />
      </div>
    ) : (
      <div ref={registerChallengeOverviewTarget}>
        <ChallengeOverview accounts={propChallengeAccounts} />
      </div>
    )}
    {mode === 'challenges' && propChallengeAccounts.length === 0 ? null : (
      <div ref={registerSectionsTarget}>
        <AccountSections
          accountsByType={
            mode === 'challenges' ? challengeAccountsByType : accountsByType
          }
          openAccount={openAccount}
          plugin={plugin}
          refreshTrigger={refreshTrigger}
          totalAUM={mode === 'challenges' ? challengeTotalAUM : totalAUM}
          excludedTypes={excludedTypes}
          propChallengeDataByAccountId={propChallengeDataByAccountId}
          tradingDayCutoffTime={tradingDayCutoffTime}
        />
      </div>
    )}
  </div>
);

interface AccountDashboardLoadedContentProps extends AccountDashboardMainContentProps {
  leaf: WorkspaceLeaf;
  isSettingsModalOpen: boolean;
}

const AccountDashboardLoadedContent: React.FC<
  AccountDashboardLoadedContentProps
> = ({ leaf, isSettingsModalOpen, ...mainContentProps }) => {
  return (
    <>
      <AccountDashboardGuideCoordinator
        plugin={mainContentProps.plugin}
        leaf={leaf}
        isLoading={false}
        error={null}
        accountsCount={mainContentProps.accounts.length}
        isSettingsModalOpen={isSettingsModalOpen}
      />
      <div className="journalit-account-dashboard">
        <AccountDashboardMainContent {...mainContentProps} />
      </div>
    </>
  );
};

const AccountDashboardNonDataState: React.FC<{
  plugin: AccountDashboardProps['plugin'];
  leaf: WorkspaceLeaf;
  isLoading: boolean;
  error: string | null;
  accountsCount: number;
  isSettingsModalOpen: boolean;
  header: React.ReactNode;
  onCreateAccount: () => void | Promise<void>;
  
  registerEmptyStateTarget: (element: HTMLElement | null) => void;
  registerCreateAccountButtonTarget: (element: HTMLElement | null) => void;
}> = ({
  plugin,
  leaf,
  isLoading,
  error,
  accountsCount,
  isSettingsModalOpen,
  header,
  onCreateAccount,
  registerEmptyStateTarget,
  registerCreateAccountButtonTarget,
}) => (
  <>
    <AccountDashboardGuideCoordinator
      plugin={plugin}
      leaf={leaf}
      isLoading={isLoading}
      error={error}
      accountsCount={accountsCount}
      isSettingsModalOpen={isSettingsModalOpen}
    />
    <div className={`journalit-account-dashboard${error ? ' error' : ''}`}>
      {isLoading ? (
        <AccountDashboardSkeleton />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <AccountDashboardEmptyState
          header={header}
          onCreateAccount={onCreateAccount}
          registerEmptyStateTarget={registerEmptyStateTarget}
          registerCreateAccountButtonTarget={registerCreateAccountButtonTarget}
        />
      )}
    </div>
  </>
);

const useAccountDashboardAccounts = (
  plugin: AccountDashboardProps['plugin'],
  selectedTradeTypes: TradeType[]
) => {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [propChallengeAccounts, setPropChallengeAccounts] = useState<
    AccountPageData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryAttemptsRef = useRef(0);
  const maxRetries = 5;
  const retryTimeoutRef = useRef<number | null>(null);
  const loadRequestSequenceRef = useRef(0);
  const hasLoadedAccountsRef = useRef(false);

  const loadAccountsWithRetry = useCallback(async () => {
    const requestSequence = ++loadRequestSequenceRef.current;

    try {
      if (!hasLoadedAccountsRef.current) {
        setIsLoading(true);
      }
      setError(null);

      if (!plugin.accountPageService) {
        retryAttemptsRef.current += 1;
        if (retryAttemptsRef.current > maxRetries) {
          retryAttemptsRef.current = 0;
          throw new Error(t('account-dashboard.error.init'));
        }

        const delay = 300 * Math.pow(2, retryAttemptsRef.current - 1);
        console.warn(
          t('account-dashboard.error.retry', {
            delay: String(delay),
            attempt: String(retryAttemptsRef.current),
            max: String(maxRetries),
          })
        );
        retryTimeoutRef.current = window.setTimeout(
          () => void loadAccountsWithRetry(),
          delay
        );
        return;
      }

      retryAttemptsRef.current = 0;
      const enhancedAccounts =
        await plugin.accountPageService.getAllEnhancedAccounts(
          selectedTradeTypes
        );
      
      
      
      
      
      const propChallengeRequests: Promise<AccountPageData | null>[] = [];
      for (const account of enhancedAccounts) {
        if (!account.propChallenge) continue;
        propChallengeRequests.push(
          plugin.accountPageService.getAccountPageData(account.name)
        );
      }
      const propChallengeData = await Promise.all(propChallengeRequests);

      if (requestSequence !== loadRequestSequenceRef.current) return;

      setAccounts(enhancedAccounts);
      setPropChallengeAccounts(
        propChallengeData.flatMap((data) => (data ? [data] : []))
      );
      hasLoadedAccountsRef.current = true;
    } catch (err) {
      if (requestSequence !== loadRequestSequenceRef.current) return;
      console.error('Error loading accounts:', err);
      setError(
        t('account-dashboard.error.loading', {
          error: err instanceof Error ? err.message : String(err),
        })
      );
    } finally {
      if (
        requestSequence === loadRequestSequenceRef.current &&
        retryAttemptsRef.current === 0
      ) {
        setIsLoading(false);
      }
    }
  }, [plugin, selectedTradeTypes]);

  useEffect(() => {
    void loadAccountsWithRetry();
    return () => {
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [loadAccountsWithRetry]);

  return {
    accounts,
    propChallengeAccounts,
    isLoading,
    error,
    loadAccountsWithRetry,
  };
};

const useAccountDashboardGuideTargets = () => ({
  registerTradeTypeFilterTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID
  ),
  registerModeSwitchTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID
  ),
  registerChallengeOverviewTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_CHALLENGE_OVERVIEW_TARGET_ID
  ),
  registerCreateAccountButtonTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_CREATE_ACCOUNT_BUTTON_TARGET_ID
  ),
  registerCreateButtonTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID
  ),
  registerSettingsButtonTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_SETTINGS_BUTTON_TARGET_ID
  ),
  registerEmptyStateTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_EMPTY_STATE_TARGET_ID
  ),
  registerAumChartTarget: useGuideTarget(ACCOUNT_DASHBOARD_AUM_CHART_TARGET_ID),
  registerMetricsTarget: useGuideTarget(ACCOUNT_DASHBOARD_METRICS_TARGET_ID),
  registerSectionsTarget: useGuideTarget(ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID),
  registerSettingsTypesTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID
  ),
  registerSettingsStagesTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_SETTINGS_STAGES_TARGET_ID
  ),
  registerSettingsInclusionTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID
  ),
  registerSettingsOrderTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID
  ),
});

const useAccountDashboardDerivedData = (
  accounts: AccountData[],
  plugin: AccountDashboardProps['plugin'],
  refreshTrigger: number,
  deferredSearchTerm: string
) => {
  const configuredAccountTypeOrder = useMemo(
    () => plugin.settings.account?.accountTypeOrder,
    [plugin.settings.account?.accountTypeOrder]
  );
  const customAccountTypes = useMemo(() => {
    void refreshTrigger;
    return plugin.optionsService?.getOptions?.(OptionType.ACCOUNT_TYPE) || [];
  }, [plugin.optionsService, refreshTrigger]);
  const displayAccountTypeKeys = useMemo(
    () =>
      getDisplayAccountTypeKeys(configuredAccountTypeOrder, customAccountTypes),
    [configuredAccountTypeOrder, customAccountTypes]
  );
  const displayableAccounts = useMemo(() => {
    const displayTypeKeySet = new Set(displayAccountTypeKeys);
    return accounts.filter(
      (account) =>
        account.accountType &&
        displayTypeKeySet.has(account.accountType.toLowerCase())
    );
  }, [accounts, displayAccountTypeKeys]);
  const metrics = useMemo(
    () => calculateDashboardMetrics(displayableAccounts, plugin.settings),
    [displayableAccounts, plugin.settings]
  );
  const withdrawalAccounts = useMemo(
    () =>
      getWithdrawalAccountsForDashboard(displayableAccounts, plugin.settings),
    [displayableAccounts, plugin.settings]
  );
  const excludedTypes = useMemo(
    () => plugin.settings?.account?.excludedAccountTypes || ['archived'],
    [plugin.settings]
  );
  const totalAUM = useMemo(() => {
    const excludedTypesSet = new Set(excludedTypes);
    return displayableAccounts
      .filter(
        (account) =>
          account.accountType &&
          !excludedTypesSet.has(account.accountType.toLowerCase())
      )
      .reduce((sum, account) => sum + account.currentBalance, 0);
  }, [displayableAccounts, excludedTypes]);
  const aumChartData = useMemo(
    () => generateAUMChartData(displayableAccounts, plugin.settings),
    [displayableAccounts, plugin.settings]
  );
  const filteredAccounts = useMemo(() => {
    if (!deferredSearchTerm) return displayableAccounts;
    return displayableAccounts.filter((account) =>
      account.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
  }, [displayableAccounts, deferredSearchTerm]);
  const accountsByType = useMemo(
    () => groupAccountsByType(filteredAccounts),
    [filteredAccounts]
  );
  const accountTypesToDisplay = useMemo(() => {
    if (refreshTrigger < 0) return [];
    return getDisplayAccountTypes(
      accountsByType,
      configuredAccountTypeOrder,
      customAccountTypes
    );
  }, [
    accountsByType,
    configuredAccountTypeOrder,
    customAccountTypes,
    refreshTrigger,
  ]);
  return {
    metrics,
    withdrawalAccounts,
    excludedTypes,
    totalAUM,
    aumChartData,
    accountsByType,
    accountTypesToDisplay,
  };
};



const AccountDashboardComponent: React.FC<AccountDashboardProps> = ({
  plugin,
  leaf,
}) => {
  const isActive = useLeafActive(leaf);
  const wasActiveRef = useRef(isActive);
  useGuideContextValue(
    LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY,
    plugin.settings.account?.legacyChallengeOnboarding?.status === 'pending'
  );
  
  const [searchTerm] = useState('');
  const [selectedTradeTypes, setSelectedTradeTypes] = useState<TradeType[]>(
    () =>
      normalizeHomeTradeTypes(
        plugin.uiStateManager.getState().selectedAccountDashboardTradeTypes
      )
  );
  const [mode, setMode] = useState<AccountDashboardMode>(() =>
    normalizeAccountDashboardMode(
      plugin.uiStateManager.getState().accountDashboardMode
    )
  );
  const emitGuideAction = useGuideAction();
  const {
    registerTradeTypeFilterTarget,
    registerModeSwitchTarget,
    registerChallengeOverviewTarget,
    registerCreateAccountButtonTarget,
    registerCreateButtonTarget,
    registerSettingsButtonTarget,
    registerEmptyStateTarget,
    registerAumChartTarget,
    registerMetricsTarget,
    registerSectionsTarget,
    registerSettingsTypesTarget,
    registerSettingsStagesTarget,
    registerSettingsInclusionTarget,
    registerSettingsOrderTarget,
  } = useAccountDashboardGuideTargets();

  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const activeSettingsModalRef = useRef<AccountDashboardSettingsModal | null>(
    null
  );

  
  const [, startTransition] = useTransition();
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const {
    accounts,
    propChallengeAccounts,
    isLoading,
    error,
    loadAccountsWithRetry,
  } = useAccountDashboardAccounts(plugin, selectedTradeTypes);
  const propChallengeDataByAccountId = useMemo(
    () => new Map(propChallengeAccounts.map((data) => [data.account.id, data])),
    [propChallengeAccounts]
  );
  const effectiveMode = mode;

  
  const handleAccountChanged = useCallback(async () => {
    
    if (plugin.accountPageService) {
      await plugin.accountPageService.refreshAllAccountData();
    }

    
    startTransition(() => {
      void loadAccountsWithRetry();
    });
  }, [loadAccountsWithRetry, plugin.accountPageService]);

  
  useEventBusMultiple(DASHBOARD_EVENTS, handleAccountChanged, isActive);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      void handleAccountChanged();
    }
    wasActiveRef.current = isActive;
  }, [handleAccountChanged, isActive]);

  useEventBus(
    'settings:changed',
    (payload) => {
      if (payload?.section === 'copyTradeAdjustments') {
        void handleAccountChanged();
        return;
      }

      if (
        payload &&
        payload.component &&
        payload.component !== 'account-dashboard'
      ) {
        return;
      }

      setRefreshTrigger((prev) => prev + 1);
    },
    isActive
  );

  const handleTradeTypeFilterChange = useCallback(
    async (tradeTypes: TradeType[]) => {
      const normalizedTradeTypes = normalizeHomeTradeTypes(tradeTypes);
      setSelectedTradeTypes(normalizedTradeTypes);
      await plugin.uiStateManager.updateState({
        selectedAccountDashboardTradeTypes: normalizedTradeTypes,
      });
    },
    [plugin]
  );

  const handleModeChange = useCallback(
    async (nextMode: AccountDashboardMode) => {
      setMode(nextMode);
      if (nextMode === 'challenges') {
        emitGuideAction(ACCOUNT_DASHBOARD_CHALLENGES_SELECTED_ACTION_ID);
      }
      await plugin.uiStateManager.updateStateImmediate({
        accountDashboardMode: nextMode,
      });
    },
    [emitGuideAction, plugin]
  );

  
  
  
  const currentGuideStepId = useGuideCurrentStepId();
  useEffect(() => {
    if (
      currentGuideStepId === 'mode-switch' &&
      effectiveMode === 'challenges'
    ) {
      emitGuideAction(ACCOUNT_DASHBOARD_CHALLENGES_SELECTED_ACTION_ID);
    }
  }, [currentGuideStepId, effectiveMode, emitGuideAction]);

  const {
    metrics,
    withdrawalAccounts,
    excludedTypes,
    totalAUM,
    aumChartData,
    accountsByType,
    accountTypesToDisplay,
  } = useAccountDashboardDerivedData(
    accounts,
    plugin,
    refreshTrigger,
    deferredSearchTerm
  );
  const challengeAccountsByType = useMemo(() => {
    const grouped: Record<string, AccountData[]> = {};
    for (const [accountType, typeAccounts] of Object.entries(accountsByType)) {
      const challengeAccounts = typeAccounts.filter((account) =>
        propChallengeDataByAccountId.has(account.id)
      );
      if (challengeAccounts.length > 0) {
        grouped[accountType] = challengeAccounts;
      }
    }
    return grouped;
  }, [accountsByType, propChallengeDataByAccountId]);
  const challengeTotalAUM = useMemo(() => {
    const excludedTypesSet = new Set(excludedTypes);
    return Object.entries(challengeAccountsByType).reduce(
      (total, [accountType, typeAccounts]) =>
        excludedTypesSet.has(accountType.toLowerCase())
          ? total
          : total +
            typeAccounts.reduce(
              (typeTotal, account) => typeTotal + account.currentBalance,
              0
            ),
      0
    );
  }, [challengeAccountsByType, excludedTypes]);

  
  const openAccount = useCallback(
    async (accountName: string, _accountData?: AccountData) => {
      emitGuideAction(ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID);
      void plugin.viewManager.openAccountPageView(accountName);
    },
    [emitGuideAction, plugin.viewManager]
  );

  const handleCreateChallenge = useCallback(() => {
    openCreateAccountModal(
      plugin.app,
      plugin,
      () => {
        void handleAccountChanged();
      },
      { initialPropChallenge: true }
    );
  }, [handleAccountChanged, plugin]);

  const handleSetUpExisting = useCallback(() => {
    void openLegacyChallengeOnboardingModal(plugin.app, plugin);
  }, [plugin]);

  const hasLegacyAccounts = useMemo(
    () =>
      accounts.some(
        (account) =>
          !account.propChallenge &&
          account.accountType?.toLowerCase() !== 'archived'
      ),
    [accounts]
  );

  
  const handleCreateAccount = useCallback(async () => {
    openCreateAccountModal(plugin.app, plugin, () => {
      
      void loadAccountsWithRetry();
    });
    emitGuideAction(ACCOUNT_DASHBOARD_CREATE_ACCOUNT_OPENED_ACTION_ID);
  }, [emitGuideAction, plugin, loadAccountsWithRetry]);

  const isSettingsModalActive = useCallback((): boolean => {
    return activeSettingsModalRef.current?.modalEl.isConnected === true;
  }, []);

  
  const handleOpenSettings = useCallback(async () => {
    if (isSettingsModalActive()) {
      return;
    }

    const modal = openAccountDashboardSettingsModal(
      plugin.app,
      plugin,
      () => {
        
        setRefreshTrigger((prev) => prev + 1);

        
        void loadAccountsWithRetry();
      },
      {
        onClose: () => {
          activeSettingsModalRef.current = null;
          setIsSettingsModalOpen(false);
        },
        registerTypesTarget: registerSettingsTypesTarget,
        registerStagesTarget: registerSettingsStagesTarget,
        registerInclusionTarget: registerSettingsInclusionTarget,
        registerOrderTarget: registerSettingsOrderTarget,
      }
    );
    activeSettingsModalRef.current = modal;
    setIsSettingsModalOpen(true);
    emitGuideAction(ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID);
  }, [
    emitGuideAction,
    isSettingsModalActive,
    loadAccountsWithRetry,
    plugin,
    registerSettingsInclusionTarget,
    registerSettingsOrderTarget,
    registerSettingsStagesTarget,
    registerSettingsTypesTarget,
  ]);

  const dashboardHeader = (
    <AccountDashboardHeader
      mode={effectiveMode}
      showModeSwitch={true}
      onModeChange={handleModeChange}
      selectedTradeTypes={selectedTradeTypes}
      onTradeTypeFilterChange={handleTradeTypeFilterChange}
      onCreateAccount={() => void handleCreateAccount()}
      onOpenSettings={() => void handleOpenSettings()}
      registerTradeTypeFilterTarget={registerTradeTypeFilterTarget}
      registerModeSwitchTarget={registerModeSwitchTarget}
      registerCreateButtonTarget={registerCreateButtonTarget}
      registerSettingsButtonTarget={registerSettingsButtonTarget}
    />
  );

  
  
  
  
  if (!isLoading && !error && accounts.length === 0 && mode === 'challenges') {
    return (
      <>
        {dashboardHeader}
        <div>
          <ChallengeEmptyState
            onCreateChallenge={() => void handleCreateChallenge()}
            onSetUpExisting={
              hasLegacyAccounts ? () => void handleSetUpExisting() : undefined
            }
          />
        </div>
      </>
    );
  }

  if (isLoading || error || accounts.length === 0) {
    return (
      <AccountDashboardNonDataState
        plugin={plugin}
        leaf={leaf}
        isLoading={isLoading}
        error={error}
        accountsCount={accounts.length}
        isSettingsModalOpen={isSettingsModalOpen}
        header={dashboardHeader}
        onCreateAccount={() => void handleCreateAccount()}
        registerEmptyStateTarget={registerEmptyStateTarget}
        registerCreateAccountButtonTarget={registerCreateAccountButtonTarget}
      />
    );
  }

  
  return (
    <AccountDashboardLoadedContent
      isSettingsModalOpen={isSettingsModalOpen}
      header={dashboardHeader}
      mode={effectiveMode}
      aumChartData={aumChartData}
      plugin={plugin}
      metrics={metrics}
      withdrawalAccounts={withdrawalAccounts}
      accounts={accounts}
      accountsByType={accountsByType}
      challengeAccountsByType={challengeAccountsByType}
      onCreateChallenge={handleCreateChallenge}
      onSetUpExisting={handleSetUpExisting}
      hasLegacyAccounts={hasLegacyAccounts}
      accountTypesToDisplay={accountTypesToDisplay}
      totalAUM={totalAUM}
      challengeTotalAUM={challengeTotalAUM}
      excludedTypes={excludedTypes}
      openAccount={openAccount}
      refreshTrigger={refreshTrigger}
      propChallengeAccounts={propChallengeAccounts}
      propChallengeDataByAccountId={propChallengeDataByAccountId}
      tradingDayCutoffTime={plugin.settings.trade?.tradingDayCutoffTime}
      registerAumChartTarget={registerAumChartTarget}
      registerChallengeOverviewTarget={registerChallengeOverviewTarget}
      registerMetricsTarget={registerMetricsTarget}
      registerSectionsTarget={registerSectionsTarget}
      leaf={leaf}
    />
  );
};


export const AccountDashboard = React.memo(AccountDashboardComponent);
