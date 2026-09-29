

import type { ModalGuideIdentity } from './modalGuide/modalGuidePersistence';
import type { ModalGuideStep } from './modalGuide/ModalGuide';

export const LEGACY_CHALLENGE_SETUP_GUIDE_IDENTITY: ModalGuideIdentity = {
  guideId: 'account.legacy-challenge-setup',
  version: 1,
  dataKey: 'legacyChallengeSetupGuide',
};

const target = (id: string) => `[data-journalit-guide-target="${id}"]`;

export const LEGACY_CHALLENGE_SETUP_GUIDE_STEPS: ModalGuideStep[] = [
  {
    id: 'list',
    titleKey: 'guide.legacy-setup.list.title',
    descriptionKey: 'guide.legacy-setup.list.description',
    targetSelector: target('legacy-challenge.list'),
    placement: 'right',
  },
  {
    id: 'assign',
    titleKey: 'guide.legacy-setup.assign.title',
    descriptionKey: 'guide.legacy-setup.assign.description',
    targetSelector: target('legacy-challenge.assign'),
    placement: 'right',
    
    skipIfMissing: true,
  },
  {
    id: 'continue',
    titleKey: 'guide.legacy-setup.continue.title',
    descriptionKey: 'guide.legacy-setup.continue.description',
    targetSelector: target('legacy-challenge.continue'),
    placement: 'right',
  },
];


const CHALLENGE_PAGE_TARGET_STEP: ModalGuideStep = {
  id: 'target',
  titleKey: 'guide.merge-wizard.target.title',
  descriptionKey: 'guide.merge-wizard.target.description',
  targetSelector: target('account-merge.target'),
  placement: 'right',
  
  skipIfMissing: true,
};

const CHALLENGE_PAGE_IDENTITY_STEP: ModalGuideStep = {
  id: 'identity',
  titleKey: 'guide.merge-wizard.identity.title',
  descriptionKey: 'guide.merge-wizard.identity.description',
  targetSelector: target('account-merge.identity'),
  placement: 'right',
};

export const ACCOUNT_MERGE_CHALLENGE_PAGE_GUIDE: {
  identity: ModalGuideIdentity;
  steps: ModalGuideStep[];
  
  freeSteps: ModalGuideStep[];
} = {
  identity: {
    guideId: 'account.merge-wizard.challenge',
    version: 1,
    dataKey: 'accountMergeWizardChallengeGuide',
  },
  steps: [CHALLENGE_PAGE_TARGET_STEP, CHALLENGE_PAGE_IDENTITY_STEP],
  freeSteps: [
    CHALLENGE_PAGE_TARGET_STEP,
    {
      ...CHALLENGE_PAGE_IDENTITY_STEP,
      titleKey: 'guide.merge-wizard.identity.free-title',
      descriptionKey: 'guide.merge-wizard.identity.free-description',
    },
  ],
};

export const ACCOUNT_MERGE_PHASES_PAGE_GUIDE: {
  identity: ModalGuideIdentity;
  steps: ModalGuideStep[];
} = {
  identity: {
    guideId: 'account.merge-wizard.phases',
    version: 1,
    dataKey: 'accountMergeWizardPhasesGuide',
  },
  steps: [
    {
      id: 'phases',
      titleKey: 'guide.merge-wizard.phases.title',
      descriptionKey: 'guide.merge-wizard.phases.description',
      targetSelector: target('account-merge.phases'),
      placement: 'auto',
    },
  ],
};

export const ACCOUNT_MERGE_REVIEW_PAGE_GUIDE: {
  identity: ModalGuideIdentity;
  steps: ModalGuideStep[];
} = {
  identity: {
    guideId: 'account.merge-wizard.review',
    version: 1,
    dataKey: 'accountMergeWizardReviewGuide',
  },
  steps: [
    {
      id: 'review',
      titleKey: 'guide.merge-wizard.review.title',
      descriptionKey: 'guide.merge-wizard.review.description',
      targetSelector: target('account-merge.review'),
      placement: 'auto',
    },
  ],
};
