

import React, { useEffect, useRef, useState } from 'react';
import { Notice } from 'obsidian';
import { useEventBus } from '../../hooks/useEventBus';
import { t } from '../../lang/helpers';
import { SETTINGS_TAB_IDS } from '../../settings/types';
import type JournalitPlugin from '../../main';
import { WelcomeStep } from './steps/WelcomeStep';
import { ExploreStep } from './steps/ExploreStep';
import {
  ChoosePathStep,
  type OnboardingPathOption,
} from './steps/ChoosePathStep';
import { Star } from '../shared/icons/ObsidianIcon';
import { ManualEntryStep } from './steps/ManualEntryStep';
import { ONBOARDING_VIEW_TYPE } from '../../views/OnboardingView';
import { openExternalUrl } from '../../utils/externalLinks';
import { writeClipboardText } from '../../utils/clipboard';
import {
  ADD_TRADE_SUGGESTED_HOTKEYS,
  getAddTradeHotkeyParts,
  openHotkeySettingsForCommand,
  setSuggestedHotkeyIfMissing,
} from '../../utils/obsidianHotkeys';

type OnboardingViewStep =
  | 'welcome'
  | 'explore'
  | 'choose-path'
  | 'import-method'
  | 'manual-entry';

export const TRADE_SYNC_SETTINGS_OPEN_DELAY_MS = 50;

interface OnboardingComponentProps {
  plugin: JournalitPlugin;
}

