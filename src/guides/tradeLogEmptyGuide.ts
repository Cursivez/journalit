import { TRADE_LOG_VIEW_TYPE } from '../views/TradeLogView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  TRADE_LOG_EMPTY_GUIDE_ID,
  TRADE_LOG_EMPTY_STATE_TARGET_ID,
} from './tradeLogGuideIds';

export function registerTradeLogEmptyGuide(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: TRADE_LOG_EMPTY_GUIDE_ID,
    viewType: TRADE_LOG_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('tradelog.guide.empty.intro.title'),
        description: t('tradelog.guide.empty.intro.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'empty-state',
        title: t('tradelog.guide.empty.state.title'),
        description: t('tradelog.guide.empty.state.description'),
        progression: 'manual',
        targetId: TRADE_LOG_EMPTY_STATE_TARGET_ID,
      },
    ],
  });
}
