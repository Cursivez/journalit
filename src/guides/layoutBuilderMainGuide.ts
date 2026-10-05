import { TEMPLATE_BUILDER_VIEW_TYPE } from '../views/TemplateBuilderView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_SET_ACTION_ID,
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_STAR_TARGET_ID,
  LAYOUT_BUILDER_DRC_SECTION_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
  LAYOUT_BUILDER_MAIN_GUIDE_ID,
  LAYOUT_BUILDER_OWN_LAYOUT_CREATED_ACTION_ID,
  LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_SELECTED_TEMPLATE_IS_DEFAULT_CONTEXT_KEY,
  LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_PICKER_TARGET_ID,
  LAYOUT_BUILDER_WIDGET_SELECTED_ACTION_ID,
} from './layoutBuilderGuideIds';


export function registerLayoutBuilderMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: LAYOUT_BUILDER_MAIN_GUIDE_ID,
    viewType: TEMPLATE_BUILDER_VIEW_TYPE,
    version: 9,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('layoutBuilder.guide.intro.title'),
        description: t('layoutBuilder.guide.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'create-own-layout',
        title: t('layoutBuilder.guide.create-own-layout.title'),
        description: t('layoutBuilder.guide.create-own-layout.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_DRC_SECTION_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_OWN_LAYOUT_CREATED_ACTION_ID,
        placement: 'right',
      },
      {
        id: 'editor-overview',
        title: t('layoutBuilder.guide.editor-overview.title'),
        description: t('layoutBuilder.guide.editor-overview.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
        placement: 'right-top',
      },
      {
        id: 'add-widget',
        title: t('layoutBuilder.guide.add-widget.title'),
        description: t('layoutBuilder.guide.add-widget.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID,
      },
      {
        id: 'choose-widget',
        title: t('layoutBuilder.guide.choose-widget.title'),
        description: t('layoutBuilder.guide.choose-widget.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_WIDGET_PICKER_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_WIDGET_SELECTED_ACTION_ID,
        placement: 'right',
        skipIfTargetMissing: false,
      },
      {
        id: 'save-template',
        title: t('layoutBuilder.guide.save-template.title'),
        description: t('layoutBuilder.guide.save-template.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID,
      },
      {
        id: 'set-default-template',
        title: t('layoutBuilder.guide.set-default-template.title'),
        description: t('layoutBuilder.guide.set-default-template.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_DEFAULT_TEMPLATE_STAR_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_DEFAULT_TEMPLATE_SET_ACTION_ID,
        placement: 'right',
        requiredContext: {
          key: LAYOUT_BUILDER_SELECTED_TEMPLATE_IS_DEFAULT_CONTEXT_KEY,
          equals: false,
        },
      },
    ],
  });
}
