import { SETUPS_VIEW_TYPE } from '../views/SetupsView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  SETUPS_CARD_GRID_TARGET_ID,
  SETUPS_COUNT_CONTEXT_KEY,
  SETUPS_CREATE_BUTTON_TARGET_ID,
  SETUPS_MAIN_GUIDE_ID,
  SETUPS_SETUP_AVAILABLE_ACTION_ID,
  SETUPS_VIEW_TABS_TARGET_ID,
} from './setupsGuideIds';

const HAS_SETUP_CONTEXT = {
  key: SETUPS_COUNT_CONTEXT_KEY,
  minNumber: 1,
};

const EMPTY_CONTEXT = {
  key: SETUPS_COUNT_CONTEXT_KEY,
  equals: 0,
};


export function registerSetupsMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: SETUPS_MAIN_GUIDE_ID,
    viewType: SETUPS_VIEW_TYPE,
    version: 11,
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
        id: 'setup-cards',
        title: t('setups.guide.setup-cards.title'),
        description: t('setups.guide.setup-cards.description'),
        progression: 'manual',
        targetId: SETUPS_CARD_GRID_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
      {
        id: 'open-detail',
        title: t('setups.guide.open-detail.title'),
        description: t('setups.guide.open-detail.description'),
        progression: 'manual',
        placement: 'center-target',
        targetId: SETUPS_CARD_GRID_TARGET_ID,
        requiredContext: HAS_SETUP_CONTEXT,
      },
    ],
  });
}
