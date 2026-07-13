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

export async function openImageGalleryWithFilters(
  plugin: JournalitPlugin,
  filters: Partial<TradeLogFilters>
): Promise<void> {
  const currentState = plugin.uiStateManager.getState();
  const currentFilters = currentState.viewFilters?.tradelog;
  const defaultTradeLogFilters = createTradeLogFilters();

  await plugin.uiStateManager.updateState({
    tradeLogMode: 'imageGallery',
    imageGallery: {
      sourceType: 'trade',
      sort: currentState.imageGallery?.sort ?? 'newest',
      size: currentState.imageGallery?.size ?? 'medium',
    },
    viewFilters: {
      dashboard:
        currentState.viewFilters?.dashboard ?? createDashboardFilters(),
      reviews: currentState.viewFilters?.reviews ?? createReviewFilters(),
      tradelog: {
        ...defaultTradeLogFilters,
        ...currentFilters,
        imageAnnotationStatus: defaultTradeLogFilters.imageAnnotationStatus,
        imageTags: defaultTradeLogFilters.imageTags,
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
