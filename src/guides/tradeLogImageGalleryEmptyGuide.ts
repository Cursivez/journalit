import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  TRADE_LOG_IMAGE_GALLERY_EMPTY_STATE_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_ID,
} from './tradeLogGuideIds';

const TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_VERSION = 2;

export function registerTradeLogImageGalleryEmptyGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_ID,
    viewType: 'journalit-trade-log-view',
    version: TRADE_LOG_IMAGE_GALLERY_EMPTY_GUIDE_VERSION,
    autoShow: true,
    initialStepId: 'empty-intro',
    priority: 101,
    steps: [
      {
        id: 'empty-intro',
        title: t('tradelog.guide.image-gallery-empty.intro.title'),
        description: t('tradelog.guide.image-gallery-empty.intro.description'),
        progression: 'manual',
        placement: 'center',
        targetId: TRADE_LOG_IMAGE_GALLERY_EMPTY_STATE_TARGET_ID,
      },
    ],
  });
}
