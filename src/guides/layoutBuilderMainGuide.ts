import { TEMPLATE_BUILDER_VIEW_TYPE } from '../views/TemplateBuilderView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  LAYOUT_BUILDER_DRC_BUILTIN_TEMPLATE_TARGET_ID,
  LAYOUT_BUILDER_EDITOR_MODE_OPENED_ACTION_ID,
  LAYOUT_BUILDER_TEMPLATE_SELECTED_ACTION_ID,
  LAYOUT_BUILDER_EDITOR_MODE_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_MAIN_GUIDE_ID,
  LAYOUT_BUILDER_PREVIEW_TARGET_ID,
  LAYOUT_BUILDER_SIDEBAR_TARGET_ID,
} from './layoutBuilderGuideIds';


export function registerLayoutBuilderMainGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: LAYOUT_BUILDER_MAIN_GUIDE_ID,
    viewType: TEMPLATE_BUILDER_VIEW_TYPE,
    version: 6,
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
        id: 'sidebar-overview',
        title: t('layoutBuilder.guide.sidebar-overview.title'),
        description: t('layoutBuilder.guide.sidebar-overview.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_SIDEBAR_TARGET_ID,
        placement: 'right',
      },
      {
        id: 'pick-built-in-template',
        title: t('layoutBuilder.guide.pick-built-in.title'),
        description: t('layoutBuilder.guide.pick-built-in.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_DRC_BUILTIN_TEMPLATE_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_TEMPLATE_SELECTED_ACTION_ID,
        placement: 'right',
      },
      {
        id: 'preview-template',
        title: t('layoutBuilder.guide.preview-template.title'),
        description: t('layoutBuilder.guide.preview-template.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_PREVIEW_TARGET_ID,
        placement: 'right-top',
      },
      {
        id: 'switch-to-editor',
        title: t('layoutBuilder.guide.switch-to-editor.title'),
        description: t('layoutBuilder.guide.switch-to-editor.description'),
        progression: 'action-required',
        targetId: LAYOUT_BUILDER_EDITOR_MODE_BUTTON_TARGET_ID,
        requiredActionId: LAYOUT_BUILDER_EDITOR_MODE_OPENED_ACTION_ID,
      },
    ],
  });
}
