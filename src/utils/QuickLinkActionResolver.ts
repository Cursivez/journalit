

import JournalitPlugin from '../main';
import { QuickLinkAction } from '../settings/types';
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

      case 'openLayoutBuilder':
        await this.plugin.viewManager.openTemplateBuilderView();
        break;

      case 'openHome':
        await this.plugin.viewManager.openHomeView();
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
