import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import { ACCOUNT_PAGE_VIEW_TYPE } from '../views/AccountPageView';
import {
  ACCOUNT_PAGE_ACTIONS_TARGET_ID,
  ACCOUNT_PAGE_BALANCE_SECTION_TARGET_ID,
  ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID,
  ACCOUNT_PAGE_MAIN_GUIDE_ID,
  ACCOUNT_PAGE_METRICS_SECTION_TARGET_ID,
  ACCOUNT_PAGE_RISK_SECTION_TARGET_ID,
  ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
} from './accountPageGuideIds';


export function registerAccountPageMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_PAGE_MAIN_GUIDE_ID,
    viewType: ACCOUNT_PAGE_VIEW_TYPE,
    version: 12,
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
        
        
        id: 'challenge',
        title: t('account-page.guide.main.challenge.title'),
        description: t('account-page.guide.main.challenge.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        
        
        id: 'risk',
        title: t('account-page.guide.main.risk.title'),
        description: t('account-page.guide.main.risk.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_RISK_SECTION_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'transactions',
        title: t('account-page.guide.main.transactions.title'),
        description: t('account-page.guide.main.transactions.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_TRANSACTIONS_SECTION_TARGET_ID,
      },
      {
        id: 'actions',
        title: t('account-page.guide.main.actions.title'),
        description: t('account-page.guide.main.actions.description'),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_ACTIONS_TARGET_ID,
      },
    ],
  });
}
