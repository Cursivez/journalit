import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  HOME_ADD_WIDGET_BUTTON_TARGET_ID,
  HOME_EDIT_BUTTON_TARGET_ID,
  HOME_EDIT_MODE_DISABLED_ACTION_ID,
  HOME_EDIT_MODE_ENABLED_ACTION_ID,
  HOME_FILTERS_TARGET_ID,
  HOME_GRID_TARGET_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
  HOME_QUICK_LINKS_TARGET_ID,
  HOME_WIDGET_SELECTOR_OPENED_ACTION_ID,
  HOME_WIDGET_SELECTOR_TARGET_ID,
} from './homeGuideIds';

export function registerHomeMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: HOME_MAIN_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: 3,
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
        progression: 'action-required',
        targetId: HOME_EDIT_BUTTON_TARGET_ID,
        requiredActionId: HOME_EDIT_MODE_ENABLED_ACTION_ID,
      },
      {
        id: 'quick-links-position',
        title: t('home.guide.quick-links-position.title'),
        description: t('home.guide.quick-links-position.description'),
        progression: 'manual',
        targetId: HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
      },
      {
        id: 'quick-links',
        title: t('home.guide.quick-links.title'),
        description: t('home.guide.quick-links.description'),
        progression: 'manual',
        targetId: HOME_QUICK_LINKS_TARGET_ID,
      },
      {
        id: 'add-widget',
        title: t('home.guide.add-widget.title'),
        description: t('home.guide.add-widget.description'),
        progression: 'action-required',
        targetId: HOME_ADD_WIDGET_BUTTON_TARGET_ID,
        requiredActionId: HOME_WIDGET_SELECTOR_OPENED_ACTION_ID,
      },
      {
        id: 'widget-picker',
        title: t('home.guide.widget-picker.title'),
        description: t('home.guide.widget-picker.description'),
        progression: 'manual',
        targetId: HOME_WIDGET_SELECTOR_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: false,
      },
      {
        id: 'move-and-resize',
        title: t('home.guide.move-and-resize.title'),
        description: t('home.guide.move-and-resize.description'),
        progression: 'manual',
        targetId: HOME_GRID_TARGET_ID,
      },
      {
        id: 'save-layout',
        title: t('home.guide.save-layout.title'),
        description: t('home.guide.save-layout.description'),
        progression: 'action-required',
        targetId: HOME_EDIT_BUTTON_TARGET_ID,
        requiredActionId: HOME_EDIT_MODE_DISABLED_ACTION_ID,
      },
      {
        id: 'widget-interactions',
        title: t('home.guide.widget-interactions.title'),
        description: t('home.guide.widget-interactions.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
