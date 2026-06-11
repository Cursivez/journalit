import { DASHBOARD_VIEW_TYPE } from '../components/dashboard/DashboardView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  DASHBOARD_EMPTY_GUIDE_ID,
  DASHBOARD_EMPTY_STATE_TARGET_ID,
} from './dashboardGuideIds';

export function registerDashboardEmptyGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: DASHBOARD_EMPTY_GUIDE_ID,
    viewType: DASHBOARD_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('dashboard.guide.empty.intro.title'),
        description: t('dashboard.guide.empty.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'empty-state',
        title: t('dashboard.guide.empty.state.title'),
        description: t('dashboard.guide.empty.state.description'),
        progression: 'manual',
        targetId: DASHBOARD_EMPTY_STATE_TARGET_ID,
      },
    ],
  });
}