function useOnboardingModel(plugin: JournalitPlugin) {
  const [currentStep, setCurrentStep] = useState<OnboardingViewStep>('welcome');
  const [destinationBusy, setDestinationBusy] = useState(false);

  const [manualDocsFallbackUrl, setManualDocsFallbackUrl] = useState<
    string | null
  >(null);
  const [manualDocsCopied, setManualDocsCopied] = useState(false);
  const manualDocsCopyTimerRef = useRef<number | null>(null);
  const hotkeySettingsCleanupRef = useRef<(() => void) | null>(null);
  const didAutoCompleteManual = useRef(false);

  useEffect(() => {
    return () => {
      if (manualDocsCopyTimerRef.current) {
        window.clearTimeout(manualDocsCopyTimerRef.current);
      }
      hotkeySettingsCleanupRef.current?.();
    };
  }, []);

  const handleWelcomeNext = () => {
    setCurrentStep('explore');
  };

  const handleExploreNext = () => {
    setCurrentStep('choose-path');
  };

  const handleExploreBack = () => {
    setCurrentStep('welcome');
  };

  const closeOnboardingAndOpenHome = async () => {
    const onboardingLeaves =
      plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);

    try {
      
      await plugin.viewManager.openHomeView('overview');
      
      for (const leaf of onboardingLeaves) {
        leaf.detach();
      }
    } catch (error) {
      console.error('[Onboarding] Failed to open home view:', error);
      
    }
  };

  const completeOnboardingSafe = async () => {
    try {
      const onboardingService =
        await plugin.serviceManager.getOnboardingService();
      await onboardingService.completeOnboarding();
    } catch (error) {
      console.error(
        '[Onboarding] Failed to complete onboarding service call:',
        error
      );
      new Notice(t('onboarding.notice.complete-failed'));
    }
  };

  const detachOnboardingLeavesSafe = () => {
    const onboardingLeaves =
      plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);

    for (const leaf of onboardingLeaves) {
      try {
        if (leaf.view?.getViewType?.() === ONBOARDING_VIEW_TYPE) {
          leaf.detach();
        }
      } catch (error) {
        console.error('[Onboarding] Failed to detach onboarding leaf:', error);
      }
    }
  };

  const handleFinish = async () => {
    await completeOnboardingSafe();
    await closeOnboardingAndOpenHome();
  };

  useEventBus(
    'trade-form:opened',
    async (payload) => {
      if (didAutoCompleteManual.current || payload.mode !== 'create') return;
      didAutoCompleteManual.current = true;
      await handleFinish();
    },
    currentStep === 'manual-entry'
  );

  const handleSkip = async () => {
    try {
      const onboardingService =
        await plugin.serviceManager.getOnboardingService();
      await onboardingService.skipOnboarding();
    } catch (error) {
      console.error(
        '[Onboarding] Failed to skip onboarding service call:',
        error
      );
      new Notice(t('onboarding.notice.skip-failed'));
    }

    
    

    await closeOnboardingAndOpenHome();
  };

  const copyManualDocsUrl = async (url: string) => {
    setManualDocsFallbackUrl(url);

    try {
      await writeClipboardText(url);
      setManualDocsCopied(true);

      if (manualDocsCopyTimerRef.current) {
        window.clearTimeout(manualDocsCopyTimerRef.current);
      }
      manualDocsCopyTimerRef.current = window.setTimeout(() => {
        setManualDocsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('[Onboarding] Failed to copy docs link:', error);
      setManualDocsCopied(false);
    }
  };

  const handleOpenManual = async () => {
    const url = 'https://journalit.co/docs';

    setManualDocsFallbackUrl(null);
    setManualDocsCopied(false);
    openExternalUrl(url, ['journalit.co'], {
      onPopupBlocked: copyManualDocsUrl,
    });
  };

  const handleOpenDashboard = async () => {
    try {
      await plugin.viewManager.openDashboardView();
    } catch (error) {
      console.error('[Onboarding] Failed to open dashboard:', error);
      new Notice(
        t('notice.error.open-dashboard', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const handleOpenTradeLog = async () => {
    try {
      await plugin.viewManager.openTradeLogView();
    } catch (error) {
      console.error('[Onboarding] Failed to open trade log:', error);
      new Notice(
        t('notice.error.open-trade-log', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const handleOpenAccounts = async () => {
    try {
      await plugin.viewManager.openAccountDashboardView();
    } catch (error) {
      console.error('[Onboarding] Failed to open accounts:', error);
      new Notice(
        t('notice.error.open-account-dashboard', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const handleOpenLayoutBuilder = async () => {
    try {
      await plugin.viewManager.openTemplateBuilderView();
    } catch (error) {
      console.error('[Onboarding] Failed to open layout builder:', error);
      new Notice(
        t('notice.error.open-layout-builder', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
    }
  };

  const openCsvImportViewSafe = async (): Promise<boolean> => {
    try {
      await plugin.viewManager.openCSVImportView();
      return true;
    } catch (error) {
      console.error('[Onboarding] Failed to open CSV import:', error);
      new Notice(
        t('notice.error.open-csv-import', {
          error: error instanceof Error ? error.message : String(error),
        })
      );
      return false;
    }
  };

  const handleOpenCsv = async () => {
    await openCsvImportViewSafe();
  };

  const handleOpenTradeSync = () => {
    
    plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
  };

  const handleAddTrade = async () => {
    try {
      await plugin.viewManager.openTradeFormView();
    } catch (error) {
      console.error('[Onboarding] Failed to open trade form:', error);
      new Notice(t('notice.error.open-journalit'));
    }
  };

  const handleChangeHotkey = () => {
    const commandId = `${plugin.manifest.id}:add-trade`;

    try {
      const result = setSuggestedHotkeyIfMissing(
        plugin,
        commandId,
        ADD_TRADE_SUGGESTED_HOTKEYS
      );
      if (result.wasSet) {
        const printed = result.display ?? getAddTradeHotkeyParts().join(' + ');
        new Notice(t('notice.hotkey-set', { hotkey: printed }));
        return;
      }
    } catch (error) {
      console.warn('[Onboarding] Failed to set hotkey:', error);
    }

    try {
      hotkeySettingsCleanupRef.current?.();
      hotkeySettingsCleanupRef.current = openHotkeySettingsForCommand(
        plugin,
        `${plugin.manifest.name}: ${t('command.add-trade')}`
      );
    } catch (error) {
      console.error('[Onboarding] Failed to open hotkey settings:', error);
    }
  };

  const handleChooseImport = async () => {
    if (destinationBusy) return;
    setDestinationBusy(true);

    const didOpen = await openCsvImportViewSafe();
    if (!didOpen) {
      setDestinationBusy(false);
      return;
    }

    await completeOnboardingSafe();
    detachOnboardingLeavesSafe();
  };

  const handleChooseTradeSync = async () => {
    if (destinationBusy) return;
    setDestinationBusy(true);

    try {
      await plugin.viewManager.openHomeView('overview');
    } catch (error) {
      console.error('[Onboarding] Failed to open home view:', error);
      new Notice(t('onboarding.notice.trade-sync-open-failed'));
      setDestinationBusy(false);
      return;
    }

    await completeOnboardingSafe();
    detachOnboardingLeavesSafe();

    
    
    window.setTimeout(() => {
      try {
        plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
      } catch (error) {
        console.error('[Onboarding] Failed to open Trade Sync:', error);
        new Notice(t('onboarding.notice.trade-sync-open-failed'));
      }
    }, TRADE_SYNC_SETTINGS_OPEN_DELAY_MS);
  };

  return {
    currentStep,
    destinationBusy,
    setCurrentStep,
    handleWelcomeNext,
    handleSkip,
    handleExploreBack,
    handleExploreNext,
    handleOpenDashboard,
    handleOpenTradeLog,
    handleOpenAccounts,
    handleOpenLayoutBuilder,
    handleOpenCsv,
    handleOpenTradeSync,
    handleOpenManual,
    manualDocsFallbackUrl,
    manualDocsCopied,
    copyManualDocsUrl,
    handleAddTrade,
    handleChangeHotkey,
    handleChooseImport,
    handleChooseTradeSync,
  };
}

export const OnboardingComponent: React.FC<OnboardingComponentProps> = ({
  plugin,
}) => {
  const {
    currentStep,
    destinationBusy,
    setCurrentStep,
    handleWelcomeNext,
    handleSkip,
    handleExploreBack,
    handleExploreNext,
    handleOpenDashboard,
    handleOpenTradeLog,
    handleOpenAccounts,
    handleOpenLayoutBuilder,
    handleOpenCsv,
    handleOpenTradeSync,
    handleOpenManual,
    manualDocsFallbackUrl,
    manualDocsCopied,
    copyManualDocsUrl,
    handleAddTrade,
    handleChangeHotkey,
    handleChooseImport,
    handleChooseTradeSync,
  } = useOnboardingModel(plugin);

  const historyOptions: OnboardingPathOption[] = [
    {
      id: 'has-history',
      label: t('onboarding.path.option.csv.label'),
      description: t('onboarding.path.option.csv.description'),
      onChoose: () => setCurrentStep('import-method'),
    },
    {
      id: 'start-fresh',
      label: t('onboarding.path.option.manual.label'),
      description: t('onboarding.path.option.manual.description'),
      onChoose: () => setCurrentStep('manual-entry'),
    },
  ];
  const importMethodOptions: OnboardingPathOption[] = [
    {
      id: 'trade-sync',
      label: t('onboarding.path.option.trade-sync.label'),
      description: t('onboarding.path.option.trade-sync.description'),
      badge: t('onboarding.features.badge.pro'),
      badgeIcon: <Star size={12} fill="currentColor" />,
      onChoose: handleChooseTradeSync,
    },
    {
      id: 'file-import',
      label: t('onboarding.path.option.import.label'),
      description: t('onboarding.path.option.import.description'),
      badge: t('onboarding.path.option.import.badge'),
      onChoose: handleChooseImport,
    },
  ];

  return (
    <div className="journalit-onboarding-container">
      {currentStep === 'welcome' && (
        <WelcomeStep onNext={handleWelcomeNext} onSkip={handleSkip} />
      )}
      {currentStep === 'explore' && (
        <ExploreStep
          onBack={handleExploreBack}
          onNext={handleExploreNext}
          onOpenDashboard={handleOpenDashboard}
          onOpenTradeLog={handleOpenTradeLog}
          onOpenAccounts={handleOpenAccounts}
          onOpenLayoutBuilder={handleOpenLayoutBuilder}
          onOpenCsv={handleOpenCsv}
          onOpenTradeSync={handleOpenTradeSync}
          onOpenManual={handleOpenManual}
          manualLinkFallbackUrl={manualDocsFallbackUrl}
          manualLinkCopied={manualDocsCopied}
          onManualLinkCopy={copyManualDocsUrl}
        />
      )}
      {currentStep === 'choose-path' && (
        <ChoosePathStep
          kicker={t('onboarding.path.kicker')}
          title={t('onboarding.path.title')}
          subtitle={t('onboarding.path.subtitle')}
          options={historyOptions}
          busy={destinationBusy}
          onBack={() => setCurrentStep('explore')}
        />
      )}
      {currentStep === 'import-method' && (
        <ChoosePathStep
          kicker={t('onboarding.path.method.kicker')}
          title={t('onboarding.path.method.title')}
          subtitle={t('onboarding.path.method.subtitle')}
          options={importMethodOptions}
          busy={destinationBusy}
          onBack={() => setCurrentStep('choose-path')}
        />
      )}
      {currentStep === 'manual-entry' && (
        <ManualEntryStep
          onBack={() => setCurrentStep('choose-path')}
          onChangeHotkey={handleChangeHotkey}
          onAddTrade={handleAddTrade}
        />
      )}
    </div>
  );
};
