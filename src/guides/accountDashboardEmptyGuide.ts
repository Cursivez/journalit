import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_DASHBOARD_VIEW_TYPE } from '../views/AccountDashboardView';
import {
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_CREATE_ACCOUNT_OPENED_ACTION_ID,
  ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID,
  ACCOUNT_DASHBOARD_EMPTY_STATE_TARGET_ID,
} from './accountDashboardGuideIds';

export function registerAccountDashboardEmptyGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_DASHBOARD_EMPTY_GUIDE_ID,
    viewType: ACCOUNT_DASHBOARD_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('account-dashboard.guide.empty.intro.title'),
        description: t('account-dashboard.guide.empty.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'empty-state',
        title: t('account-dashboard.guide.empty.state.title'),
        description: t('account-dashboard.guide.empty.state.description'),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_EMPTY_STATE_TARGET_ID,
      },
      {
        id: 'create-account',
        title: t('account-dashboard.guide.empty.create.title'),
        description: t('account-dashboard.guide.empty.create.description'),
        progression: 'action-required',
        targetId: ACCOUNT_DASHBOARD_CREATE_ACCOUNT_BUTTON_TARGET_ID,
        requiredActionId: ACCOUNT_DASHBOARD_CREATE_ACCOUNT_OPENED_ACTION_ID,
      },
      {
        id: 'after-create',
        title: t('account-dashboard.guide.empty.after-create.title'),
        description: t(
          'account-dashboard.guide.empty.after-create.description'
        ),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
