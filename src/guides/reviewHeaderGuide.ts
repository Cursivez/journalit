import { t } from '../lang/helpers';
import { GuideRegistry } from './GuideRegistry';
import {
  REVIEW_HEADER_GUIDE_ID,
  REVIEW_HEADER_INTRO_TARGET_ID,
  REVIEW_HEADER_REVIEWED_TARGET_ID,
  REVIEW_HEADER_DATES_TARGET_ID,
  REVIEW_HEADER_CONTROLS_TARGET_ID,
} from './reviewHeaderGuideIds';

export function registerReviewHeaderGuide(registry: GuideRegistry): void {
  registry.registerGuide({
    id: REVIEW_HEADER_GUIDE_ID,
    viewType: 'markdown',
    version: 1,
    autoShow: true,
    resolvedByView: true,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('review.header.guide.intro.title'),
        description: t('review.header.guide.intro.description'),
        progression: 'manual',
        targetId: REVIEW_HEADER_INTRO_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'reviewed',
        title: t('review.header.guide.reviewed.title'),
        description: t('review.header.guide.reviewed.description'),
        progression: 'manual',
        targetId: REVIEW_HEADER_REVIEWED_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'dates',
        title: t('review.header.guide.dates.title'),
        description: t('review.header.guide.dates.description'),
        progression: 'manual',
        targetId: REVIEW_HEADER_DATES_TARGET_ID,
        skipIfTargetMissing: false,
      },
      {
        id: 'controls',
        title: t('review.header.guide.controls.title'),
        description: t('review.header.guide.controls.description'),
        progression: 'manual',
        targetId: REVIEW_HEADER_CONTROLS_TARGET_ID,
        skipIfTargetMissing: false,
      },
    ],
  });
}
