

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Notice, Platform } from 'obsidian';
import { t } from '../../lang/helpers';
import { SETTINGS_TAB_IDS } from '../../settings/types';
import type JournalitPlugin from '../../main';
import type { DemoSessionSnapshot } from '../../demo/DemoSessionService';
import type { OnboardingService } from '../../services/onboarding/OnboardingService';
import type {
  OnboardingAnswers,
  OnboardingData,
  OnboardingPendingCompletion,
  OnboardingStepId,
} from '../../services/onboarding/types';
import {
  buildOnboardingBrokerOptions,
  getSyncProviderOptions,
  getUnlistedBrokerOption,
  MANUAL_IMPORT_BROKER_ID,
  type OnboardingBrokerOption,
} from '../../services/onboarding/brokerCatalog';
import { applyOnboardingPersonalisation } from '../../services/onboarding/personalisation/applyOnboardingPersonalisation';
import { resolveSampleJournalIntegration } from '../../services/onboarding/integrations';
import { BackendTradeImportService } from '../../services/tradeImport/BackendTradeImportService';
import { setOnboardingTradeImportBroker } from '../../services/tradeImport/onboardingTradeImportHandoff';
import type { TradeImportCapabilities } from '../../services/tradeImport/types';
import { writeTradeSyncProviderPreference } from '../../services/tradeSync/tradeSyncProviderPreference';
import { markOnboardingUpgradeOrigin } from '../../services/upgrade/upgradeOrigin';
import { useBackendProEntitlement } from '../../hooks/useBackendProEntitlement';
import { DeviceFlowSignInModal } from '../auth/DeviceFlowSignInModal';
import { ONBOARDING_VIEW_TYPE } from '../../views/OnboardingView';
import type { PersonaliseAnswers } from './steps/PersonaliseStep';

const INACTIVE_SAMPLE_SNAPSHOT: DemoSessionSnapshot = {
  active: false,
  busy: false,
  phase: 'idle',
  root: null,
  progress: null,
};
const NOOP_SUBSCRIBE = (): (() => void) => () => undefined;
const GET_INACTIVE_SNAPSHOT = () => INACTIVE_SAMPLE_SNAPSHOT;


export function useOnboardingService(
  plugin: JournalitPlugin
): OnboardingService | null {
  const [service, setService] = useState<OnboardingService | null>(null);
  useEffect(() => {
    let cancelled = false;
    void plugin.serviceManager
      .getOnboardingService()
      .then((resolved) => {
        if (!cancelled) setService(resolved);
      })
      .catch((error: unknown) => {
        console.error('[Onboarding] Failed to load onboarding service:', error);
        new Notice(t('notice.error.open-onboarding'));
      });
    return () => {
      cancelled = true;
    };
  }, [plugin]);
  return service;
}

type BrokerCapabilitiesState =
  | { status: 'loading' }
  | { status: 'ready'; capabilities: TradeImportCapabilities }
  | { status: 'offline' };


function useBrokerCapabilities(active: boolean): BrokerCapabilitiesState {
  const [state, setState] = useState<BrokerCapabilitiesState>({
    status: 'loading',
  });
  const service = useMemo(() => new BackendTradeImportService(), []);
  const attemptedForActivationRef = useRef(false);
  useEffect(() => {
    if (!active) {
      attemptedForActivationRef.current = false;
      return;
    }
    if (attemptedForActivationRef.current) return;
    attemptedForActivationRef.current = true;
    let cancelled = false;
    service
      .getCapabilities()
      .then((capabilities: TradeImportCapabilities) => {
        if (!cancelled) setState({ status: 'ready', capabilities });
      })
      .catch((error: unknown) => {
        console.warn(
          '[Onboarding] Trade Import capabilities unavailable:',
          error
        );
        if (!cancelled) setState({ status: 'offline' });
      });
    return () => {
      cancelled = true;
    };
  }, [active, service]);
  return state;
}

export const stepAfterFamiliarity = (data: OnboardingData): OnboardingStepId =>
  data.answers.obsidianFamiliarity === 'new'
    ? 'orientation'
    : 'obsidian-familiarity';

export const stepBeforePersonalise = (
  data: OnboardingData
): OnboardingStepId =>
  data.answers.dataSource === 'broker' ? 'broker' : 'data-source';

export async function leaveSampleJourney(
  plugin: JournalitPlugin,
  service: OnboardingService,
  samplePhase: ReturnType<
    NonNullable<JournalitPlugin['demoSessionService']>['getSnapshot']
  >['phase']
): Promise<void> {
  const demo = plugin.demoSessionService;
  const sampleNeedsCleanup =
    demo &&
    (samplePhase === 'failed' ||
      (samplePhase !== 'active' && demo.getSnapshot().active));
  if (sampleNeedsCleanup) {
    await demo.remove();
  }
  await service.leaveSampleJourney();
  if (sampleNeedsCleanup) {
    await plugin.viewManager.openOnboardingView();
  }
}

