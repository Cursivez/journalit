import { SETUPS_VIEW_TYPE } from '../views/SetupsView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  SETUPS_DETAIL_ACTIONS_TARGET_ID,
  SETUPS_DETAIL_CONTEXT_TARGET_ID,
  SETUPS_DETAIL_GUIDE_ID,
  SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY,
  SETUPS_DETAIL_HEADER_TARGET_ID,
  SETUPS_DETAIL_PERFORMANCE_TARGET_ID,
  SETUPS_DETAIL_PLAYBOOK_TARGET_ID,
  SETUPS_DETAIL_RULES_TARGET_ID,
  SETUPS_MAIN_GUIDE_ID,
} from './setupsGuideIds';

const HAS_EXECUTION_GAP_CONTEXT = {
  key: SETUPS_DETAIL_HAS_EXECUTION_GAP_CONTEXT_KEY,
  equals: true,
};


export function registerSetupsDetailGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: SETUPS_DETAIL_GUIDE_ID,
    viewType: SETUPS_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 110,
    initialStepId: 'detail-intro',
    replayGuideId: SETUPS_MAIN_GUIDE_ID,
    steps: [
      {
        id: 'detail-intro',
        title: t('setups.guide.detail-intro.title'),
        description: t('setups.guide.detail-intro.description'),
        progression: 'manual',
        placement: 'center',
        targetId: SETUPS_DETAIL_HEADER_TARGET_ID,
      },
      {
        id: 'detail-performance',
        title: t('setups.guide.detail-performance.title'),
        description: t('setups.guide.detail-performance.description'),
        progression: 'manual',
        placement: 'center-target',
        targetId: SETUPS_DETAIL_PERFORMANCE_TARGET_ID,
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
      },
      {
        id: 'detail-context',
        title: t('setups.guide.detail-context.title'),
        description: t('setups.guide.detail-context.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_CONTEXT_TARGET_ID,
      },
      {
        id: 'detail-playbook',
        title: t('setups.guide.detail-playbook.title'),
        description: t('setups.guide.detail-playbook.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_PLAYBOOK_TARGET_ID,
      },
      {
        id: 'detail-rules',
        title: t('setups.guide.detail-rules.title'),
        description: t('setups.guide.detail-rules.description'),
        progression: 'manual',
        targetId: SETUPS_DETAIL_RULES_TARGET_ID,
      },
    ],
  });
}
