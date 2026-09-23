

import JournalitPlugin from '../main';
import type { EntityShortcutTarget, QuickLinkAction } from '../settings/types';
import { TradeFormModal } from '../components/forms/trade/TradeFormModal';
import { PositionSizeCalculatorModal } from '../components/modals/PositionSizeCalculatorModal';
import { openQuickTradeImportModal } from '../components/csv/QuickTradeImportModal';
import type { NavigationSource } from '../navigation/types';

interface QuickLinkActionOptions {
  createNewLeaf?: boolean;
  focusLeaf?: boolean;
  source?: NavigationSource;
}


export class QuickLinkActionResolver {
  constructor(private plugin: JournalitPlugin) {}

  async executeEntityShortcut(
    target: EntityShortcutTarget,
    options: QuickLinkActionOptions = {}
  ): Promise<void> {
    const createNewLeaf = options.createNewLeaf ?? true;
    const focusLeaf = options.focusLeaf ?? true;

    switch (target.kind) {
      case 'account':
        await this.plugin.viewManager.openAccountPageView(target.accountName, {
          newTab: createNewLeaf,
          focusLeaf,
        });
        return;
      case 'setup': {
        const setupService = await this.plugin.serviceManager.getSetupService();
        const setup = await setupService.getSetupById(target.setupId);
        if (!setup) return;
        await this.plugin.viewManager.openSetupsView(
          {
            page: 'detail',
            setupId: setup.id,
            setupName: setup.name,
            setupPath: setup.filePath,
          },
          { newTab: createNewLeaf, focusLeaf }
        );
        return;
      }
      default: {
        const exhaustiveTarget: never = target;
        return exhaustiveTarget;
      }
    }
  }

  
  async executeAction(
    action: QuickLinkAction,
    options: QuickLinkActionOptions = {}
  ): Promise<void> {
    const createNewLeaf = options.createNewLeaf ?? true;
    const focusLeaf = options.focusLeaf ?? true;
    const source = options.source ?? 'standard';
    switch (action) {
      case 'addTrade': {
        const modal = new TradeFormModal({
          app: this.plugin.app,
          plugin: this.plugin,
        });
        modal.open();
        break;
      }

      case 'openTradeLog':
        await this.plugin.viewManager.openTradeLogView();
        break;

      case 'openSetups':
        await this.plugin.viewManager.openSetupsView();
        break;

      case 'openTradingDashboard':
        await this.plugin.viewManager.openDashboardView();
        break;

      case 'openAccountDashboard':
        await this.plugin.viewManager.openAccountDashboardView();
        break;

      case 'openTodaysDRC':
        try {
          const drcService = await this.plugin.serviceManager.getDRCService();
          await drcService.openDRC(
            new Date(),
            createNewLeaf,
            focusLeaf,
            source
          ); 
        } catch (error) {
          console.error("Failed to open today's DRC:", error);
        }
        break;

      case 'openWeeklyReview':
        try {
          const weeklyReviewService =
            await this.plugin.serviceManager.getWeeklyReviewService();
          await weeklyReviewService.openWeeklyReview(
            new Date(),
            createNewLeaf,
            focusLeaf,
            source
          );
        } catch (error) {
          console.error('Failed to open weekly review:', error);
        }
        break;

      case 'openMonthlyReview':
        try {
          const monthlyReviewService =
            await this.plugin.serviceManager.getMonthlyReviewService();
          await monthlyReviewService.openMonthlyReview(
            new Date(),
            createNewLeaf,
            focusLeaf,
            source
          );
        } catch (error) {
          console.error('Failed to open monthly review:', error);
        }
        break;

      case 'openCSVImport':
        await this.plugin.viewManager.openCSVImportView();
        break;

      case 'openQuickTradeImport':
        openQuickTradeImportModal(this.plugin);
        break;

      case 'syncTradesNow':
        await this.plugin.ensureTradeSyncCoordinator().syncNow();
        break;

      case 'openLayoutBuilder':
        await this.plugin.viewManager.openTemplateBuilderView();
        break;

      case 'openNavigationSidebar':
        await this.plugin.openNavigationSidebar();
        break;

      case 'openSessionMode':
        await this.plugin.openSessionMode();
        break;

      case 'openHome':
        await this.plugin.viewManager.openHomeView('overview');
        break;

      case 'openSettings':
        this.plugin.openSettings();
        break;

      case 'openQuarterlyReview':
        try {
          const quarterlyReviewService =
            await this.plugin.serviceManager.getQuarterlyReviewService();
          await quarterlyReviewService.openQuarterlyReview(
            new Date(),
            createNewLeaf,
            focusLeaf,
            source
          );
        } catch (error) {
          console.error('Failed to open quarterly review:', error);
        }
        break;

      case 'openYearlyReview':
        try {
          const yearlyReviewService =
            await this.plugin.serviceManager.getYearlyReviewService();
          await yearlyReviewService.openYearlyReview(
            new Date(),
            createNewLeaf,
            focusLeaf,
            source
          );
        } catch (error) {
          console.error('Failed to open yearly review:', error);
        }
        break;

      case 'openEconomicCalendar':
        await this.plugin.viewManager.openEconomicCalendarView();
        break;

      case 'openPositionSizeCalculator': {
        const modal = new PositionSizeCalculatorModal(
          this.plugin.app,
          this.plugin
        );
        modal.open();
        break;
      }

      default:
        console.warn('Unknown quick link action');
    }
  }
}
