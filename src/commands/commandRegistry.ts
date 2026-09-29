

import { Notice } from 'obsidian';
import type JournalitPlugin from '../main';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import { PositionSizeCalculatorModal } from '../components/modals/PositionSizeCalculatorModal';
import { openQuickTradeImportModal } from '../components/csv/QuickTradeImportModal';
import { t } from '../lang/helpers';
import { guidesRequireResolution } from '../guides/GuideRegistry';
import type { GuideDefinition } from '../guides/types';
import { openLegacyChallengeOnboardingModal } from '../components/onboarding/legacyChallenge/LegacyChallengeOnboardingModal';


export class CommandRegistry {
  constructor(private plugin: JournalitPlugin) {}

  
  public registerAllCommands(): void {
    this.registerAuthCommands();
    this.registerRemainingCommands();
  }

  
  private registerAuthCommands(): void {}

  
  private registerRemainingCommands(): void {
    this.registerTradeCommands();
    this.registerReviewCommands();
    this.registerViewCommands();
    this.registerMaintenanceCommands();
    this.registerTemplateCommands();
    this.registerSampleJournalCommands();
    this.registerShareCommands();
  }

  
  private registerShareCommands(): void {
    this.plugin.addCommand({
      id: 'share-note-as-image',
      name: t('command.share-note-as-image'),
      checkCallback: (checking) =>
        this.plugin.processorManager.shareActiveNoteAsImage(checking),
    });
  }

  
  private registerTradeCommands(): void {
    
    this.plugin.addCommand({
      id: 'add-trade',
      name: t('command.add-trade'),
      callback: async () => {
        
        const modal = new TradeFormModal({
          app: this.plugin.app,
          plugin: this.plugin,
        });
        modal.open();
      },
    });

    
    this.plugin.addCommand({
      id: 'import-trades-csv',
      name: t('command.import-trades-csv'),
      callback: async () => {
        await this.plugin.viewManager.openCSVImportView();
      },
    });

    this.plugin.addCommand({
      id: 'quick-import-trades',
      name: t('command.quick-import-trades'),
      callback: () => {
        openQuickTradeImportModal(this.plugin);
      },
    });

    this.plugin.addCommand({
      id: 'sync-trades-now',
      name: t('command.sync-trades-now'),
      callback: async () => {
        if (this.plugin.demoSessionService?.isActive()) {
          new Notice(t('sample.notice.sync-blocked'));
          return;
        }
        await this.plugin.ensureTradeSyncCoordinator().syncNow();
      },
    });
  }

