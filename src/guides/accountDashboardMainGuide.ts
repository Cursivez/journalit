import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_DASHBOARD_VIEW_TYPE } from '../views/AccountDashboardView';
import {
  ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_AUM_CHART_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_METRICS_TARGET_ID,
  ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
  ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID,
} from './accountDashboardGuideIds';


export function registerAccountDashboardMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
    viewType: ACCOUNT_DASHBOARD_VIEW_TYPE,
    version: 5,
    autoShow: true,
    priority: 110,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('account-dashboard.guide.main.intro.title'),
        description: t('account-dashboard.guide.main.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'aum-chart',
        title: t('account-dashboard.guide.main.aum-chart.title'),
        description: t('account-dashboard.guide.main.aum-chart.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_AUM_CHART_TARGET_ID,
      },
      {
        id: 'metrics',
        title: t('account-dashboard.guide.main.metrics.title'),
        description: t('account-dashboard.guide.main.metrics.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_METRICS_TARGET_ID,
      },
      {
        id: 'mode-switch',
        title: t('account-dashboard.guide.main.mode-switch.title'),
        description: t('account-dashboard.guide.main.mode-switch.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'create-account',
        title: t('account-dashboard.guide.main.create-account.title'),
        description: t(
          'account-dashboard.guide.main.create-account.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
      },
      {
        id: 'open-account',
        title: t('account-dashboard.guide.main.open-account.title'),
        description: t('account-dashboard.guide.main.open-account.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
        requiredActionId: ACCOUNT_DASHBOARD_ACCOUNT_OPENED_ACTION_ID,
      },
    ],
  });
}
