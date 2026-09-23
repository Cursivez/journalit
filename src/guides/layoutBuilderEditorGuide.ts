import { TEMPLATE_BUILDER_VIEW_TYPE } from '../views/TemplateBuilderView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_SET_ACTION_ID,
  LAYOUT_BUILDER_DEFAULT_TEMPLATE_STAR_TARGET_ID,
  LAYOUT_BUILDER_BUILTIN_DUPLICATE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_GUIDE_ID,
  LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
  LAYOUT_BUILDER_EMPTY_WIDGET_PICKER_TRIGGER_TARGET_ID,
  LAYOUT_BUILDER_MAIN_GUIDE_ID,
  LAYOUT_BUILDER_SAVE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_SELECTED_TEMPLATE_IS_BUILT_IN_CONTEXT_KEY,
  LAYOUT_BUILDER_SELECTED_TEMPLATE_IS_DEFAULT_CONTEXT_KEY,
  LAYOUT_BUILDER_TEMPLATE_DUPLICATED_ACTION_ID,
  LAYOUT_BUILDER_TEMPLATE_SAVED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_ADDED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_LIBRARY_DOCS_TARGET_ID,
  LAYOUT_BUILDER_WIDGET_PICKER_OPENED_ACTION_ID,
  LAYOUT_BUILDER_WIDGET_PICKER_TARGET_ID,
  LAYOUT_BUILDER_WIDGET_SELECTED_ACTION_ID,
} from './layoutBuilderGuideIds';


export function registerLayoutBuilderEditorGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: LAYOUT_BUILDER_EDITOR_GUIDE_ID,
    viewType: TEMPLATE_BUILDER_VIEW_TYPE,
    version: 3,
    autoShow: true,
    priority: 110,
    initialStepId: 'editor-overview',
    replayGuideId: LAYOUT_BUILDER_MAIN_GUIDE_ID,
    steps: [
      {
        id: 'editor-overview',
        title: t('layoutBuilder.guide.editor-overview.title'),
        description: t('layoutBuilder.guide.editor-overview.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_EDITOR_PANEL_TARGET_ID,
        placement: 'right-top',
      },
      {
        id: 'duplicate-template',
        title: t('layoutBuilder.guide.duplicate.title'),
        description: t('layoutBuilder.guide.duplicate.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_BUILTIN_DUPLICATE_BUTTON_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_TEMPLATE_DUPLICATED_ACTION_ID,
        placement: 'right',
        requiredContext: {
          key: LAYOUT_BUILDER_SELECTED_TEMPLATE_IS_BUILT_IN_CONTEXT_KEY,
          equals: true,
        },
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
        id: 'open-widget-picker',
        title: t('layoutBuilder.guide.open-widget-picker.title'),
        description: t('layoutBuilder.guide.open-widget-picker.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_EMPTY_WIDGET_PICKER_TRIGGER_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_WIDGET_PICKER_OPENED_ACTION_ID,
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
        id: 'widget-library-docs',
        title: t('layoutBuilder.guide.widget-library-docs.title'),
        description: t('layoutBuilder.guide.widget-library-docs.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_WIDGET_LIBRARY_DOCS_TARGET_ID,
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
