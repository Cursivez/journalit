

import { Notice, MarkdownView } from 'obsidian';
import type JournalitPlugin from '../main';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import { PositionSizeCalculatorModal } from '../components/modals/PositionSizeCalculatorModal';
import { openQuickTradeImportModal } from '../components/csv/QuickTradeImportModal';
import { eventBus } from '../services/events';
import {
  ensureTradeIdentityFrontmatter,
  isTradeIdentityEligibleNote,
} from '../utils/tradeIdentity';
import { t } from '../lang/helpers';
import type { ReviewTemplate, TradeTemplate } from '../types/reviewV2';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

interface MutableTradeTemplateFrontmatter {
  [key: string]: unknown;
  templateId?: string;
  templateVersion?: string | number;
}

function getStringValue(
  record: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
}


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
        await this.plugin.viewManager.openHomeView();
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
        await this.plugin.viewManager.openOnboardingView();
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

        const guidesForView = guideRegistry.getGuidesForView(
          activeContext.viewType
        );

        const activeSession = guideService.getSessionForLeaf(
          activeLeaf,
          activeContext.viewType
        );

        const isMultiGuideView = guidesForView.length > 1;
        const resolvedGuideId = isMultiGuideView
          ? guideService.getResolvedGuideForLeaf(activeLeaf)
          : null;

        let guide = resolvedGuideId
          ? guideRegistry.getGuideById(resolvedGuideId)
          : null;

        if (!guide && activeSession) {
          guide = guideRegistry.getGuideById(activeSession.guideId);
        }

        if (!guide && !isMultiGuideView) {
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

    
    this.plugin.addCommand({
      id: 'switch-template',
      name: t('command.switch-template'),
      callback: async () => {
        try {
          
          const activeView =
            this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
          if (!activeView?.file) {
            new Notice(t('notice.error.no-active-file'));
            return;
          }

          
          const cache = this.plugin.app.metadataCache.getFileCache(
            activeView.file
          );
          const frontmatter = asRecord(cache?.frontmatter);
          const noteType = getStringValue(frontmatter, 'type');
          const currentTemplateId = getStringValue(frontmatter, 'templateId');

          
          const [
            { ReviewTemplateService },
            { TradeTemplateService },
            { openTemplatePickerModal },
          ] = await Promise.all([
            import('../services/templates/ReviewTemplateService'),
            import('../services/templates/TradeTemplateService'),
            import('../components/modals/TemplatePickerModal'),
          ]);

          let templates: Array<ReviewTemplate | TradeTemplate> = [];
          let title = t('template.switch-title');
          let defaultTemplateId: string | undefined;

          
          if (noteType === 'drc') {
            const service = new ReviewTemplateService(this.plugin);
            templates = service.getTemplates('drc');
            title = t('template.switch-review-title', {
              type: t('template.review-type.drc'),
            });
            defaultTemplateId = this.plugin.settings.templates?.defaultDrc;
          } else if (noteType === 'weekly-review') {
            const service = new ReviewTemplateService(this.plugin);
            templates = service.getTemplates('weekly');
            title = t('template.switch-review-title', {
              type: t('template.review-type.weekly'),
            });
            defaultTemplateId = this.plugin.settings.templates?.defaultWeekly;
          } else if (noteType === 'monthly-review') {
            const service = new ReviewTemplateService(this.plugin);
            templates = service.getTemplates('monthly');
            title = t('template.switch-review-title', {
              type: t('template.review-type.monthly'),
            });
            defaultTemplateId = this.plugin.settings.templates?.defaultMonthly;
          } else if (noteType === 'quarterly-review') {
            const service = new ReviewTemplateService(this.plugin);
            templates = service.getTemplates('quarterly');
            title = t('template.switch-review-title', {
              type: t('template.review-type.quarterly'),
            });
            defaultTemplateId =
              this.plugin.settings.templates?.defaultQuarterly;
          } else if (noteType === 'yearly-review') {
            const service = new ReviewTemplateService(this.plugin);
            templates = service.getTemplates('yearly');
            title = t('template.switch-review-title', {
              type: t('template.review-type.yearly'),
            });
            defaultTemplateId = this.plugin.settings.templates?.defaultYearly;
          } else if (
            noteType === 'trade' ||
            noteType === 'backtest-trade' ||
            noteType === 'missed-trade' ||
            frontmatter?.isMissedTrade === true
          ) {
            const service = new TradeTemplateService(this.plugin);
            templates = service.getTemplates();
            title = t('template.switch-trade-title');
            defaultTemplateId = this.plugin.settings.templates?.defaultTrade;
          } else {
            new Notice(t('notice.error.no-template-support'));
            return;
          }

          if (templates.length === 0) {
            new Notice(t('notice.error.no-templates'));
            return;
          }

          
          openTemplatePickerModal(
            this.plugin.app,
            templates,
            currentTemplateId,
            title,
            async (template) => {
              const filePath = activeView.file!.path;

              
              if (
                noteType === 'drc' ||
                noteType === 'weekly-review' ||
                noteType === 'monthly-review' ||
                noteType === 'quarterly-review' ||
                noteType === 'yearly-review'
              ) {
                const { TemplateTransformationService } =
                  await import('../services/templates/TemplateTransformationService');
                const transformService = new TemplateTransformationService(
                  this.plugin
                );

                
                
                if (template.type === 'trade') {
                  console.warn(
                    'Attempted to apply trade template to a review note:',
                    template
                  );
                  return;
                }

                const success = await transformService.applyTemplate(
                  filePath,
                  template,
                  true
                );

                if (success) {
                  new Notice(
                    t('notice.template-switched', { name: template.name })
                  );
                }
              } else {
                
                await this.plugin.app.fileManager.processFrontMatter(
                  activeView.file!,
                  (frontmatter: MutableTradeTemplateFrontmatter) => {
                    if (
                      isTradeIdentityEligibleNote(
                        frontmatter,
                        activeView.file!.path
                      )
                    ) {
                      ensureTradeIdentityFrontmatter(frontmatter);
                    }
                    frontmatter.templateId = template.id;
                    frontmatter.templateVersion = template.version;
                  }
                );

                
                eventBus.publish('trade:changed', {
                  action: 'updated',
                  filePaths: [filePath],
                });

                new Notice(
                  t('notice.template-switched', { name: template.name })
                );
              }
            },
            defaultTemplateId
          );
        } catch (error) {
          console.error('Failed to switch template:', error);
          new Notice(
            t('notice.error.switch-template', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
    });
  }
}
