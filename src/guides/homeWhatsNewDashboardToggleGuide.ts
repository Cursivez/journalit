import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  HOME_FILTERS_TARGET_ID,
  HOME_FILTER_POPOVER_OPENED_ACTION_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_MODE_TOGGLE_TARGET_ID,
  HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
} from './homeGuideIds';


export function registerHomeWhatsNewDashboardToggleGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: HOME_WHATS_NEW_DASHBOARD_TOGGLE_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 105,
    replayGuideId: HOME_MAIN_GUIDE_ID,
    initialStepId: 'mode-toggle',
    steps: [
      {
        id: 'mode-toggle',
        title: t('home.guide.whats-new.mode.title'),
        description: t('home.guide.whats-new.mode.description'),
        progression: 'manual',
        targetId: HOME_MODE_TOGGLE_TARGET_ID,
      },
      {
        id: 'filters',
        title: t('home.guide.whats-new.filters.title'),
        description: t('home.guide.whats-new.filters.description'),
        progression: 'action-required',
        targetId: HOME_FILTERS_TARGET_ID,
        requiredActionId: HOME_FILTER_POPOVER_OPENED_ACTION_ID,
      },
      {
        id: 'done',
        title: t('home.guide.whats-new.done.title'),
        description: t('home.guide.whats-new.done.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
