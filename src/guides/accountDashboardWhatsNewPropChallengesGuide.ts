import { t } from '../lang/helpers';
import { ACCOUNT_DASHBOARD_VIEW_TYPE } from '../views/AccountDashboardView';
import {
  ACCOUNT_DASHBOARD_CHALLENGES_SELECTED_ACTION_ID,
  ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
  ACCOUNT_DASHBOARD_CHALLENGE_OVERVIEW_TARGET_ID,
  ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
  ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID,
  ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
  ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID,
} from './accountDashboardGuideIds';
import { GuideRegistry } from './GuideRegistry';
import { getPluginInstance } from '../utils/pluginContext';
import {
  LEGACY_CHALLENGE_ONBOARDING_GUIDE_CONTEXT_KEY,
  markLegacyChallengeOnboarding,
} from '../services/accountMerge/LegacyChallengeOnboarding';
import { openLegacyChallengeOnboardingModal } from '../components/onboarding/legacyChallenge/LegacyChallengeOnboardingModal';


export function registerAccountDashboardWhatsNewPropChallengesGuide(
  guideRegistry: GuideRegistry
): void {
  guideRegistry.registerGuide({
    id: ACCOUNT_DASHBOARD_WHATS_NEW_PROP_CHALLENGES_GUIDE_ID,
    viewType: ACCOUNT_DASHBOARD_VIEW_TYPE,
    version: 9,
    autoShow: true,
    priority: 105,
    replayGuideId: ACCOUNT_DASHBOARD_MAIN_GUIDE_ID,
    initialStepId: 'intro',
    steps: [
      {
        id: 'intro',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.intro.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.intro.description'
        ),
        progression: 'manual',
        placement: 'center',
      },
      {
        id: 'enable-tracking',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.enable.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.enable.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_CREATE_BUTTON_TARGET_ID,
      },
      {
        id: 'mode-switch',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.mode.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.mode.description'
        ),
        progression: 'action-required',
        targetId: ACCOUNT_DASHBOARD_MODE_SWITCH_TARGET_ID,
        requiredActionId: ACCOUNT_DASHBOARD_CHALLENGES_SELECTED_ACTION_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'challenge-overview',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.overview.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.overview.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_CHALLENGE_OVERVIEW_TARGET_ID,
        skipIfTargetMissing: true,
      },
      {
        id: 'phase-ribbons',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.ribbons.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.ribbons.description'
        ),
        progression: 'manual',
        targetId: ACCOUNT_DASHBOARD_SECTIONS_TARGET_ID,
        
        skipIfTargetMissing: true,
      },
      {
        id: 'account-page',
        title: t(
          'account-dashboard.guide.whats-new.prop-challenges.account-page.title'
        ),
        description: t(
          'account-dashboard.guide.whats-new.prop-challenges.account-page.description'
        ),
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
