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
  ACCOUNT_DASHBOARD_SETTINGS_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID,
  ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID,
} from './accountDashboardGuideIds';

export function registerAccountDashboardMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
    viewType: ACCOUNT_DASHBOARD_VIEW_TYPE,
    version: 1,
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
        id: 'sections',
        title: t('account-dashboard.guide.main.sections.title'),
        description: t('account-dashboard.guide.main.sections.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
      },
      {
        id: 'trade-filter',
        title: t('account-dashboard.guide.main.trade-filter.title'),
        description: t('account-dashboard.guide.main.trade-filter.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_TRADE_TYPE_FILTER_TARGET_ID,
        placement: 'right',
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
        id: 'settings',
        title: t('account-dashboard.guide.main.settings.title'),
        description: t('account-dashboard.guide.main.settings.description'),
        progression: 'action-required',
        targetId: ACCOUNT_DASHBOARD_SETTINGS_BUTTON_TARGET_ID,
        requiredActionId: ACCOUNT_DASHBOARD_SETTINGS_OPENED_ACTION_ID,
      },
      {
        id: 'settings-types',
        title: t('account-dashboard.guide.main.settings-types.title'),
        description: t(
          'account-dashboard.guide.main.settings-types.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: false,
      },
      {
        id: 'settings-inclusion',
        title: t('account-dashboard.guide.main.settings-inclusion.title'),
        description: t(
          'account-dashboard.guide.main.settings-inclusion.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: false,
      },
      {
        id: 'settings-order',
        title: t('account-dashboard.guide.main.settings-order.title'),
        description: t(
          'account-dashboard.guide.main.settings-order.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: false,
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
