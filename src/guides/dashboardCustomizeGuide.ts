import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID,
  DASHBOARD_CUSTOMIZE_GUIDE_ID,
  DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
  DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID,
  DASHBOARD_MAIN_GUIDE_ID,
  DASHBOARD_WIDGET_PICKER_TARGET_ID,
  DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID,
} from './dashboardGuideIds';


export function registerDashboardCustomizeGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: DASHBOARD_CUSTOMIZE_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 130,
    initialStepId: 'open-widget-selector',
    replayGuideId: DASHBOARD_MAIN_GUIDE_ID,
    steps: [
      {
        id: 'open-widget-selector',
        title: t('dashboard.guide.main.open-widget-selector.title'),
        description: t('dashboard.guide.main.open-widget-selector.description'),
        progression: 'action-required',
        targetId: DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID,
        requiredActionId: DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID,
      },
      {
        id: 'widget-picker',
        title: t('dashboard.guide.main.widget-picker.title'),
        description: t('dashboard.guide.main.widget-picker.description'),
        progression: 'manual',
        targetId: DASHBOARD_WIDGET_PICKER_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: false,
      },
      {
        id: 'save-layout',
        title: t('dashboard.guide.main.save-layout.title'),
        description: t('dashboard.guide.main.save-layout.description'),
        progression: 'action-required',
        targetId: DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
        requiredActionId: DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID,
      },
    ],
  });
}
