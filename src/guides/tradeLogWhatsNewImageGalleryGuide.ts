import { TRADE_LOG_VIEW_TYPE } from '../views/TradeLogView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_ANNOTATION_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_ANNOTATION_PANEL_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_FILTER_SECTION_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_ACTIONS_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_OPENED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_GRID_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_SELECTED_ACTION_ID,
  TRADE_LOG_IMAGE_GALLERY_SIZE_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_SOURCE_SORT_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_TAG_BUTTON_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
} from './tradeLogGuideIds';

export function registerTradeLogWhatsNewImageGalleryGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: TRADE_LOG_IMAGE_GALLERY_MAIN_GUIDE_ID,
    viewType: TRADE_LOG_VIEW_TYPE,
    version: 2,
    autoShow: true,
    priority: 105,
    initialStepId: 'switch-to-gallery',
    steps: [
      {
        id: 'switch-to-gallery',
        title: t('tradelog.guide.switch-to-gallery.title'),
        description: t('tradelog.guide.switch-to-gallery.description'),
        progression: 'action-required',
        targetId: TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID,
        requiredActionId: TRADE_LOG_IMAGE_GALLERY_SELECTED_ACTION_ID,
      },
      {
        id: 'gallery-source-sort',
        title: t('tradelog.guide.gallery-source-sort.title'),
        description: t('tradelog.guide.gallery-source-sort.description'),
        progression: 'manual',
        placement: 'left',
        targetId: TRADE_LOG_IMAGE_GALLERY_SOURCE_SORT_TARGET_ID,
      },
      {
        id: 'gallery-size',
        title: t('tradelog.guide.gallery-size.title'),
        description: t('tradelog.guide.gallery-size.description'),
        progression: 'manual',
        targetId: TRADE_LOG_IMAGE_GALLERY_SIZE_TARGET_ID,
      },
      {
        id: 'gallery-filters',
        title: t('tradelog.guide.gallery-filters.title'),
        description: t('tradelog.guide.gallery-filters.description'),
        progression: 'manual',
        targetId: TRADE_LOG_FILTER_BUTTON_TARGET_ID,
        requiredActionId: TRADE_LOG_FILTER_MODAL_OPENED_ACTION_ID,
      },
      {
        id: 'gallery-filter-modal',
        title: t('tradelog.guide.gallery-filter-modal.title'),
        description: t('tradelog.guide.gallery-filter-modal.description'),
        progression: 'manual',
        placement: 'right',
        targetId: TRADE_LOG_IMAGE_GALLERY_FILTER_SECTION_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'gallery-grid',
        title: t('tradelog.guide.gallery-grid.title'),
        description: t('tradelog.guide.gallery-grid.description'),
        progression: 'action-required',
        targetId: TRADE_LOG_IMAGE_GALLERY_GRID_TARGET_ID,
        requiredActionId: TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_OPENED_ACTION_ID,
      },
      {
        id: 'gallery-fullscreen-actions',
        title: t('tradelog.guide.gallery-fullscreen-actions.title'),
        description: t('tradelog.guide.gallery-fullscreen-actions.description'),
        progression: 'manual',
        targetId: TRADE_LOG_IMAGE_GALLERY_FULLSCREEN_ACTIONS_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'gallery-open-annotation',
        title: t('tradelog.guide.gallery-open-annotation.title'),
        description: t('tradelog.guide.gallery-open-annotation.description'),
        progression: 'action-required',
        targetId: TRADE_LOG_IMAGE_GALLERY_TAG_BUTTON_TARGET_ID,
        requiredActionId: TRADE_LOG_IMAGE_GALLERY_ANNOTATION_OPENED_ACTION_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'gallery-annotation-panel',
        title: t('tradelog.guide.gallery-annotation-panel.title'),
        description: t('tradelog.guide.gallery-annotation-panel.description'),
        progression: 'manual',
        targetId: TRADE_LOG_IMAGE_GALLERY_ANNOTATION_PANEL_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'gallery-finish',
        title: t('tradelog.guide.gallery-finish.title'),
        description: t('tradelog.guide.gallery-finish.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
