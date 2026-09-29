import { TRADE_LOG_VIEW_TYPE } from '../views/TradeLogView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  TRADE_LOG_FILTER_BUTTON_TARGET_ID,
  TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID,
  TRADE_LOG_MAIN_GUIDE_ID,
  TRADE_LOG_MAIN_GUIDE_VERSION,
  TRADE_LOG_TABLE_HEADERS_TARGET_ID,
  TRADE_LOG_VIEW_SELECTOR_TARGET_ID,
} from './tradeLogGuideIds';


export function registerTradeLogMainGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: TRADE_LOG_MAIN_GUIDE_ID,
    viewType: TRADE_LOG_VIEW_TYPE,
    version: TRADE_LOG_MAIN_GUIDE_VERSION,
    autoShow: true,
    priority: 110,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('tradelog.guide.intro.title'),
        description: t('tradelog.guide.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'view-selector',
        title: t('tradelog.guide.view-selector.title'),
        description: t('tradelog.guide.view-selector.description'),
        progression: 'manual',
        targetId: TRADE_LOG_VIEW_SELECTOR_TARGET_ID,
      },
      {
        id: 'filters',
        title: t('tradelog.guide.filters.title'),
        description: t('tradelog.guide.filters.description'),
        progression: 'manual',
        targetId: TRADE_LOG_FILTER_BUTTON_TARGET_ID,
      },
      {
        id: 'sorting',
        title: t('tradelog.guide.sorting.title'),
        description: t('tradelog.guide.sorting.description'),
        progression: 'manual',
        targetId: TRADE_LOG_TABLE_HEADERS_TARGET_ID,
      },
      {
        id: 'gallery-mode',
        title: t('tradelog.guide.gallery-mode.title'),
        description: t('tradelog.guide.gallery-mode.description'),
        progression: 'manual',
        targetId: TRADE_LOG_IMAGE_GALLERY_MODE_BUTTON_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'open-trades',
        title: t('tradelog.guide.open-trades.title'),
        description: t('tradelog.guide.open-trades.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });
}