  private registerSampleJournalCommands(): void {
    this.plugin.addCommand({
      id: 'open-sample-journal',
      name: t('command.open-sample-journal'),
      callback: async () => {
        await this.plugin.demoSessionService?.startOrOpen();
      },
    });

    this.plugin.addCommand({
      id: 'exit-sample-journal',
      name: t('command.exit-sample-journal'),
      checkCallback: (checking) => {
        const session = this.plugin.demoSessionService;
        if (!session?.isActive()) return false;
        if (!checking) void session.requestExit();
        return true;
      },
    });

    this.plugin.addCommand({
      id: 'reset-sample-journal',
      name: t('command.reset-sample-journal'),
      checkCallback: (checking) => {
        const session = this.plugin.demoSessionService;
        if (!session?.hasRecoverableSession()) {
          return false;
        }
        if (!checking) void session.requestReset();
        return true;
      },
    });
  }

  
  private registerReviewCommands(): void {
    
    this.plugin.addCommand({
      id: 'create-drc',
      name: t('command.create-drc'),
      callback: async () => {
        try {
          const drcService = await this.plugin.serviceManager.getDRCService();
          await drcService.openDRC(new Date());
        } catch (error) {
          console.error('Failed to open DRC:', error);
          new Notice(
            t('notice.error.open-drc', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });

    
    this.plugin.addCommand({
      id: 'create-weekly-review',
      name: t('command.create-weekly-review'),
      callback: async () => {
        try {
          const weeklyReviewService =
            await this.plugin.serviceManager.getWeeklyReviewService();
          await weeklyReviewService.openWeeklyReview(new Date());
        } catch (error) {
          console.error('Failed to open Weekly Review:', error);
          new Notice(
            t('notice.error.open-weekly-review', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });

    
    this.plugin.addCommand({
      id: 'create-monthly-review',
      name: t('command.create-monthly-review'),
      callback: async () => {
        try {
          const monthlyReviewService =
            await this.plugin.serviceManager.getMonthlyReviewService();
          await monthlyReviewService.openMonthlyReview(new Date());
        } catch (error) {
          console.error('Failed to open Monthly Review:', error);
          new Notice(
            t('notice.error.open-monthly-review', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });

    
    this.plugin.addCommand({
      id: 'create-quarterly-review',
      name: t('command.create-quarterly-review'),
      callback: async () => {
        try {
          const quarterlyReviewService =
            await this.plugin.serviceManager.getQuarterlyReviewService();
          await quarterlyReviewService.openQuarterlyReview(new Date());
        } catch (error) {
          console.error('Failed to open Quarterly Review:', error);
          new Notice(
            t('notice.error.open-quarterly-review', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });

    
    this.plugin.addCommand({
      id: 'create-yearly-review',
      name: t('command.create-yearly-review'),
      callback: async () => {
        try {
          const yearlyReviewService =
            await this.plugin.serviceManager.getYearlyReviewService();
          await yearlyReviewService.openYearlyReview(new Date());
        } catch (error) {
          console.error('Failed to open Yearly Review:', error);
          new Notice(
            t('notice.error.open-yearly-review', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });
  }

  
  private registerViewCommands(): void {
    
    this.plugin.addCommand({
      id: 'open-dashboard',
      name: t('command.open-dashboard'),
      callback: async () => {
        
        await this.plugin.viewManager.openDashboardView();
      },
    });

    
    this.plugin.addCommand({
      id: 'open-account-dashboard',
      name: t('command.open-account-dashboard'),
      callback: async () => {
        
        await this.plugin.openAccountDashboard();
      },
    });

    
    this.plugin.addCommand({
      id: 'open-legacy-challenge-onboarding',
      name: t('command.open-legacy-challenge-onboarding'),
      callback: async () => {
        await openLegacyChallengeOnboardingModal(this.plugin.app, this.plugin);
      },
    });

    
    this.plugin.addCommand({
      id: 'open-trade-log',
      name: t('command.open-trade-log'),
      callback: async () => {
        
        await this.plugin.viewManager.openTradeLogView();
      },
    });

    this.plugin.addCommand({
      id: 'open-setups',
      name: t('command.open-setups'),
      callback: async () => {
        await this.plugin.viewManager.openSetupsView();
      },
    });

    
    this.plugin.addCommand({
      id: 'open-home',
      name: t('command.open-home'),
      callback: async () => {
        await this.plugin.viewManager.openHomeView('overview');
      },
    });

    this.plugin.addCommand({
      id: 'open-settings',
      name: t('command.open-settings'),
      callback: () => {
        this.plugin.openSettings();
      },
    });

    
    this.plugin.addCommand({
      id: 'open-navigation-sidebar',
      name: t('command.open-navigation-sidebar'),
      callback: async () => {
        await this.plugin.openNavigationSidebar();
      },
    });

    this.plugin.addCommand({
      id: 'open-calendar-sidebar',
      name: t('command.open-calendar-sidebar'),
      callback: async () => {
        await this.plugin.openCalendarSidebar();
      },
    });

    this.plugin.addCommand({
      id: 'open-economic-calendar',
      name: t('command.open-economic-calendar'),
      callback: async () => {
        await this.plugin.viewManager.openEconomicCalendarView();
      },
    });

    this.plugin.addCommand({
      id: 'open-session-mode',
      name: t('command.open-session-mode'),
      callback: async () => {
        await this.plugin.openSessionMode();
      },
    });

    
    this.plugin.addCommand({
      id: 'open-position-size-calculator',
      name: t('command.open-position-size-calculator'),
      callback: () => {
        const modal = new PositionSizeCalculatorModal(
          this.plugin.app,
          this.plugin
        );
        modal.open();
      },
    });
  }

  
  private registerMaintenanceCommands(): void {
    
    this.plugin.addCommand({
      id: 'replay-onboarding',
      name: t('command.replay-onboarding'),
      callback: async () => {
        
        
        await this.plugin.onboardingManager.showOnboardingModal();
      },
    });

    
    this.plugin.addCommand({
      id: 'replay-current-view-guide',
      name: t('command.replay-current-view-guide'),
      callback: async () => {
        const guideService = this.plugin.viewGuideService;
        const guideRegistry = this.plugin.guideRegistry;

        if (!guideService || !guideRegistry) {
          new Notice(t('notice.guide.replay-unavailable'));
          return;
        }

        const activeLeaf = guideService.getActiveLeaf();
        const activeContext = guideService.getActiveLeafContext();

        if (!activeLeaf || !activeContext.viewType) {
          new Notice(t('notice.guide.no-active-view'));
          return;
        }

        const viewResolvesGuide = guidesRequireResolution(
          guideRegistry.getGuidesForView(activeContext.viewType)
        );

        
        
        
        
        
        let guide: GuideDefinition | null;
        if (viewResolvesGuide) {
          const resolvedGuideId =
            guideService.getResolvedGuideForLeaf(activeLeaf);
          guide = resolvedGuideId
            ? guideRegistry.getGuideById(resolvedGuideId)
            : null;
          if (!guide) {
            new Notice(t('notice.guide.unavailable-in-current-state'));
            return;
          }
        } else {
          guide = guideRegistry.getPrimaryGuideForView(activeContext.viewType);
        }

        if (!guide || guide.viewType !== activeContext.viewType) {
          new Notice(
            t('notice.guide.no-guide-for-view', {
              viewType: activeContext.viewType,
            })
          );
          return;
        }

        
        if (guide.replayGuideId) {
          const replayGuide = guideRegistry.getGuideById(guide.replayGuideId);
          if (replayGuide) {
            guide = replayGuide;
          }
        }

        
        
        
        guideService.setResolvedGuideForLeaf(activeLeaf, guide.id);

        const result = await guideService.startOrResumeSession({
          guideId: guide.id,
          guideVersion: guide.version,
          leaf: activeLeaf,
          initialStepId: guide.initialStepId,
          forceRestart: true,
        });

        if (!result.session) {
          new Notice(t('notice.guide.replay-failed'));
          return;
        }

        new Notice(t('notice.guide.replay-started'));
      },
    });

    
    this.plugin.addCommand({
      id: 'open-release-notes',
      name: t('command.open-release-notes'),
      callback: async () => {
        try {
          await this.plugin.updateNotificationService?.openReleaseNotes();
        } catch (error) {
          console.error('Failed to open release notes:', error);
          new Notice(
            t('notice.error.open-release-notes', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  }

  
  private registerTemplateCommands(): void {
    
    this.plugin.addCommand({
      id: 'open-layout-builder',
      name: t('command.open-layout-builder'),
      callback: async () => {
        try {
          await this.plugin.viewManager.openTemplateBuilderView();
        } catch (error) {
          console.error('Failed to open Layout Builder:', error);
          new Notice(
            t('notice.error.open-layout-builder', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });
  }
}
