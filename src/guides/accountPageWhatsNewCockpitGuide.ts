import { t } from '../lang/helpers';
import { ACCOUNT_PAGE_VIEW_TYPE } from '../views/AccountPageView';
import {
  ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID,
  ACCOUNT_PAGE_MAIN_GUIDE_ID,
  ACCOUNT_PAGE_PAYOUT_SECTION_TARGET_ID,
  ACCOUNT_PAGE_SUMMARY_BAND_TARGET_ID,
  ACCOUNT_PAGE_WHATS_NEW_COCKPIT_GUIDE_ID,
} from './accountPageGuideIds';
import { GuideRegistry } from './GuideRegistry';
import { getPluginInstance } from '../utils/pluginContext';
import {
  LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY,
  markLegacyChallengeOnboarding,
} from '../services/accountMerge/LegacyChallengeOnboarding';
import { openLegacyChallengeOnboardingModal } from '../components/onboarding/legacyChallenge/LegacyChallengeOnboardingModal';


export function registerAccountPageWhatsNewCockpitGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_PAGE_WHATS_NEW_COCKPIT_GUIDE_ID,
    viewType: ACCOUNT_PAGE_VIEW_TYPE,
    version: 10,
    autoShow: true,
    priority: 105,
    replayGuideId: ACCOUNT_PAGE_MAIN_GUIDE_ID,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t('account-page.guide.whats-new.cockpit.intro.title'),
        description: t(
          'account-page.guide.whats-new.cockpit.intro.description'
        ),
        progression: 'manual',
        placement: 'center',
      },
      {
        
        
        id: 'summary',
        title: t('account-page.guide.whats-new.cockpit.summary.title'),
        description: t(
          'account-page.guide.whats-new.cockpit.summary.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_SUMMARY_BAND_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        
        id: 'cockpit',
        title: t('account-page.guide.whats-new.cockpit.cockpit.title'),
        description: t(
          'account-page.guide.whats-new.cockpit.cockpit.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_CHALLENGE_SECTION_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'payout-readiness',
        title: t('account-page.guide.whats-new.cockpit.payout.title'),
        description: t(
          'account-page.guide.whats-new.cockpit.payout.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_PAGE_PAYOUT_SECTION_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        
        
        id: 'risk-authority',
        title: t('account-page.guide.whats-new.cockpit.risk.title'),
        description: t('account-page.guide.whats-new.cockpit.risk.description'),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'profile-library',
        title: t('account.profiles.library'),
        description: `${t('account.profiles.guide')} ${t('account.profiles.correction-guide')}`,
        progression: 'manual',
        placement: 'center',
      },
      {
        
        id: 'legacy-setup',
        title: t('guide.legacy-challenge.title'),
        description: t('guide.legacy-challenge.description'),
        progression: 'manual',
        placement: 'center',
        requiredContext: {
          key: LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY,
          equals: true,
        },
        action: {
          label: t('guide.legacy-challenge.action'),
          run: () => {
            const plugin = getPluginInstance();
            if (plugin)
              void openLegacyChallengeOnboardingModal(plugin.app, plugin);
          },
        },
        onDismiss: () => {
          const plugin = getPluginInstance();
          if (plugin) void markLegacyChallengeOnboarding(plugin, 'skipped');
        },
      },
    ],
  });
}
