import { SETUPS_VIEW_TYPE } from '../views/SetupsView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  SETUPS_BACK_BUTTON_TARGET_ID,
  SETUPS_CARD_GRID_TARGET_ID,
  SETUPS_CHART_TARGET_ID,
  SETUPS_COMPARE_BODY_TARGET_ID,
  SETUPS_COMPARE_HEADER_TARGET_ID,
  SETUPS_COMPARE_OPENED_ACTION_ID,
  SETUPS_COMPARE_SELECTING_ACTION_ID,
  SETUPS_COMPARE_TAB_TARGET_ID,
  SETUPS_CREATE_BUTTON_TARGET_ID,
  SETUPS_DETAIL_ACTIONS_TARGET_ID,
  SETUPS_DETAIL_CONTEXT_TARGET_ID,
  SETUPS_DETAIL_HEADER_TARGET_ID,
  SETUPS_DETAIL_OPENED_ACTION_ID,
  SETUPS_DETAIL_PERFORMANCE_TARGET_ID,
  SETUPS_DETAIL_PLAYBOOK_TARGET_ID,
  SETUPS_DETAIL_RULES_TARGET_ID,
  SETUPS_MAIN_GUIDE_ID,
  SETUPS_OVERVIEW_OPENED_ACTION_ID,
  SETUPS_PAIRS_OPENED_ACTION_ID,
  SETUPS_PAIRS_TAB_TARGET_ID,
  SETUPS_SETUP_AVAILABLE_ACTION_ID,
  SETUPS_VIEW_TABS_TARGET_ID,
} from './setupsGuideIds';

const SETUPS_COUNT_CONTEXT_KEY = 'setups.count';

const HAS_SETUP_CONTEXT = {
  key: SETUPS_COUNT_CONTEXT_KEY,
  minNumber: 1,
};

const HAS_COMPARE_CONTEXT = {
  key: SETUPS_COUNT_CONTEXT_KEY,
  minNumber: 2,
};

const EMPTY_CONTEXT = {
  key: SETUPS_COUNT_CONTEXT_KEY,
  equals: 0,
};

const SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY =
  'setups.detail.hasExecutionGap';

const HAS_EXECUTION_GAP_CONTEXT = {
  key: SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY,
  equals: true,
};

export {
  SETUPS_COUNT_CONTEXT_KEY,
  SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY,
};

