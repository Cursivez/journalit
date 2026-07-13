import type JournalitPlugin from '../main';
import { eventBus } from '../services/events';
import type { TradeLogFilters } from '../services/tradelog/types';
import {
  createDashboardFilters,
  createReviewFilters,
  createTradeLogFilters,
} from '../settings/viewFiltersDefaults';

type TradeLogFilterSyncWindow = Window & {
  journalitSyncTradeLogFilters?: () => void;
};

export async function openTradeLogWithFilters(
  plugin: JournalitPlugin,
  filters: Partial<TradeLogFilters>
): Promise<void> {
  const currentState = plugin.uiStateManager.getState();
  const currentFilters = currentState.viewFilters?.tradelog;

  await plugin.uiStateManager.updateState({
    tradeLogMode: 'trades',
    viewFilters: {
      dashboard:
        currentState.viewFilters?.dashboard ?? createDashboardFilters(),
      reviews: currentState.viewFilters?.reviews ?? createReviewFilters(),
      tradelog: {
        ...createTradeLogFilters(),
        ...currentFilters,
        ...filters,
      },
    },
  });

  void plugin.viewManager.openTradeLogView();
  window.setTimeout(() => {
    (window as TradeLogFilterSyncWindow).journalitSyncTradeLogFilters?.();
    eventBus.publish('tradelog:filters-updated');
  }, 250);
}
