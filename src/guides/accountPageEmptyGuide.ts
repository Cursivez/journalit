import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_PAGE_VIEW_TYPE } from '../views/AccountPageView';
import {
  ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
  ACCOUNT_PAGE_EMPTY_GUIDE_ID,
  ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
  ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
} from './accountPageGuideIds';

export function registerAccountPageEmptyGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_PAGE_EMPTY_GUIDE_ID,
    viewType: ACCOUNT_PAGE_VIEW_TYPE,
    version: 2,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('account-page.guide.empty.intro.title'),
        description: t('account-page.guide.empty.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'transactions',
        title: t('account-page.guide.empty.transactions.title'),
        description: t('account-page.guide.empty.transactions.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
      },
      {
        id: 'view-trades',
        title: t('account-page.guide.empty.trade-log.title'),
        description: t('account-page.guide.empty.trade-log.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_VIEW_TRADES_BUTTON_TARGET_ID,
      },
      {
        id: 'add-event',
        title: t('account-page.guide.empty.add-event.title'),
        description: t('account-page.guide.empty.add-event.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_ADD_EVENT_BUTTON_TARGET_ID,
      },
      {
        id: 'edit-account',
        title: t('account-page.guide.empty.edit-account.title'),
        description: t('account-page.guide.empty.edit-account.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_EDIT_ACCOUNT_BUTTON_TARGET_ID,
      },
    ],
  });
}