export function registerSetupsMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: SETUPS_MAIN_GUIDE_ID,
    viewType: SETUPS_VIEW_TYPE,
    version: 8,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('setups.guide.intro.title'),
        description: t('setups.guide.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'create-new-setup',
        title: t('setups.guide.create-new-setup.title'),
        description: t('setups.guide.create-new-setup.description'),
        progression: 'manual',
        targetId: SETUPS_CREATE_BUTTON_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'create-setup',
        title: t('setups.guide.empty.create-setup.title'),
        description: t('setups.guide.empty.create-setup.description'),
        progression: 'action-required',
        targetId: SETUPS_CREATE_BUTTON_TARGET_ID,
        requiredActionId: SETUPS_SETUP_AVAILABLE_ACTION_ID,
        requiredContext: EMPTY_CONTEXT,
      },
      {
        id: 'view-tabs',
        title: t('setups.guide.view-tabs.title'),
        description: t('setups.guide.view-tabs.description'),
        progression: 'manual',
        targetId: SETUPS_VIEW_TABS_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'overview-chart',
        title: t('setups.guide.overview-chart.title'),
        description: t('setups.guide.overview-chart.description'),
        progression: 'manual',
        targetId: SETUPS_CHART_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'setup-cards',
        title: t('setups.guide.setup-cards.title'),
        description: t('setups.guide.setup-cards.description'),
        progression: 'manual',
        targetId: SETUPS_CARD_GRID_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'pairs-mode',
        title: t('setups.guide.pairs-mode.title'),
        description: t('setups.guide.pairs-mode.description'),
        progression: 'action-required',
        targetId: SETUPS_PAIRS_TAB_TARGET_ID,
        requiredActionId: SETUPS_PAIRS_OPENED_ACTION_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'pairs-chart',
        title: t('setups.guide.pairs-chart.title'),
        description: t('setups.guide.pairs-chart.description'),
        progression: 'manual',
        targetId: SETUPS_CHART_TARGET_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'compare-mode',
        title: t('setups.guide.compare-mode.title'),
        description: t('setups.guide.compare-mode.description'),
        progression: 'action-required',
        targetId: SETUPS_COMPARE_TAB_TARGET_ID,
        requiredActionId: SETUPS_COMPARE_SELECTING_ACTION_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'compare-select',
        title: t('setups.guide.compare-select.title'),
        description: t('setups.guide.compare-select.description'),
        progression: 'action-required',
        placement: 'center-target',
        targetId: SETUPS_CARD_GRID_TARGET_ID,
        requiredActionId: SETUPS_COMPARE_OPENED_ACTION_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'compare-summary',
        title: t('setups.guide.compare-summary.title'),
        description: t('setups.guide.compare-summary.description'),
        progression: 'manual',
        placement: 'center',
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'compare-body',
        title: t('setups.guide.compare-body.title'),
        description: t('setups.guide.compare-body.description'),
        progression: 'manual',
        targetId: SETUPS_COMPARE_HEADER_TARGET_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'compare-details',
        title: t('setups.guide.compare-details.title'),
        description: t('setups.guide.compare-details.description'),
        progression: 'manual',
        targetId: SETUPS_COMPARE_BODY_TARGET_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'back-to-overview',
        title: t('setups.guide.back-to-overview.title'),
        description: t('setups.guide.back-to-overview.description'),
        progression: 'action-required',
        targetId: SETUPS_BACK_BUTTON_TARGET_ID,
        requiredActionId: SETUPS_OVERVIEW_OPENED_ACTION_ID,
        requiredContext: HAS_COMPARE_CONTEXT,
      },
      {
        id: 'open-detail',
        title: t('setups.guide.open-detail.title'),
        description: t('setups.guide.open-detail.description'),
        progression: 'action-required',
        placement: 'center-target',
        targetId: SETUPS_CARD_GRID_TARGET_ID,
        requiredActionId: SETUPS_DETAIL_OPENED_ACTION_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-intro',
        title: t('setups.guide.detail-intro.title'),
        description: t('setups.guide.detail-intro.description'),
        progression: 'manual',
        placement: 'center',
        targetId: SETUPS_DETAIL_HEADER_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-performance',
        title: t('setups.guide.detail-performance.title'),
        description: t('setups.guide.detail-performance.description'),
        progression: 'manual',
        placement: 'center-target',
        targetId: SETUPS_DETAIL_PERFORMANCE_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-execution-gap',
        title: t('setups.guide.detail-execution-gap.title'),
        description: t('setups.guide.detail-execution-gap.description'),
        progression: 'manual',
        placement: 'center-target',
        targetId: SETUPS_DETAIL_PERFORMANCE_TARGET_ID,
        requiredContext: HAS_EXECUTION_GAP_CONTEXT,
      },
      {
        id: 'detail-actions',
        title: t('setups.guide.detail-actions.title'),
        description: t('setups.guide.detail-actions.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_ACTIONS_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-context',
        title: t('setups.guide.detail-context.title'),
        description: t('setups.guide.detail-context.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_CONTEXT_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-playbook',
        title: t('setups.guide.detail-playbook.title'),
        description: t('setups.guide.detail-playbook.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_PLAYBOOK_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'detail-rules',
        title: t('setups.guide.detail-rules.title'),
        description: t('setups.guide.detail-rules.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_RULES_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'finish',
        title: t('setups.guide.finish.title'),
        description: t('setups.guide.finish.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
