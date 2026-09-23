import { SETUPS_VIEW_TYPE } from '../views/SetupsView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  SETUPS_COMPARE_BODY_TARGET_ID,
  SETUPS_COMPARE_GUIDE_ID,
  SETUPS_COMPARE_HEADER_TARGET_ID,
  SETUPS_MAIN_GUIDE_ID,
} from './setupsGuideIds';


export function registerSetupsCompareGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: SETUPS_COMPARE_GUIDE_ID,
    viewType: SETUPS_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 120,
    initialStepId: 'compare-summary',
    replayGuideId: SETUPS_MAIN_GUIDE_ID,
    steps: [
      {
        id: 'compare-summary',
        title: t('setups.guide.compare-summary.title'),
        description: t('setups.guide.compare-summary.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'compare-body',
        title: t('setups.guide.compare-body.title'),
        description: t('setups.guide.compare-body.description'),
        progression: 'manual',
        targetId: SETUPS_COMPARE_HEADER_TARGET_ID,
      },
      {
        id: 'compare-details',
        title: t('setups.guide.compare-details.title'),
        description: t('setups.guide.compare-details.description'),
        progression: 'manual',
        targetId: SETUPS_COMPARE_BODY_TARGET_ID,
      },
    ],
  });
}