export function isSamplePreparationStalled({
  onboardingStep,
  operationBusy,
  sampleBusy,
  samplePhase,
  hasRecoverableSession,
}: {
  onboardingStep: OnboardingStepId;
  operationBusy: boolean;
  sampleBusy: boolean;
  samplePhase: ReturnType<
    NonNullable<JournalitPlugin['demoSessionService']>['getSnapshot']
  >['phase'];
  hasRecoverableSession: boolean;
}): boolean {
  return (
    onboardingStep === 'preparing-sample' &&
    !operationBusy &&
    !sampleBusy &&
    samplePhase !== 'active' &&
    samplePhase !== 'failed' &&
    !hasRecoverableSession
  );
}

const findBrokerOption = (
  brokerId: string | undefined,
  options: OnboardingBrokerOption[]
): OnboardingBrokerOption | undefined =>
  options.find((option) => option.id === brokerId);

export function useOnboardingFlowModel(
  plugin: JournalitPlugin,
  service: OnboardingService
) {
  const data = useSyncExternalStore(
    service.subscribe,
    service.getState,
    service.getState
  );
  const [busy, setBusy] = useState(false);
  const [sidebarRevealed, setSidebarRevealed] = useState(false);
  const { isAuthenticated } = useBackendProEntitlement(plugin, 'onboarding');
  const capabilitiesState = useBrokerCapabilities(
    data.step === 'data-source' || data.step === 'broker'
  );
  const sampleJournal = useMemo(
    () => resolveSampleJournalIntegration(plugin, service),
    [plugin, service]
  );
  const demo = plugin.demoSessionService;
  const sampleSnapshot = useSyncExternalStore(
    demo?.subscribe ?? NOOP_SUBSCRIBE,
    demo?.getSnapshot ?? GET_INACTIVE_SNAPSHOT,
    demo?.getSnapshot ?? GET_INACTIVE_SNAPSHOT
  );

  const brokerOptions = useMemo(
    () =>
      buildOnboardingBrokerOptions(
        capabilitiesState.status === 'ready'
          ? capabilitiesState.capabilities
          : null
      ),
    [capabilitiesState]
  );

  const brokerStatusText =
    capabilitiesState.status === 'loading'
      ? t('onboarding.broker.loading')
      : capabilitiesState.status === 'offline'
        ? t('onboarding.broker.offline')
        : undefined;

  const advance = useCallback(
    async (step: OnboardingStepId, answers?: Partial<OnboardingAnswers>) => {
      await service.advance(step, answers);
    },
    [service]
  );

  const closeOnboardingAndOpenHome = async () => {
    const onboardingLeaves =
      plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);
    try {
      await plugin.viewManager.openHomeView('overview');
      for (const leaf of onboardingLeaves) leaf.detach();
    } catch (error) {
      console.error('[Onboarding] Failed to open home view:', error);
    }
  };

  const handleSkip = async () => {
    try {
      await service.skip();
    } catch (error) {
      console.error('[Onboarding] Failed to skip onboarding:', error);
      new Notice(t('onboarding.notice.skip-failed'));
      return;
    }
    await closeOnboardingAndOpenHome();
  };

  const awaitCompletion = async (
    pending: OnboardingPendingCompletion
  ): Promise<boolean> => {
    try {
      await service.awaitCompletion(pending);
      return true;
    } catch (error) {
      console.error(
        '[Onboarding] Failed to record pending onboarding completion:',
        error
      );
      new Notice(t('onboarding.notice.complete-failed'));
      return false;
    }
  };

  const handleRevealSidebar = async () => {
    const onboardingLeaf =
      plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE)[0];
    try {
      await plugin.openNavigationSidebar();
      setSidebarRevealed(true);
      
      if (!Platform.isMobileApp && onboardingLeaf) {
        plugin.app.workspace.setActiveLeaf(onboardingLeaf, { focus: true });
      }
    } catch (error) {
      console.error('[Onboarding] Failed to open navigation sidebar:', error);
      new Notice(t('notice.error.open-navigation-sidebar'));
    }
  };

  

  const openTradeSync = async (
    providerId?: NonNullable<OnboardingBrokerOption['syncProviderId']>
  ) => {
    if (providerId) writeTradeSyncProviderPreference(plugin.app, providerId);
    try {
      plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
      if (!(await awaitCompletion('first-sync'))) {
        await plugin.viewManager.openOnboardingView();
        return;
      }
      markOnboardingUpgradeOrigin('metatraderSync');
    } catch (error) {
      console.error('[Onboarding] Failed to open Trade Sync:', error);
      new Notice(t('onboarding.notice.trade-sync-open-failed'));
    }
  };

  const openTradeImport = async (importBrokerId: string | undefined) => {
    const selectedBroker =
      importBrokerId && importBrokerId !== MANUAL_IMPORT_BROKER_ID
        ? importBrokerId
        : undefined;
    setOnboardingTradeImportBroker(selectedBroker);
    try {
      await plugin.viewManager.openCSVImportView();
      window.dispatchEvent(
        new Event('journalit:onboarding-trade-import-handoff-ready')
      );
      if (!(await awaitCompletion('first-import'))) {
        await plugin.viewManager.openOnboardingView();
        return;
      }
      markOnboardingUpgradeOrigin('csvImport');
    } catch (error) {
      console.error('[Onboarding] Failed to open Trade Import:', error);
      new Notice(
        t('notice.error.open-csv-import', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const openAddTrade = async () => {
    if (!(await awaitCompletion('first-trade'))) return;
    try {
      await plugin.viewManager.openTradeFormView();
    } catch (error) {
      console.error('[Onboarding] Failed to open trade form:', error);
      new Notice(t('notice.error.open-journalit'));
    }
  };

  const routeToDestination = async (current: OnboardingData) => {
    const { dataSource, brokerId } = current.answers;
    if (!dataSource) {
      if (current.pendingCompletion === 'first-sync') {
        await openTradeSync();
        return;
      }
      if (current.pendingCompletion === 'first-trade') {
        await openAddTrade();
        return;
      }
      if (current.pendingCompletion === 'first-import') {
        await openTradeImport(undefined);
        return;
      }
    }
    switch (dataSource) {
      case 'fresh':
        await advance('first-trade');
        return;
      case 'broker': {
        const option =
          findBrokerOption(brokerId, brokerOptions) ??
          findBrokerOption(brokerId, [
            ...getSyncProviderOptions(),
            getUnlistedBrokerOption(),
          ]);
        if (option?.method === 'sync' && option.syncProviderId) {
          await openTradeSync(option.syncProviderId);
          return;
        }
        await openTradeImport(
          option?.importBrokerId ?? brokerId?.replace(/^import:/, '')
        );
        return;
      }
      case 'sample':
        if (sampleJournal) {
          await sampleJournal.explore('data-source');
        } else {
          await advance('data-source');
        }
        return;
      case 'file':
      case undefined:
        await openTradeImport(undefined);
        return;
      default: {
        const exhaustive: never = dataSource;
        throw new Error(`Unhandled data source: ${String(exhaustive)}`);
      }
    }
  };

  const runBusy = async (work: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try {
      await work();
    } finally {
      setBusy(false);
    }
  };

  const handlePersonaliseContinue = (answers: PersonaliseAnswers) =>
    runBusy(async () => {
      const nextAnswers: Partial<OnboardingAnswers> = {
        tradingStyle: answers.tradingStyle,
        accountKind: answers.accountKind,
        ...(answers.assetFocus ? { assetFocus: answers.assetFocus } : {}),
      };
      const merged = { ...data.answers, ...nextAnswers };
      try {
        await applyOnboardingPersonalisation(plugin, service, merged);
      } catch (error) {
        console.error('[Onboarding] Failed to apply personalisation:', error);
        new Notice(t('onboarding.notice.personalise-failed'));
      }
      await advance('personalise', nextAnswers);
      await routeToDestination({ ...data, answers: merged });
    });

  const handleSignIn = () => {
    new DeviceFlowSignInModal(
      plugin.app,
      plugin,
      () => undefined,
      () => undefined
    ).open();
  };

  const handleAwaitingPrimary = () =>
    runBusy(async () => {
      await routeToDestination(data);
    });

  const handleAddTrade = () => runBusy(openAddTrade);

  const handleExploreSample = sampleJournal
    ? (origin: 'data-source' | 'first-trade') =>
        runBusy(async () => {
          try {
            await sampleJournal.explore(origin);
          } catch (error) {
            console.error(
              '[Onboarding] Failed to build sample journal:',
              error
            );
          }
        })
    : undefined;

  
  
  
  const sampleStalled = isSamplePreparationStalled({
    onboardingStep: data.step,
    operationBusy: busy,
    sampleBusy: sampleSnapshot.busy,
    samplePhase: sampleSnapshot.phase,
    hasRecoverableSession: demo?.hasRecoverableSession() ?? false,
  });

  const handleExitSample = demo
    ? () =>
        runBusy(async () => {
          await demo.requestExit();
        })
    : undefined;

  const handleLeaveSample = () =>
    runBusy(async () => {
      await leaveSampleJourney(plugin, service, sampleSnapshot.phase);
    });

  
  
  const handleRetrySample = handleExploreSample
    ? () =>
        handleExploreSample(
          data.answers.dataSource === 'fresh' ? 'first-trade' : 'data-source'
        )
    : undefined;

  const chooseBroker = (option: OnboardingBrokerOption) =>
    advance('personalise', {
      brokerId: option.id,
      assetFocus: option.inferredAssetFocus,
    });

  const askAssetFocus = !data.answers.assetFocus;

  return {
    data,
    busy,
    signedOut: !isAuthenticated,
    sidebarRevealed,
    brokerOptions,
    brokerStatusText,
    askAssetFocus,
    advance,
    chooseBroker,
    handleSkip,
    handleRevealSidebar,
    handlePersonaliseContinue,
    handleAwaitingPrimary,
    handleSignIn,
    handleAddTrade,
    handleExploreSample,
    sampleSnapshot,
    sampleStalled,
    handleLeaveSample,
    handleRetrySample,
    handleExitSample,
  };
}
