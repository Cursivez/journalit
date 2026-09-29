import { HOME_VIEW_TYPE } from '../views/HomeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  HOME_ADD_WIDGET_BUTTON_TARGET_ID,
  HOME_CUSTOMIZE_GUIDE_ID,
  HOME_EDIT_BUTTON_TARGET_ID,
  HOME_EDIT_MODE_DISABLED_ACTION_ID,
  HOME_GRID_TARGET_ID,
  HOME_MAIN_GUIDE_ID,
  HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
  HOME_WIDGET_SELECTOR_OPENED_ACTION_ID,
  HOME_WIDGET_SELECTOR_TARGET_ID,
} from './homeGuideIds';


export function registerHomeCustomizeGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: HOME_CUSTOMIZE_GUIDE_ID,
    viewType: HOME_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 120,
    initialStepId: 'quick-links-position',
    replayGuideId: HOME_MAIN_GUIDE_ID,
    steps: [
      {
        id: 'quick-links-position',
        title: t('home.guide.quick-links-position.title'),
        description: t('home.guide.quick-links-position.description'),
        progression: 'manual',
        targetId: HOME_QUICK_LINKS_POSITION_BUTTON_TARGET_ID,
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
        
        placement: 'left',
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
    ],
  });
}
