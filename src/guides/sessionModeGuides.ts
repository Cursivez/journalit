import { SESSION_MODE_VIEW_TYPE } from '../views/SessionModeView';
import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  SESSION_MODE_CHECKLIST_TARGET_ID,
  SESSION_MODE_CONFIGURE_BUTTON_TARGET_ID,
  SESSION_MODE_EDIT_BUTTON_TARGET_ID,
  SESSION_MODE_EMPTY_GUIDE_ID,
  SESSION_MODE_ENDED_ACTIONS_TARGET_ID,
  SESSION_MODE_ENDED_GUIDE_ID,
  SESSION_MODE_HEADER_TARGET_ID,
  SESSION_MODE_LIVE_GUIDE_ID,
  SESSION_MODE_PREPARATION_GUIDE_ID,
  SESSION_MODE_GOALS_TARGET_ID,
  SESSION_MODE_SESSION_LOG_TARGET_ID,
  SESSION_MODE_SETTINGS_OPENED_ACTION_ID,
  SESSION_MODE_TRADE_GATE_TARGET_ID,
} from './sessionModeGuideIds';


export function registerSessionModeGuides(guideRegistry: GuideRegistry): void {
  guideRegistry.registerGuide({
    id: SESSION_MODE_EMPTY_GUIDE_ID,
    viewType: SESSION_MODE_VIEW_TYPE,
    version: 2,
    autoShow: true,
    priority: 100,
    initialStepId: 'why',
    steps: [
      {
        id: 'why',
        title: t('session-mode.guide.why.title'),
        description: t('session-mode.guide.why.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'configure',
        title: t('session-mode.guide.configure.title'),
        description: t('session-mode.guide.configure.description'),
        progression: 'action-required',
        targetId: SESSION_MODE_CONFIGURE_BUTTON_TARGET_ID,
        requiredActionId: SESSION_MODE_SETTINGS_OPENED_ACTION_ID,
      },
    ],
  });

  guideRegistry.registerGuide({
    id: SESSION_MODE_PREPARATION_GUIDE_ID,
    viewType: SESSION_MODE_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'countdown',
    steps: [
      {
        id: 'countdown',
        title: t('session-mode.guide.preparation.countdown.title'),
        description: t('session-mode.guide.preparation.countdown.description'),
        progression: 'manual',
        targetId: SESSION_MODE_HEADER_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'goals',
        title: t('session-mode.guide.preparation.goals.title'),
        description: t('session-mode.guide.preparation.goals.description'),
        progression: 'manual',
        targetId: SESSION_MODE_GOALS_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: true,
      },
      {
        id: 'checklist',
        title: t('session-mode.guide.preparation.checklist.title'),
        description: t('session-mode.guide.preparation.checklist.description'),
        progression: 'manual',
        targetId: SESSION_MODE_CHECKLIST_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: true,
      },
      {
        id: 'next',
        title: t('session-mode.guide.preparation.next.title'),
        description: t('session-mode.guide.preparation.next.description'),
        progression: 'manual',
        placement: 'center',
      },
    ],
  });

  guideRegistry.registerGuide({
    id: SESSION_MODE_LIVE_GUIDE_ID,
    viewType: SESSION_MODE_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'trade-gate',
    steps: [
      {
        id: 'trade-gate',
        title: t('session-mode.guide.live.trade-gate.title'),
        description: t('session-mode.guide.live.trade-gate.description'),
        progression: 'manual',
        targetId: SESSION_MODE_TRADE_GATE_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: true,
      },
      {
        id: 'session-log',
        title: t('session-mode.guide.live.session-log.title'),
        description: t('session-mode.guide.live.session-log.description'),
        progression: 'manual',
        targetId: SESSION_MODE_SESSION_LOG_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: true,
      },
      {
        id: 'settings',
        title: t('session-mode.guide.live.settings.title'),
        description: t('session-mode.guide.live.settings.description'),
        progression: 'manual',
        targetId: SESSION_MODE_EDIT_BUTTON_TARGET_ID,
        skipIfTargetMissing: true,
      },
    ],
  });

  guideRegistry.registerGuide({
    id: SESSION_MODE_ENDED_GUIDE_ID,
    viewType: SESSION_MODE_VIEW_TYPE,
    version: 1,
    autoShow: true,
    priority: 100,
    initialStepId: 'review',
    steps: [
      {
        id: 'review',
        title: t('session-mode.guide.ended.review.title'),
        description: t('session-mode.guide.ended.review.description'),
        progression: 'manual',
        targetId: SESSION_MODE_ENDED_ACTIONS_TARGET_ID,
        placement: 'right',
        skipIfTargetMissing: true,
      },
    ],
  });
}
