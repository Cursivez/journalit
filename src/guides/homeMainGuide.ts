import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  HOME_EDIT_BUTTON_TARGET_ID,
  HOME_FILTERS_TARGET_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_MAIN_GUIDE_VERSION,
  HOME_MODE_TOGGLE_DASHBOARD_OPTION_TARGET_ID,
  HOME_QUICK_LINKS_TARGET_ID,
} from './homeGuideIds';


export function registerHomeMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: HOME_MAIN_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: HOME_MAIN_GUIDE_VERSION,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('home.guide.intro.title'),
        description: t('home.guide.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'quick-links',
        title: t('home.guide.quick-links.title'),
        description: t('home.guide.quick-links.description'),
        progression: 'manual',
        targetId: HOME_QUICK_LINKS_TARGET_ID,
      },
      {
        id: 'filters',
        title: t('home.guide.filters.title'),
        description: t('home.guide.filters.description'),
        progression: 'manual',
        targetId: HOME_FILTERS_TARGET_ID,
      },
      {
        id: 'customize',
        title: t('home.guide.customize.title'),
        description: t('home.guide.customize.description'),
        progression: 'manual',
        targetId: HOME_EDIT_BUTTON_TARGET_ID,
      },
      
      {
        id: 'modes',
        title: t('home.guide.modes.title'),
        description: t('home.guide.modes.description'),
        progression: 'manual',
        targetId: HOME_MODE_TOGGLE_DASHBOARD_OPTION_TARGET_ID,
      },
    ],
  });
}
