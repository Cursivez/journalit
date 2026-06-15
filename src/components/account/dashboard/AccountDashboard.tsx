

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
import { OptionType } from '../../../services/options/CustomOptionsService';
import type { TradeType } from '../../../services/tradelog/types';
import { AccountDashboardProps } from './types';
import { AUMChart } from './AUMChart';
import { DashboardMetrics } from './DashboardMetrics';
import { AccountSections } from './AccountSection';
import { AccountTypeWeights } from './AccountTypeWeights';
import { AccountDashboardSkeleton } from './AccountDashboardSkeleton';
import { Button } from '../../ui/Button';
import { IconButton } from '../../ui/IconButton';
import { openCreateAccountModal } from '../../accountPage/components';
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
import { useEventBus, useEventBusMultiple } from '../../../hooks';
import { useLeafActive } from '../../../hooks/useLeafActive';
import type { EventMap } from '../../../services/events/types';
import { RegularBacktestTradeTypeFilter } from '../../shared/RegularBacktestTradeTypeFilter';
import { normalizeHomeTradeTypes } from '../../home/utils/homeTradeTypeUtils';
import {
  useGuideAction,
  useGuideBackHandler,
  useGuideTarget,
} from '../../../guides/GuideRuntimeLayer';
import {
  ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_AUM_CHART_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID,
  ACCOUNT_DASHBOARD_EMPTY_STATE_TARGET_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_METRICS_TARGET_ID,
  ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID,
  ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID,
} from '../../../guides/accountDashboardGuideIds';








const DASHBOARD_EVENTS: (keyof EventMap)[] = [
  'account:changed',
  'options:changed',
  'trade:changed',
  'backtest-trade:changed',
];


const AccountDashboardGuideCoordinator: React.FC<{
  plugin: AccountDashboardProps['plugin'];
  leaf: WorkspaceLeaf;
  isLoading: boolean;
  error: string | null;
  accountsCount: number;
}> = ({ plugin, leaf, isLoading, error, accountsCount }) => {
  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) {
      return;
    }

    if (isLoading || !!error) {
      guideService.setResolvedGuideForLeaf(leaf, null);
      return;
    }

    const resolvedGuideId =
      accountsCount === 0
        ? ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID
        : ACCOUNT_DASHBOARD_MAIN_GUIDE_ID;

    const activeSession = guideService.getSessionForLeaf(
      leaf,
      ACCOUNT_DASHBOARD_VIEW_TYPE
    );
    if (activeSession && activeSession.guideId !== resolvedGuideId) {
      void guideService.clearGuideState(activeSession.guideId);
    }

    guideService.setResolvedGuideForLeaf(leaf, resolvedGuideId);
  }, [accountsCount, error, isLoading, leaf, plugin]);

  useEffect(() => {
    return () => {
      plugin.viewGuideService?.setResolvedGuideForLeaf(leaf, null);
    };
  }, [leaf, plugin]);

  return null;
};

interface AccountDashboardHeaderProps {
  selectedTradeTypes: TradeType[];
  onTradeTypeFilterChange: (tradeTypes: TradeType[]) => void | Promise<void>;
  onCreateAccount: () => void | Promise<void>;
  onOpenSettings: () => void | Promise<void>;
  registerTradeTypeFilterTarget: React.Ref<HTMLDivElement>;
  registerCreateButtonTarget: React.Ref<HTMLDivElement>;
  registerSettingsButtonTarget: React.Ref<HTMLDivElement>;
}

const AccountDashboardHeader: React.FC<AccountDashboardHeaderProps> = ({
  selectedTradeTypes,
  onTradeTypeFilterChange,
  onCreateAccount,
  onOpenSettings,
  registerTradeTypeFilterTarget,
  registerCreateButtonTarget,
  registerSettingsButtonTarget,
}) => (
  <div className="dashboard-header">
    <div className="dashboard-title">
      <h2>{t('account-dashboard.title')}</h2>
    </div>
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
  registerEmptyStateTarget: React.Ref<HTMLDivElement>;
  registerCreateAccountButtonTarget: React.Ref<HTMLDivElement>;
}

