
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { TRADE_LOG_VIEW_TYPE } from '../views/TradeLogView';
import { HOME_VIEW_TYPE } from '../views/HomeView';
import {
  DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID,
  FILTER_MENU_DONE_STEP_ID,
  FILTER_MENU_EXCLUDE_STEP_ID,
  FILTER_MENU_EXCLUDE_TARGET_ID,
  FILTER_MENU_MATCH_STEP_ID,
  FILTER_MENU_MATCH_TARGET_ID,
  FILTER_MENU_OPEN_STEP_ID,
  FILTER_MENU_OPENED_ACTION_ID,
  FILTER_MENU_PHASED_ACCOUNTS_CONTEXT_KEY,
  FILTER_MENU_PHASES_STEP_ID,
  FILTER_MENU_PHASES_TARGET_ID,
  FILTER_MENU_WHATS_NEW_VIEWS,
  type FilterMenuWhatsNewGuideId,
  TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID,
} from './filterMenuWhatsNewGuideIds';


const VIEW_TYPES: Readonly<Record<FilterMenuWhatsNewGuideId, string>> = {
  [TRADE_LOG_WHATS_NEW_FILTER_MENU_GUIDE_ID]: TRADE_LOG_VIEW_TYPE,
  [DASHBOARD_WHATS_NEW_FILTER_MENU_GUIDE_ID]: HOME_VIEW_TYPE,
};

export function registerFilterMenuWhatsNewGuides(
  guideRegistry: GuideRegistry
): void {
  for (const view of FILTER_MENU_WHATS_NEW_VIEWS) {
    guideRegistry.registerGuide({
      id: view.whatsNewGuideId,
      viewType: VIEW_TYPES[view.whatsNewGuideId],
      version: 1,
      autoShow: true,
      priority: 105,
      replayGuideId: view.mainGuideId,
      initialStepId: FILTER_MENU_OPEN_STEP_ID,
      steps: [
        {
          id: FILTER_MENU_OPEN_STEP_ID,
          title: t('filter.menu.whats-new.open.title'),
          description: t('filter.menu.whats-new.open.description'),
          progression: 'action-required',
          targetId: view.filterButtonTargetId,
          requiredActionId: FILTER_MENU_OPENED_ACTION_ID,
        },
        {
          id: FILTER_MENU_EXCLUDE_STEP_ID,
          title: t('filter.menu.whats-new.exclude.title'),
          description: t('filter.menu.whats-new.exclude.description'),
          progression: 'manual',
          targetId: FILTER_MENU_EXCLUDE_TARGET_ID,
          placement: 'left',
        },
        {
          id: FILTER_MENU_MATCH_STEP_ID,
          title: t('filter.menu.whats-new.match.title'),
          description: t('filter.menu.whats-new.match.description'),
          progression: 'manual',
          targetId: FILTER_MENU_MATCH_TARGET_ID,
          placement: 'left',
        },
        {
          id: FILTER_MENU_PHASES_STEP_ID,
          title: t('filter.menu.whats-new.phases.title'),
          description: t('filter.menu.whats-new.phases.description'),
          progression: 'manual',
          targetId: FILTER_MENU_PHASES_TARGET_ID,
          placement: 'left',
          requiredContext: {
            key: FILTER_MENU_PHASED_ACCOUNTS_CONTEXT_KEY,
            equals: true,
          },
        },
        {
          id: FILTER_MENU_DONE_STEP_ID,
          title: t('filter.menu.whats-new.done.title'),
          description: t('filter.menu.whats-new.done.description'),
          progression: 'manual',
          placement: 'center',
        },
      ],
    });
  }
}
