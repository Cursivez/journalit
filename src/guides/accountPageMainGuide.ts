import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_PAGE_VIEW_TYPE } from '../views/AccountPageView';
import {
  ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID,
  ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_MAIN_GUIDE_ID,
  ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID,
  ACCOUNT_PAGE_RISK_SECTION_TARGET_ID,
  ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
  ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
} from './accountPageGuideIds';

export function registerAccountPageMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_PAGE_MAIN_GUIDE_ID,
    viewType: ACCOUNT_PAGE_VIEW_TYPE,
    version: 2,
    autoShow: true,
    priority: 110,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('account-page.guide.main.intro.title'),
        description: t('account-page.guide.main.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'balance-chart',
        title: t('account-page.guide.main.balance-chart.title'),
        description: t('account-page.guide.main.balance-chart.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID,
      },
      {
        id: 'metrics',
        title: t('account-page.guide.main.metrics.title'),
        description: t('account-page.guide.main.metrics.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID,
      },
      {
        id: 'risk',
        title: t('account-page.guide.main.risk.title'),
        description: t('account-page.guide.main.risk.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_RISK_SECTION_TARGET_ID,
      },
      {
        id: 'transactions',
        title: t('account-page.guide.main.transactions.title'),
        description: t('account-page.guide.main.transactions.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
      },
      {
        id: 'view-trades',
        title: t('account-page.guide.main.trade-log.title'),
        description: t('account-page.guide.main.trade-log.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
      },
      {
        id: 'add-event',
        title: t('account-page.guide.main.add-event.title'),
        description: t('account-page.guide.main.add-event.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
      },
      {
        id: 'edit-account',
        title: t('account-page.guide.main.edit-account.title'),
        description: t('account-page.guide.main.edit-account.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
      },
    ],
  });
}