const AccountDashboardEmptyState: React.FC<AccountDashboardEmptyStateProps> = ({
  header,
  onCreateAccount,
  registerEmptyStateTarget,
  registerCreateAccountButtonTarget,
}) => (
  <div className="dashboard-content">
    {header}
    <div className="empty-state-with-action" ref={registerEmptyStateTarget}>
      <EmptyState
        message={t('account-dashboard.empty.title')}
        subMessage={t('account-dashboard.empty.message')}
      />
      <div className="empty-state-actions">
        <div ref={registerCreateAccountButtonTarget}>
          <Button
            variant="primary"
            onClick={() => void onCreateAccount()}
            className="create-account-primary-button"
          >
            {t('account-dashboard.button.create-first')}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

interface AccountDashboardMainContentProps {
  header: React.ReactNode;
  aumChartData: ReturnType<typeof generateAUMChartData>;
  plugin: AccountDashboardProps['plugin'];
  metrics: ReturnType<typeof calculateDashboardMetrics>;
  withdrawalAccounts: AccountData[];
  accounts: AccountData[];
  accountsByType: ReturnType<typeof groupAccountsByType>;
  accountTypesToDisplay: string[];
  totalAUM: number;
  excludedTypes: string[];
  openAccount: (accountName: string, accountData?: unknown) => Promise<void>;
  refreshTrigger: number;
  registerAumChartTarget: React.Ref<HTMLDivElement>;
  registerMetricsTarget: React.Ref<HTMLDivElement>;
  registerSectionsTarget: React.Ref<HTMLDivElement>;
}

const AccountDashboardMainContent: React.FC<
  AccountDashboardMainContentProps
> = ({
  header,
  aumChartData,
  plugin,
  metrics,
  withdrawalAccounts,
  accounts,
  accountsByType,
  accountTypesToDisplay,
  totalAUM,
  excludedTypes,
  openAccount,
  refreshTrigger,
  registerAumChartTarget,
  registerMetricsTarget,
  registerSectionsTarget,
}) => (
  <div className="dashboard-content">
    {header}
    <div ref={registerAumChartTarget}>
      <AUMChart data={aumChartData} plugin={plugin} />
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
    <div ref={registerSectionsTarget}>
      <AccountSections
        accountsByType={accountsByType}
        openAccount={openAccount}
        plugin={plugin}
        refreshTrigger={refreshTrigger}
        totalAUM={totalAUM}
        excludedTypes={excludedTypes}
      />
    </div>
  </div>
);

const useAccountDashboardGuideSettingsFlow = ({
  plugin,
  leaf,
  handleOpenSettings,
  closeSettingsModalForGuide,
  isSettingsModalActive,
}: {
  plugin: AccountDashboardProps['plugin'];
  leaf: WorkspaceLeaf;
  handleOpenSettings: () => Promise<void>;
  closeSettingsModalForGuide: () => void;
  isSettingsModalActive: () => boolean;
}) => {
  const [guideVersion, setGuideVersion] = useState(0);

  const handleGuideBack = useCallback(
    async ({ toStepId }: { toStepId: string }) => {
      if (
        toStepId === 'settings-types' ||
        toStepId === 'settings-inclusion' ||
        toStepId === 'settings-order'
      ) {
        if (!isSettingsModalActive()) {
          await handleOpenSettings();
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
        return;
      }

      closeSettingsModalForGuide();
    },
    [closeSettingsModalForGuide, handleOpenSettings, isSettingsModalActive]
  );

  useGuideBackHandler(handleGuideBack);

  useEffect(() => {
    const guideService = plugin.viewGuideService;
    if (!guideService) return;

    return guideService.subscribe(() => {
      setGuideVersion((prev) => prev + 1);
    });
  }, [plugin]);

  useEffect(() => {
    if (guideVersion < 0) return;

    const guideService = plugin.viewGuideService;
    if (!guideService) return;

    const session = guideService.getSessionForLeaf(
      leaf,
      ACCOUNT_DASHBOARD_VIEW_TYPE
    );

    if (!session || session.guideId !== ACCOUNT_DASHBOARD_MAIN_GUIDE_ID) return;

    if (
      session.currentStepId === 'settings-types' ||
      session.currentStepId === 'settings-inclusion' ||
      session.currentStepId === 'settings-order'
    ) {
      if (!isSettingsModalActive()) {
        void handleOpenSettings();
      }
      return;
    }

    closeSettingsModalForGuide();
  }, [
    closeSettingsModalForGuide,
    guideVersion,
    handleOpenSettings,
    isSettingsModalActive,
    leaf,
    plugin,
  ]);
};

const useAccountDashboardAccounts = (
  plugin: AccountDashboardProps['plugin'],
  selectedTradeTypes: TradeType[]
) => {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
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

      if (requestSequence !== loadRequestSequenceRef.current) return;

      setAccounts(enhancedAccounts);
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

  return { accounts, isLoading, error, loadAccountsWithRetry };
};

const useAccountDashboardGuideTargets = () => ({
  registerTradeTypeFilterTarget: useGuideTarget(
    ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID
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
  const totalAUM = useMemo(
    () =>
      displayableAccounts
        .filter(
          (account) =>
            account.accountType &&
            !excludedTypes.includes(account.accountType.toLowerCase())
        )
        .reduce((sum, account) => sum + account.currentBalance, 0),
    [displayableAccounts, excludedTypes]
  );
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
  
  const [searchTerm] = useState('');
  const [selectedTradeTypes, setSelectedTradeTypes] = useState<TradeType[]>(
    () =>
      normalizeHomeTradeTypes(
        plugin.uiStateManager.getState().selectedAccountDashboardTradeTypes
      )
  );
  const emitGuideAction = useGuideAction();
  const {
    registerTradeTypeFilterTarget,
    registerCreateAccountButtonTarget,
    registerCreateButtonTarget,
    registerSettingsButtonTarget,
    registerEmptyStateTarget,
    registerAumChartTarget,
    registerMetricsTarget,
    registerSectionsTarget,
    registerSettingsTypesTarget,
    registerSettingsInclusionTarget,
    registerSettingsOrderTarget,
  } = useAccountDashboardGuideTargets();

  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const activeSettingsModalRef = useRef<AccountDashboardSettingsModal | null>(
    null
  );

  
  const [, startTransition] = useTransition();
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { accounts, isLoading, error, loadAccountsWithRetry } =
    useAccountDashboardAccounts(plugin, selectedTradeTypes);

  
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

  
  const openAccount = useCallback(
    async (accountName: string, _accountData?: AccountData) => {
      emitGuideAction(ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID);
      void plugin.viewManager.openAccountPageView(accountName);
    },
    [emitGuideAction, plugin.viewManager]
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

  const closeSettingsModalForGuide = useCallback(() => {
    if (!isSettingsModalActive()) {
      activeSettingsModalRef.current = null;
      return;
    }

    activeSettingsModalRef.current?.close();
    activeSettingsModalRef.current = null;
  }, [isSettingsModalActive]);

  
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
        },
        registerTypesTarget: registerSettingsTypesTarget,
        registerInclusionTarget: registerSettingsInclusionTarget,
        registerOrderTarget: registerSettingsOrderTarget,
      }
    );
    activeSettingsModalRef.current = modal;
    emitGuideAction(ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID);
  }, [
    emitGuideAction,
    isSettingsModalActive,
    loadAccountsWithRetry,
    plugin,
    registerSettingsInclusionTarget,
    registerSettingsOrderTarget,
    registerSettingsTypesTarget,
  ]);

  useAccountDashboardGuideSettingsFlow({
    plugin,
    leaf,
    handleOpenSettings,
    closeSettingsModalForGuide,
    isSettingsModalActive,
  });

  const dashboardHeader = (
    <AccountDashboardHeader
      selectedTradeTypes={selectedTradeTypes}
      onTradeTypeFilterChange={handleTradeTypeFilterChange}
      onCreateAccount={() => void handleCreateAccount()}
      onOpenSettings={() => void handleOpenSettings()}
      registerTradeTypeFilterTarget={registerTradeTypeFilterTarget}
      registerCreateButtonTarget={registerCreateButtonTarget}
      registerSettingsButtonTarget={registerSettingsButtonTarget}
    />
  );

  
  if (isLoading) {
    return (
      <>
        <AccountDashboardGuideCoordinator
          plugin={plugin}
          leaf={leaf}
          isLoading={isLoading}
          error={error}
          accountsCount={accounts.length}
        />
        <div className="journalit-account-dashboard">
          <AccountDashboardSkeleton />
        </div>
      </>
    );
  }

  
  if (error) {
    return (
      <>
        <AccountDashboardGuideCoordinator
          plugin={plugin}
          leaf={leaf}
          isLoading={isLoading}
          error={error}
          accountsCount={accounts.length}
        />
        <div className="journalit-account-dashboard error">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  
  if (accounts.length === 0) {
    return (
      <>
        <AccountDashboardGuideCoordinator
          plugin={plugin}
          leaf={leaf}
          isLoading={isLoading}
          error={error}
          accountsCount={accounts.length}
        />
        <div className="journalit-account-dashboard">
          <AccountDashboardEmptyState
            header={dashboardHeader}
            onCreateAccount={() => void handleCreateAccount()}
            registerEmptyStateTarget={registerEmptyStateTarget}
            registerCreateAccountButtonTarget={
              registerCreateAccountButtonTarget
            }
          />
        </div>
      </>
    );
  }

  
  return (
    <>
      <AccountDashboardGuideCoordinator
        plugin={plugin}
        leaf={leaf}
        isLoading={isLoading}
        error={error}
        accountsCount={accounts.length}
      />
      <div className="journalit-account-dashboard">
        <AccountDashboardMainContent
          header={dashboardHeader}
          aumChartData={aumChartData}
          plugin={plugin}
          metrics={metrics}
          withdrawalAccounts={withdrawalAccounts}
          accounts={accounts}
          accountsByType={accountsByType}
          accountTypesToDisplay={accountTypesToDisplay}
          totalAUM={totalAUM}
          excludedTypes={excludedTypes}
          openAccount={openAccount}
          refreshTrigger={refreshTrigger}
          registerAumChartTarget={registerAumChartTarget}
          registerMetricsTarget={registerMetricsTarget}
          registerSectionsTarget={registerSectionsTarget}
        />
      </div>
    </>
  );
};


export const AccountDashboard = React.memo(AccountDashboardComponent);
