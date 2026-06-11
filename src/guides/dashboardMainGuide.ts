import { DASHBOARD_VIEW_TYPE } from '../components/dashboard/DashboardView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  DASHBOARD_ADD_WIDGET_BUTTON_TARGET_ID,
  DASHBOARD_BOTTOM_SECTION_TARGET_ID,
  DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
  DASHBOARD_EDIT_MODE_DISABLED_ACTION_ID,
  DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID,
  DASHBOARD_FILTER_BUTTON_TARGET_ID,
  DASHBOARD_MAIN_GUIDE_ID,
  DASHBOARD_METRICS_SECTION_TARGET_ID,
  DASHBOARD_WIDGET_PICKER_TARGET_ID,
  DASHBOARD_WIDGET_SELECTOR_OPENED_ACTION_ID,
} from './dashboardGuideIds';

export function registerDashboardMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: DASHBOARD_MAIN_GUIDE_ID,
    viewType: DASHBOARD_VIEW_TYPE,
    version: 3,
    autoShow: true,
    priority: 110,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('dashboard.guide.main.intro.title'),
        description: t('dashboard.guide.main.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'filters',
        title: t('dashboard.guide.main.filters.title'),
        description: t('dashboard.guide.main.filters.description'),
        progression: 'manual',
        targetId: DASHBOARD_FILTER_BUTTON_TARGET_ID,
      },
      {
        id: 'edit-layout',
        title: t('dashboard.guide.main.edit-layout.title'),
        description: t('dashboard.guide.main.edit-layout.description'),
        progression: 'action-required',
        targetId: DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
        requiredActionId: DASHBOARD_EDIT_MODE_ENABLED_ACTION_ID,
      },
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
        id: 'metrics-section',
        title: t('dashboard.guide.main.metrics.title'),
        description: t('dashboard.guide.main.metrics.description'),
        progression: 'manual',
        targetId: DASHBOARD_METRICS_SECTION_TARGET_ID,
      },
      {
        id: 'bottom-section',
        title: t('dashboard.guide.main.bottom.title'),
        description: t('dashboard.guide.main.bottom.description'),
        progression: 'manual',
        targetId: DASHBOARD_BOTTOM_SECTION_TARGET_ID,
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
