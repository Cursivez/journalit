import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  DASHBOARD_BOTTOM_SECTION_TARGET_ID,
  DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
  DASHBOARD_FILTER_BUTTON_TARGET_ID,
  DASHBOARD_MAIN_GUIDE_ID,
  DASHBOARD_METRICS_SECTION_TARGET_ID,
} from './dashboardGuideIds';


export function registerDashboardMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: DASHBOARD_MAIN_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: 5,
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
        id: 'edit-layout',
        title: t('dashboard.guide.main.edit-layout.title'),
        description: t('dashboard.guide.main.edit-layout.description'),
        progression: 'manual',
        targetId: DASHBOARD_EDIT_LAYOUT_BUTTON_TARGET_ID,
      },
    ],
  });
}
