import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_DASHBOARD_VIEW_TYPE } from '../views/AccountDashboardView';
import {
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID,
  ACCOUNT_DASHBOARD_SETTINGS_INCLUSION_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_ORDER_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_STAGES_TARGET_ID,
  ACCOUNT_DASHBOARD_SETTINGS_TYPES_TARGET_ID,
} from './accountDashboardGuideIds';


export function registerAccountDashboardSettingsGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_DASHBOARD_SETTINGS_GUIDE_ID,
    viewType: ACCOUNT_DASHBOARD_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 130,
    initialStepId: 'settings-types',
    replayGuideId: ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
    steps: [
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
        id: 'settings-stages',
        title: t('account-dashboard.guide.main.settings-stages.title'),
        description: t(
          'account-dashboard.guide.main.settings-stages.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SETTINGS_STAGES_TARGET_ID,
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
    ],
  });
}
