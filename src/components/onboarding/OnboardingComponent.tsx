

import React, { useEffect, useRef, useState } from 'react';
import { Notice, Platform, type Hotkey } from 'obsidian';
import { useEventBus } from '../../hooks/useEventBus';
import { t } from '../../lang/helpers';
import { SETTINGS_TAB_IDS } from '../../settings/types';
import type JournalitPlugin from '../../main';
import { WelcomeStep } from './steps/WelcomeStep';
import { ExploreStep } from './steps/ExploreStep';
import { ChoosePathStep, type OnboardingPath } from './steps/ChoosePathStep';
import { ContextualFinalStep } from './steps/ContextualFinalStep';
import { ONBOARDING_VIEW_TYPE } from '../../views/OnboardingView';

type OnboardingViewStep =
  | 'welcome'
  | 'explore'
  | 'choose-path'
  | 'contextual-final';

interface OnboardingComponentProps {
  plugin: JournalitPlugin;
}

function useOnboardingModel(plugin: JournalitPlugin) {
  const [currentStep, setCurrentStep] = useState<OnboardingViewStep>('welcome');
  const [selectedPath, setSelectedPath] = useState<OnboardingPath | null>(null);

  const [manualDocsFallbackUrl, setManualDocsFallbackUrl] = useState<
    string | null
  >(null);
  const [manualDocsCopied, setManualDocsCopied] = useState(false);
  const manualDocsCopyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hotkeySearchIntervalRef = useRef<number | null>(null);

  const didAutoCompleteManual = useRef(false);

  useEffect(() => {
    return () => {
      if (manualDocsCopyTimerRef.current) {
        clearTimeout(manualDocsCopyTimerRef.current);
      }

      if (hotkeySearchIntervalRef.current) {
        clearInterval(hotkeySearchIntervalRef.current);
        hotkeySearchIntervalRef.current = null;
      }
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

  const handleChoosePathNext = () => {
    if (!selectedPath) {
      return;
    }
    setCurrentStep('contextual-final');
  };

  const closeOnboardingAndOpenHome = async () => {
    const onboardingLeaves =
      plugin.app.workspace.getLeavesOfType(ONBOARDING_VIEW_TYPE);

    try {
      
      await plugin.viewManager.openHomeView();
      
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
      if (didAutoCompleteManual.current) {
        return;
      }

      if (payload.mode !== 'create') {
        return;
      }

      didAutoCompleteManual.current = true;
      await handleFinish();
    },
    currentStep === 'contextual-final' && selectedPath === 'manual'
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
      await navigator.clipboard.writeText(url);
      setManualDocsCopied(true);

      if (manualDocsCopyTimerRef.current) {
        clearTimeout(manualDocsCopyTimerRef.current);
      }
      manualDocsCopyTimerRef.current = setTimeout(() => {
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

    
    if (Platform.isDesktopApp) {
      try {
        const electronShell = (
          window as Window & {
            require?: (module: string) => {
              shell?: { openExternal: (targetUrl: string) => void };
            };
          }
        ).require?.('electron')?.shell;

        if (electronShell) {
          electronShell.openExternal(url);
          return;
        }
      } catch (error) {
        console.warn(
          '[Onboarding] Electron shell not available, falling back to window.open:',
          error
        );
      }
    }

    try {
      const newWindow = window.open(url, '_blank');

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === 'undefined'
      ) {
        await copyManualDocsUrl(url);
      }
    } catch (error) {
      console.error('[Onboarding] Failed to open docs link:', error);
      await copyManualDocsUrl(url);
    }
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

  const handleOpenMetaTrader = () => {
    
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

  const handleFinalOpenCsv = async () => {
    const didOpen = await openCsvImportViewSafe();
    if (!didOpen) {
      return;
    }

    await completeOnboardingSafe();
    detachOnboardingLeavesSafe();
  };

  const handleFinalOpenMetaTrader = async () => {
    
    let didOpenHome = false;

    try {
      await plugin.viewManager.openHomeView();
      didOpenHome = true;
    } catch (error) {
      console.error('[Onboarding] Failed to open home view:', error);
      
    }

    await completeOnboardingSafe();

    if (didOpenHome) {
      detachOnboardingLeavesSafe();
    }

    
    
    window.setTimeout(() => {
      try {
        plugin.openSettingsToTab(SETTINGS_TAB_IDS.TRADE_SYNC);
      } catch (error) {
        console.error(
          '[Onboarding] Failed to open backend settings tab:',
          error
        );
      }
    }, 50);
  };

  const handleChangeHotkey = () => {
    const commandId = `${plugin.manifest.id}:add-trade`;
    const suggestedHotkeys: Hotkey[] = [
      {
        modifiers: ['Mod', 'Alt'],
        key: 'A',
      },
    ];

    
    
    
    try {
      const hotkeyManager = plugin.app.hotkeyManager;

      const existing = hotkeyManager?.getHotkeys?.(commandId) ?? [];
      if (existing.length === 0 && hotkeyManager?.setHotkeys) {
        hotkeyManager.setHotkeys(commandId, suggestedHotkeys);
        hotkeyManager.save?.();

        const printed =
          hotkeyManager.printHotkeyForCommand?.(commandId) ??
          t('onboarding.final.manual.hotkey.value');

        new Notice(t('notice.hotkey-set', { hotkey: printed }));
        return;
      }
    } catch (error) {
      console.warn(
        '[Onboarding] Failed to set hotkey programmatically:',
        error
      );
    }

    
    try {
      plugin.app.setting?.open();
      plugin.app.setting?.openTabById('hotkeys');

      const query = `Journalit: ${t('command.add-trade')}`;
      const maxAttempts = 60;
      let attempts = 0;

      if (hotkeySearchIntervalRef.current) {
        window.clearInterval(hotkeySearchIntervalRef.current);
        hotkeySearchIntervalRef.current = null;
      }

      hotkeySearchIntervalRef.current = window.setInterval(() => {
        attempts += 1;

        const modal = document.querySelector('.modal.mod-settings');
        const inputs = modal
          ? Array.from(modal.querySelectorAll('input'))
          : Array.from(document.querySelectorAll('input'));

        const searchInput = inputs.find((input) => {
          const placeholder = (
            input.getAttribute('placeholder') ?? ''
          ).toLowerCase();
          const className = (input.className ?? '').toString();

          if (className.includes('setting-search-input')) {
            return true;
          }

          return (
            placeholder.includes('search') || placeholder.includes('filter')
          );
        });

        if (searchInput) {
          searchInput.value = query;
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.focus();
          if (hotkeySearchIntervalRef.current) {
            window.clearInterval(hotkeySearchIntervalRef.current);
            hotkeySearchIntervalRef.current = null;
          }
          return;
        }

        if (attempts >= maxAttempts) {
          if (hotkeySearchIntervalRef.current) {
            window.clearInterval(hotkeySearchIntervalRef.current);
            hotkeySearchIntervalRef.current = null;
          }
        }
      }, 50);
    } catch (error) {
      console.error('[Onboarding] Failed to open hotkey settings:', error);
    }
  };

  return {
    currentStep,
    selectedPath,
    setSelectedPath,
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
    handleOpenMetaTrader,
    handleOpenManual,
    manualDocsFallbackUrl,
    manualDocsCopied,
    copyManualDocsUrl,
    handleChoosePathNext,
    handleFinish,
    handleChangeHotkey,
    handleAddTrade,
    handleFinalOpenCsv,
    handleFinalOpenMetaTrader,
  };
}

export const OnboardingComponent: React.FC<OnboardingComponentProps> = ({
  plugin,
}) => {
  const {
    currentStep,
    selectedPath,
    setSelectedPath,
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
    handleOpenMetaTrader,
    handleOpenManual,
    manualDocsFallbackUrl,
    manualDocsCopied,
    copyManualDocsUrl,
    handleChoosePathNext,
    handleFinish,
    handleChangeHotkey,
    handleAddTrade,
    handleFinalOpenCsv,
    handleFinalOpenMetaTrader,
  } = useOnboardingModel(plugin);

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
          onOpenMetaTrader={handleOpenMetaTrader}
          onOpenManual={handleOpenManual}
          manualLinkFallbackUrl={manualDocsFallbackUrl}
          manualLinkCopied={manualDocsCopied}
          onManualLinkCopy={copyManualDocsUrl}
        />
      )}
      {currentStep === 'choose-path' && (
        <ChoosePathStep
          selectedPath={selectedPath}
          onSelect={setSelectedPath}
          onNext={handleChoosePathNext}
          onBack={() => setCurrentStep('explore')}
        />
      )}
      {currentStep === 'contextual-final' && (
        <ContextualFinalStep
          path={selectedPath ?? 'manual'}
          onBack={() => setCurrentStep('choose-path')}
          onFinish={handleFinish}
          onChangeHotkey={handleChangeHotkey}
          onAddTrade={handleAddTrade}
          onOpenCsv={handleFinalOpenCsv}
          onOpenMetaTrader={handleFinalOpenMetaTrader}
        />
      )}
    </div>
  );
};
