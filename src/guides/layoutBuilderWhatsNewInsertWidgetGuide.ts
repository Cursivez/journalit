import { TEMPLATE_BUILDER_VIEW_TYPE } from '../views/TemplateBuilderView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import type { PersistedGuideState } from './types';
import {
  LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
  LAYOUT_BUILDER_INSERT_SLOT_TARGET_ID,
  LAYOUT_BUILDER_MAIN_GUIDE_ID,
  LAYOUT_BUILDER_MAIN_GUIDE_INSERT_WIDGET_VERSION,
  LAYOUT_BUILDER_WHATS_NEW_INSERT_SLOT_STEP_ID,
  LAYOUT_BUILDER_WHATS_NEW_INSERT_WIDGET_GUIDE_ID,
} from './layoutBuilderGuideIds';


export const isLayoutBuilderInsertWidgetWhatsNewEligible = (
  mainGuideState: PersistedGuideState | null
): boolean =>
  (mainGuideState?.status === 'completed' ||
    mainGuideState?.status === 'skipped') &&
  mainGuideState.guideVersion < LAYOUT_BUILDER_MAIN_GUIDE_INSERT_WIDGET_VERSION;


export function registerLayoutBuilderWhatsNewInsertWidgetGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: LAYOUT_BUILDER_WHATS_NEW_INSERT_WIDGET_GUIDE_ID,
    viewType: TEMPLATE_BUILDER_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 105,
    replayGuideId: LAYOUT_BUILDER_MAIN_GUIDE_ID,
    initialStepId: LAYOUT_BUILDER_WHATS_NEW_INSERT_SLOT_STEP_ID,
    steps: [
      {
        id: LAYOUT_BUILDER_WHATS_NEW_INSERT_SLOT_STEP_ID,
        title: t('layoutBuilder.guide.whats-new.insert-slot.title'),
        description: t('layoutBuilder.guide.whats-new.insert-slot.description'),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_INSERT_SLOT_TARGET_ID,
      },
      {
        id: 'add-widget-button',
        title: t('layoutBuilder.guide.whats-new.add-widget-button.title'),
        description: t(
          'layoutBuilder.guide.whats-new.add-widget-button.description'
        ),
        progression: 'manual',
        targetId: LAYOUT_BUILDER_ADD_WIDGET_BUTTON_TARGET_ID,
      },
    ],
  });
}
