import type { HomeViewMode } from '../../settings/types';

export const HOME_MODE_CHANGE_EVENT = 'journalit:home-mode-change';

export interface HomeModeChangeEventDetail {
  mode: HomeViewMode;
  source: 'navigation' | 'restoration';
}

interface HomeModeChangeHandlers {
  onModeChange: (mode: HomeViewMode) => void;
  onDashboardNavigation: () => void;
}

const isHomeModeChangeEventDetail = (
  value: unknown
): value is HomeModeChangeEventDetail => {
  if (!value || typeof value !== 'object') return false;

  const mode: unknown = Reflect.get(value, 'mode');
  const source: unknown = Reflect.get(value, 'source');
  return (
    (mode === 'overview' || mode === 'dashboard') &&
    (source === 'navigation' || source === 'restoration')
  );
};

export const subscribeToHomeModeChanges = (
  eventTarget: EventTarget,
  handlers: HomeModeChangeHandlers
): (() => void) => {
  const handleModeChange = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    if (!isHomeModeChangeEventDetail(detail)) return;

    handlers.onModeChange(detail.mode);
    if (detail.source === 'navigation' && detail.mode === 'dashboard') {
      handlers.onDashboardNavigation();
    }
  };

  eventTarget.addEventListener(HOME_MODE_CHANGE_EVENT, handleModeChange);
  return () =>
    eventTarget.removeEventListener(HOME_MODE_CHANGE_EVENT, handleModeChange);
};
